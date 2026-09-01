import mongoose from 'mongoose';
import { Post, IPost, PostVisibility } from '../models/Post';
import { Friendship } from '../models/Friendship';
import { FamilyMember } from '../models/FamilyMember';
import { BlockedUser } from '../models/BlockedUser';
import { Like } from '../models/Like';
import { getPaginationOptions, buildPaginationMetadata } from '../utils/pagination';

export class PostService {
  /**
   * Generates tailored feed for senior users
   */
  public static async getFeed(
    userId: string,
    queryPage?: any,
    queryLimit?: any
  ): Promise<{ posts: any[]; pagination: any }> {
    const { page, limit, skip } = getPaginationOptions(queryPage, queryLimit);
    const userObjId = new mongoose.Types.ObjectId(userId);

    // 1. Get blocked users list (both directions)
    const blocks = await BlockedUser.find({
      $or: [{ userId: userObjId }, { blockedUserId: userObjId }],
    });
    const blockedUserIds = blocks.map((b) =>
      b.userId.equals(userObjId) ? b.blockedUserId : b.userId
    );

    // 2. Get accepted friends list
    const friendships = await Friendship.find({
      status: 'accepted',
      $or: [{ requesterId: userObjId }, { recipientId: userObjId }],
    });
    const friendIds = friendships.map((f) =>
      f.requesterId.equals(userObjId) ? f.recipientId : f.requesterId
    );

    // 3. Get confirmed family members list
    const familyRelations = await FamilyMember.find({
      status: 'confirmed',
      $or: [{ userId: userObjId }, { memberId: userObjId }],
    });
    const familyIds = familyRelations.map((fm) =>
      fm.userId.equals(userObjId) ? fm.memberId : fm.userId
    );

    // 4. Construct Feed Filter
    const feedFilter: any = {
      authorId: { $nin: blockedUserIds },
      $or: [
        // Own posts (all)
        { authorId: userObjId },
        // Family posts (public, friends, family)
        { authorId: { $in: familyIds }, visibility: { $in: ['public', 'friends', 'family'] } },
        // Friends posts (public, friends)
        { authorId: { $in: friendIds }, visibility: { $in: ['public', 'friends'] } },
        // Public posts from non-friends
        { visibility: 'public' },
      ],
    };

    const total = await Post.countDocuments(feedFilter);
    const posts = await Post.find(feedFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('authorId', 'name profilePhoto age location isVerified language')
      .lean();

    // 5. Populate active user's reactions
    const postIds = posts.map((p) => p._id);
    const userLikes = await Like.find({
      userId: userObjId,
      targetType: 'post',
      targetId: { $in: postIds },
    });

    const likeMap = new Map(userLikes.map((l) => [l.targetId.toString(), l.reaction]));

    const populatedPosts = posts.map((p) => ({
      ...p,
      userReaction: likeMap.get(p._id.toString()) || null,
      isLiked: likeMap.has(p._id.toString()),
    }));

    return {
      posts: populatedPosts,
      pagination: buildPaginationMetadata(total, page, limit),
    };
  }
}
