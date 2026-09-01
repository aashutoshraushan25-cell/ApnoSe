import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Community } from '../models/Community';
import { CommunityMember } from '../models/CommunityMember';
import { sendSuccess, sendError } from '../utils/response';
import { getPaginationOptions, buildPaginationMetadata } from '../utils/pagination';

export class CommunityController {
  /**
   * POST /api/v1/communities
   */
  public static async createCommunity(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const creatorId = req.user?.userId!;
      const { name, description, category, coverImage, avatarImage, privacy, location } = req.body;

      const community = new Community({
        name: name.trim(),
        description: description.trim(),
        category,
        coverImage,
        avatarImage,
        creatorId: new mongoose.Types.ObjectId(creatorId),
        privacy: privacy || 'public',
        location,
        membersCount: 1,
      });

      await community.save();

      // Add creator as creator role in CommunityMember
      await CommunityMember.create({
        communityId: community._id,
        userId: new mongoose.Types.ObjectId(creatorId),
        role: 'creator',
      });

      return sendSuccess(res, community, 'समुदाय (Community) सफलतापूर्वक बनाया गया! 🌿', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/communities
   */
  public static async getCommunities(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { category, search, page, limit } = req.query;
      const { page: p, limit: l, skip } = getPaginationOptions(page, limit);

      const filter: any = {};
      if (category) filter.category = category;
      if (search && typeof search === 'string') {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [{ name: regex }, { description: regex }, { location: regex }];
      }

      const total = await Community.countDocuments(filter);
      const communities = await Community.find(filter)
        .sort({ membersCount: -1, createdAt: -1 })
        .skip(skip)
        .limit(l)
        .populate('creatorId', 'name profilePhoto age location')
        .lean();

      return sendSuccess(res, communities, undefined, 200, buildPaginationMetadata(total, p, l));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/communities/:id
   */
  public static async getCommunityById(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const community = await Community.findById(id).populate('creatorId', 'name profilePhoto age location');
      if (!community) {
        return sendError(res, 'समुदाय नहीं मिला।', 404, 'NOT_FOUND');
      }

      let isMember = false;
      let memberRole: string | null = null;

      if (userId) {
        const membership = await CommunityMember.findOne({
          communityId: new mongoose.Types.ObjectId(id),
          userId: new mongoose.Types.ObjectId(userId),
        });
        if (membership) {
          isMember = true;
          memberRole = membership.role;
        }
      }

      return sendSuccess(res, { ...community.toJSON(), isMember, memberRole });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/communities/:id
   */
  public static async updateCommunity(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const { name, description, coverImage, avatarImage, privacy, location } = req.body;

      const community = await Community.findById(id);
      if (!community) {
        return sendError(res, 'समुदाय नहीं मिला।', 404, 'NOT_FOUND');
      }

      // Check permissions (creator or admin)
      if (community.creatorId.toString() !== userId && req.user?.role !== 'admin') {
        return sendError(res, 'आप इस समुदाय को संपादित नहीं कर सकते।', 403, 'FORBIDDEN');
      }

      if (name) community.name = name.trim();
      if (description) community.description = description.trim();
      if (coverImage) community.coverImage = coverImage;
      if (avatarImage) community.avatarImage = avatarImage;
      if (privacy) community.privacy = privacy;
      if (location) community.location = location;

      await community.save();
      return sendSuccess(res, community, 'समुदाय विवरण अपडेट किया गया।');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/communities/:id
   */
  public static async deleteCommunity(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const community = await Community.findById(id);
      if (!community) {
        return sendError(res, 'समुदाय नहीं मिला।', 404, 'NOT_FOUND');
      }

      if (community.creatorId.toString() !== userId && req.user?.role !== 'admin') {
        return sendError(res, 'आप इस समुदाय को हटा नहीं सकते।', 403, 'FORBIDDEN');
      }

      await Community.findByIdAndDelete(id);
      await CommunityMember.deleteMany({ communityId: new mongoose.Types.ObjectId(id) });

      return sendSuccess(res, null, 'समुदाय हटा दिया गया।');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/communities/:id/join
   */
  public static async joinCommunity(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId!;

      const community = await Community.findById(id);
      if (!community) {
        return sendError(res, 'समुदाय नहीं मिला।', 404, 'NOT_FOUND');
      }

      const existing = await CommunityMember.findOne({
        communityId: new mongoose.Types.ObjectId(id),
        userId: new mongoose.Types.ObjectId(userId),
      });

      if (existing) {
        return sendSuccess(res, existing, 'आप पहले से इस समुदाय के सदस्य हैं।');
      }

      const member = await CommunityMember.create({
        communityId: new mongoose.Types.ObjectId(id),
        userId: new mongoose.Types.ObjectId(userId),
        role: 'member',
      });

      await Community.findByIdAndUpdate(id, { $inc: { membersCount: 1 } });

      return sendSuccess(res, member, 'समुदाय में सफलतापूर्वक शामिल हुए! 🌿', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/communities/:id/leave
   */
  public static async leaveCommunity(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId!;

      const deleted = await CommunityMember.findOneAndDelete({
        communityId: new mongoose.Types.ObjectId(id),
        userId: new mongoose.Types.ObjectId(userId),
      });

      if (deleted) {
        await Community.findByIdAndUpdate(id, { $inc: { membersCount: -1 } });
      }

      return sendSuccess(res, null, 'समुदाय छोड़ दिया गया।');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/communities/:id/members
   */
  public static async getCommunityMembers(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params;
      const { page, limit } = req.query;
      const { page: p, limit: l, skip } = getPaginationOptions(page, limit);

      const filter = { communityId: new mongoose.Types.ObjectId(id) };
      const total = await CommunityMember.countDocuments(filter);

      const members = await CommunityMember.find(filter)
        .skip(skip)
        .limit(l)
        .populate('userId', 'name profilePhoto age location bio language')
        .lean();

      return sendSuccess(res, members, undefined, 200, buildPaginationMetadata(total, p, l));
    } catch (error) {
      next(error);
    }
  }
}
