import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { User } from '../models/User';
import { Post } from '../models/Post';
import { Comment } from '../models/Comment';
import { Like } from '../models/Like';
import { Friendship } from '../models/Friendship';
import { FamilyMember } from '../models/FamilyMember';
import { Community } from '../models/Community';
import { CommunityMember } from '../models/CommunityMember';
import { Conversation } from '../models/Conversation';
import { Message } from '../models/Message';
import { Notification } from '../models/Notification';
import { hashPassword } from '../utils/password';

const seedData = async () => {
  try {
    console.log('🌱 Connecting to MongoDB for seeding...');
    await connectDatabase();

    console.log('🧹 Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Post.deleteMany({}),
      Comment.deleteMany({}),
      Like.deleteMany({}),
      Friendship.deleteMany({}),
      FamilyMember.deleteMany({}),
      Community.deleteMany({}),
      CommunityMember.deleteMany({}),
      Conversation.deleteMany({}),
      Message.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    console.log('👤 Seeding senior persona users (40+)...');
    const defaultPasswordHash = await hashPassword('123456');

    const usersData = [
      {
        name: 'राजेश कुमार',
        email: 'rajesh.kumar@apnose.in',
        phone: '+91 98100 12345',
        passwordHash: defaultPasswordHash,
        dateOfBirth: new Date('1972-04-15'),
        gender: 'male',
        profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
        coverPhoto: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=1200',
        bio: 'सेवानिवृत्त शिक्षक | बागवानी और पुरानी धुनों का प्रेमी। 🌸 परिवार ही सब कुछ है।',
        location: 'नई दिल्ली, भारत',
        language: 'hi',
        role: 'user',
        isVerified: true,
      },
      {
        name: 'सुनीता कुमार',
        email: 'sunita.kumar@apnose.in',
        phone: '+91 98100 67890',
        passwordHash: defaultPasswordHash,
        dateOfBirth: new Date('1976-08-20'),
        gender: 'female',
        profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
        coverPhoto: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=1200',
        bio: 'पारंपरिक व्यंजन, गृह वाटिका और बच्चों की परवरिश। खुश रहें, सकारात्मक रहें। 🌼',
        location: 'नई दिल्ली, भारत',
        language: 'hi',
        role: 'user',
        isVerified: true,
      },
      {
        name: 'सुरेश वर्मा',
        email: 'suresh.verma@apnose.in',
        phone: '+91 98200 11223',
        passwordHash: defaultPasswordHash,
        dateOfBirth: new Date('1968-01-10'),
        gender: 'male',
        profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
        coverPhoto: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
        bio: 'लखनऊ की तहज़ीब और भारतीय शास्त्रीय संगीत का शौकीन। ☕',
        location: 'लखनऊ, उत्तर प्रदेश',
        language: 'hi',
        role: 'user',
        isVerified: true,
      },
      {
        name: 'मीनाक्षी शर्मा',
        email: 'meenakshi.sharma@apnose.in',
        phone: '+91 98300 44556',
        passwordHash: defaultPasswordHash,
        dateOfBirth: new Date('1978-11-05'),
        gender: 'female',
        profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
        coverPhoto: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200',
        bio: 'हस्तशिल्प और राजस्थानी लोकगीतों से जुड़ी। 🎨',
        location: 'जयपुर, राजस्थान',
        language: 'hi',
        role: 'user',
        isVerified: true,
      },
      {
        name: 'अमित शर्मा',
        email: 'amit.sharma@apnose.in',
        phone: '+91 98400 77889',
        passwordHash: defaultPasswordHash,
        dateOfBirth: new Date('1981-06-12'),
        gender: 'male',
        profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
        coverPhoto: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=1200',
        bio: 'योग, ध्यान और आध्यात्मिक जीवन यात्रा। 🧘‍♂️ काशी की गलियां।',
        location: 'वाराणसी, उत्तर प्रदेश',
        language: 'hi',
        role: 'user',
        isVerified: true,
      },
    ];

    const users = await User.insertMany(usersData);
    const [rajesh, sunita, suresh, meenakshi, amit] = users;

    console.log('👨‍👩‍👧‍👦 Seeding family relations...');
    await FamilyMember.insertMany([
      {
        userId: rajesh._id,
        memberId: sunita._id,
        relationship: 'wife',
        status: 'confirmed',
      },
      {
        userId: sunita._id,
        memberId: rajesh._id,
        relationship: 'husband',
        status: 'confirmed',
      },
    ]);

    console.log('🤝 Seeding friendships...');
    await Friendship.insertMany([
      {
        requesterId: rajesh._id,
        recipientId: suresh._id,
        status: 'accepted',
      },
      {
        requesterId: rajesh._id,
        recipientId: amit._id,
        status: 'accepted',
      },
      {
        requesterId: sunita._id,
        recipientId: meenakshi._id,
        status: 'accepted',
      },
    ]);

    console.log('🌿 Seeding communities...');
    const communitiesData = [
      {
        name: 'भारतीय गृह वाटिका व बागवानी (Gardening Club)',
        description: 'गमलों में सब्जियां, तुलसी की देखभाल, गुलाब और फूलों के पौधों की चर्चा व अनुभव साझा करें। 🌿',
        category: 'Gardening',
        coverImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=1200',
        avatarImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400',
        creatorId: rajesh._id,
        privacy: 'public',
        membersCount: 4,
        location: 'अखिल भारतीय',
      },
      {
        name: 'पारंपरिक भारतीय रसोई व दादी-नानी के नुस्खे',
        description: 'शुद्ध देसी घी की मिठाइयां, अचार, पापड़ और स्वास्थ्यवर्धक पारंपरिक व्यंजन। 🍲',
        category: 'Cooking',
        coverImage: 'https://images.unsplash.com/photo-1613292443284-c77051268e0d?auto=format&fit=crop&q=80&w=1200',
        avatarImage: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=400',
        creatorId: sunita._id,
        privacy: 'public',
        membersCount: 3,
        location: 'अखिल भारतीय',
      },
      {
        name: 'दैनिक सुविचार, भजन व आध्यात्मिक सत्संग',
        description: 'सुबह का सुविचार, गीता के श्लोक, रामायण प्रसंग और मन की शांति के लिए विचार। 🪔',
        category: 'Spirituality',
        coverImage: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&q=80&w=1200',
        avatarImage: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=400',
        creatorId: amit._id,
        privacy: 'public',
        membersCount: 5,
        location: 'वाराणसी, उत्तर प्रदेश',
      },
    ];

    const communities = await Community.insertMany(communitiesData);

    for (const comm of communities) {
      await CommunityMember.create({
        communityId: comm._id,
        userId: comm.creatorId,
        role: 'creator',
      });
    }

    console.log('📝 Seeding posts...');
    const postsData = [
      {
        authorId: rajesh._id,
        content: 'आज सुबह छत के बगीचे में पहली बार पीले गुलाब खिले हैं! जब पौधे अपने हाथों से सींचे जाएं तो उनकी खुशबू अलग ही सुकून देती है। सभी प्रियजनों को शुभ प्रभात! 🌸🍃',
        media: ['https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&q=80&w=800'],
        mediaType: 'image',
        visibility: 'friends',
        location: 'नई दिल्ली',
        feeling: 'आनंदित (Happy)',
        likesCount: 12,
        commentsCount: 3,
      },
      {
        authorId: sunita._id,
        content: 'आज दोपहर में पुरानी रेसिपी से आम का हींग वाला अचार डाला है। बचपन में मां भी बिल्कुल इसी तरह बनाती थीं। यादें ताज़ा हो गईं! 🥭🍯',
        media: ['https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=800'],
        mediaType: 'image',
        visibility: 'family',
        location: 'नई दिल्ली',
        feeling: 'यादगार (Nostalgic)',
        likesCount: 8,
        commentsCount: 2,
      },
      {
        authorId: suresh._id,
        content: 'शाम की चाय और पुराने दोस्तों के साथ लखनऊ के चौक की यादें... जीवन में अपनों का साथ ही सबसे बड़ी पूंजी है। ☕✨',
        media: ['https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800'],
        mediaType: 'image',
        visibility: 'public',
        location: 'हजरतगंज, लखनऊ',
        feeling: 'आभारी (Grateful)',
        likesCount: 15,
        commentsCount: 4,
      },
      {
        authorId: amit._id,
        content: 'दैनिक सुविचार: "संबंधों की मिठास शब्दों से नहीं, अपनों के प्रति सम्मान और समय देने से बढ़ती है।" शुभ संध्या! 🪔🙏',
        media: [],
        mediaType: 'text',
        visibility: 'public',
        location: 'दशाश्वमेध घाट, वाराणसी',
        feeling: 'शांत (Peaceful)',
        likesCount: 22,
        commentsCount: 5,
      },
    ];

    const posts = await Post.insertMany(postsData);

    console.log('💬 Seeding conversation and messages...');
    const conv = new Conversation({
      participants: [rajesh._id, suresh._id],
      isGroup: false,
      lastMessage: {
        senderId: suresh._id,
        text: 'नमस्ते राजेश भाई! सब कुशल मंगल? कल शाम की चाय साथ पीते हैं।',
        mediaType: 'text',
        createdAt: new Date(),
      },
      unreadCounts: new Map([[rajesh._id.toString(), 1], [suresh._id.toString(), 0]]),
    });
    await conv.save();

    await Message.insertMany([
      {
        conversationId: conv._id,
        senderId: rajesh._id,
        type: 'text',
        content: 'सुरेश जी, सादर प्रणाम! आपका स्वास्थ्य कैसा है?',
        readBy: [rajesh._id, suresh._id],
      },
      {
        conversationId: conv._id,
        senderId: suresh._id,
        type: 'text',
        content: 'नमस्ते राजेश भाई! सब कुशल मंगल? कल शाम की चाय साथ पीते हैं।',
        readBy: [suresh._id],
      },
    ]);

    console.log('🔔 Seeding notifications...');
    await Notification.create({
      recipientId: rajesh._id,
      senderId: suresh._id,
      type: 'like',
      title: 'नया स्नेह (Like)',
      body: 'सुरेश वर्मा ने आपकी पोस्ट को पसंद किया ❤️',
      targetId: posts[0]._id,
      targetModel: 'Post',
    });

    console.log(`
=====================================================
✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!
=====================================================
👥 Users Seeded        : ${users.length} (40+ Verified)
👨‍👩‍👧‍👦 Family Relations  : 2
🤝 Friendships         : 3
🌿 Communities         : ${communities.length}
📝 Posts               : ${posts.length}
💬 Conversations       : 1 (with 2 messages)
🔔 Notifications       : 1
=====================================================
Default Login Credentials:
- Rajesh  : rajesh.kumar@apnose.in / +91 98100 12345 (Pass: 123456)
- Sunita  : sunita.kumar@apnose.in / +91 98100 67890 (Pass: 123456)
- Suresh  : suresh.verma@apnose.in / +91 98200 11223 (Pass: 123456)
- Meenakshi: meenakshi.sharma@apnose.in / +91 98300 44556 (Pass: 123456)
- Amit    : amit.sharma@apnose.in / +91 98400 77889 (Pass: 123456)
=====================================================
    `);

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

seedData();
