import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// ===============================
// MongoDB Connection
// ===============================

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/apnose';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`✅ MongoDB Connected Successfully to: ${MONGO_URI}`);
  })
  .catch((error) => {
    console.error('❌ MongoDB Connection Failed:', error.message);
  });



// ===============================
// MongoDB Schemas
// ===============================

const postSchema = new mongoose.Schema(
  {
    authorId: {
      type: String,
      required: true,
    },

    authorName: {
      type: String,
      required: true,
    },

    authorAvatar: {
      type: String,
      default: '',
    },

    authorLocation: {
      type: String,
      default: '',
    },

    authorRelation: {
      type: String,
      default: '',
    },

    text: {
      type: String,
      default: '',
    },

    likesCount: {
      type: Number,
      default: 0,
    },

    commentsCount: {
      type: Number,
      default: 0,
    },

    audience: {
      type: String,
      default: 'everyone',
    },
  },
  {
    timestamps: true,
  }
);


const familySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    relationship: {
      type: String,
      default: '',
    },

    relationshipLabelHi: {
      type: String,
      default: '',
    },

    mobile: {
      type: String,
      default: '',
    },

    location: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);


const reportSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: '',
    },

    description: {
      type: String,
      default: '',
    },

    userId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);


// ===============================
// Models
// ===============================

const Post = mongoose.model('Post', postSchema);
const FamilyMember = mongoose.model('FamilyMember', familySchema);
const Report = mongoose.model('Report', reportSchema);


// ===============================
// Health Check
// ===============================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Apno Se Backend Server',
    version: '1.0.0',
    database: mongoose.connection.readyState === 1
      ? 'MongoDB Connected'
      : 'MongoDB Not Connected',
  });
});


// ===============================
// POSTS
// ===============================

// Get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch posts',
    });
  }
});


// Create new post
app.post('/api/posts', async (req, res) => {
  try {
    const newPost = new Post({
      authorId: req.body.authorId,
      authorName: req.body.authorName,
      authorAvatar: req.body.authorAvatar,
      authorLocation: req.body.authorLocation,
      authorRelation: req.body.authorRelation,
      text: req.body.text,
      likesCount: 0,
      commentsCount: 0,
      audience: req.body.audience || 'everyone',
    });

    const savedPost = await newPost.save();

    res.status(201).json(savedPost);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to create post',
    });
  }
});


// Like post
app.post('/api/posts/:id/like', async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
      });
    }

    post.likesCount = (post.likesCount || 0) + 1;

    await post.save();

    res.json(post);

  } catch (error) {
    res.status(500).json({
      error: 'Failed to like post',
    });
  }
});


// ===============================
// FAMILY
// ===============================

// Get family members
app.get('/api/family', async (req, res) => {
  try {
    const familyMembers = await FamilyMember
      .find()
      .sort({ createdAt: -1 });

    res.json(familyMembers);

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch family members',
    });
  }
});


// Add family member
app.post('/api/family', async (req, res) => {
  try {
    const newMember = new FamilyMember({
      name: req.body.name,
      relationship: req.body.relationship,
      relationshipLabelHi: req.body.relationshipLabelHi,
      mobile: req.body.mobile,
      location: req.body.location,
    });

    const savedMember = await newMember.save();

    res.status(201).json(savedMember);

  } catch (error) {
    res.status(500).json({
      error: 'Failed to add family member',
    });
  }
});


// ===============================
// SAFETY REPORTS
// ===============================

app.post('/api/safety/reports', async (req, res) => {
  try {
    const report = new Report({
      type: req.body.type,
      description: req.body.description,
      userId: req.body.userId,
    });

    const savedReport = await report.save();

    res.status(201).json({
      message: 'Report received successfully',
      report: savedReport,
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to submit report',
    });
  }
});


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
  console.log(
    `🌸 Apno Se Backend Server running on http://localhost:${PORT}`
  );
});