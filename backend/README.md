# 🌸 Apno Se — Production REST API Backend

A complete, secure, scalable REST API and real-time backend for **Apno Se** — a social network specifically designed for **40+ seniors, families, and close-knit communities**.

---

## 🛠️ Technology Stack

* **Runtime & Framework**: Node.js, Express.js, TypeScript
* **Database & ODM**: MongoDB, Mongoose
* **Authentication**: JWT (15-minute Access Tokens + 7-day Rotating Refresh Tokens), bcrypt password hashing, 40+ DOB verification
* **Real-time WebSockets**: Socket.IO (Instant Messaging, Typing indicators, Online presence, Calling signaling)
* **Request Validation**: Zod
* **Security**: Helmet, CORS Whitelisting, Express Rate Limiting (Anti-Brute Force), MongoDB Query Sanitization, File MIME Validation
* **Testing**: Jest, Supertest

---

## 📁 Project Directory Structure

```text
backend/
├── src/
│   ├── config/
│   │   ├── database.ts         # Mongoose DB connection & connection lifecycle
│   │   ├── env.ts              # Zod-validated environment config
│   │   └── socket.ts           # Socket.IO event router & WebRTC signaling
│   ├── controllers/            # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── post.controller.ts
│   │   ├── comment.controller.ts
│   │   ├── friend.controller.ts
│   │   ├── family.controller.ts
│   │   ├── message.controller.ts
│   │   ├── community.controller.ts
│   │   ├── notification.controller.ts
│   │   ├── report.controller.ts
│   │   ├── birthday.controller.ts
│   │   └── search.controller.ts
│   ├── models/                 # Mongoose schemas & indexes
│   │   ├── User.ts             # 40+ DOB verification, privacy scopes, languages
│   │   ├── Post.ts             # Posts, media, visibility (public/friends/family/private)
│   │   ├── Comment.ts          # Nested comments & replies
│   │   ├── Like.ts             # Reactions (like, love, care, laugh, sad, pray)
│   │   ├── Friendship.ts       # Friend requests & statuses
│   │   ├── FamilyMember.ts     # Confirmed family relations (husband, wife, son, etc.)
│   │   ├── Conversation.ts     # 1-on-1 and group chat threads
│   │   ├── Message.ts          # Text, image, video, audio, E2EE cipher payloads
│   │   ├── Community.ts        # Gardening, cooking, spirituality, local groups
│   │   ├── CommunityMember.ts  # Community membership & roles
│   │   ├── Notification.ts     # Real-time alerts
│   │   ├── Report.ts           # Scam, spam, fraud reporting & review
│   │   └── BlockedUser.ts      # Bidirectional user block management
│   ├── routes/                 # Express API routes
│   │   └── index.ts            # Central route aggregator (/api/v1/)
│   ├── middleware/             # Security & validation middlewares
│   │   ├── auth.middleware.ts  # JWT Bearer authentication & role checks
│   │   ├── error.middleware.ts # Central error handler
│   │   ├── rateLimit.middleware.ts # Anti-brute-force rate limiting
│   │   ├── upload.middleware.ts# Multer file upload filter & limits
│   │   └── validation.middleware.ts# Zod request validation
│   ├── services/               # Business logic & algorithms
│   │   ├── auth.service.ts     # Age calculation, registration, tokens
│   │   ├── post.service.ts     # Privacy-filtered chronological feed
│   │   ├── message.service.ts  # Messaging orchestration & live socket events
│   │   ├── notification.service.ts # Push/Socket notification dispatch
│   │   └── safety.service.ts   # Heuristic scam & fraud detection engine
│   ├── utils/                  # Utility helpers
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   ├── pagination.ts
│   │   └── response.ts
│   ├── seed/
│   │   └── seed.ts             # Complete database seed script
│   ├── app.ts                  # Express application setup
│   └── server.ts               # Server startup & graceful shutdown
├── tests/
│   ├── auth.test.ts
│   └── post.test.ts
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### 1. Installation

```bash
cd backend
npm install
```

### 2. Environment Variables

Create `.env` file (copy from `.env.example`):

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/apnose
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 3. Seed Database (Optional for testing)

```bash
npm run seed
```

This seeds:

* 5 Senior Verified Profiles (राजेश कुमार, सुनीता कुमार, सुरेश वर्मा, मीनाक्षी शर्मा, अमित शर्मा)
* Passwords for all seeded users: `123456`
* Family links, friendships, communities, posts, chats, and notifications.

### 4. Start Development Server

```bash
npm run dev
```

### 5. Production Build

```bash
npm run build
npm start
```

---

## 📡 Complete REST API Documentation (`/api/v1/`)

### Health Check

* `GET /api/v1/health` — Checks API and MongoDB connection status.

---

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register new user (Enforces 40+ age via DOB) | No |
| `POST` | `/api/v1/auth/login` | Login with mobile/email + password | No |
| `POST` | `/api/v1/auth/refresh` | Rotate and issue new access & refresh tokens | No |
| `POST` | `/api/v1/auth/logout` | Revoke active refresh token | Yes |
| `GET` | `/api/v1/auth/me` | Retrieve authenticated user profile | Yes |
| `POST` | `/api/v1/auth/forgot-password` | Request password reset code | No |
| `POST` | `/api/v1/auth/reset-password` | Reset password using OTP code | No |

---

### Users (`/api/v1/users`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/users/me` | Get profile details | Yes |
| `PATCH` | `/api/v1/users/me` | Update profile (bio, location, language, photo, privacy) | Yes |
| `GET` | `/api/v1/users/search?q=` | Search users by name/location | Yes |
| `GET` | `/api/v1/users/blocked` | Get list of blocked users | Yes |
| `GET` | `/api/v1/users/:id` | Get public user profile | Yes |
| `POST` | `/api/v1/users/:id/block` | Block a user | Yes |
| `DELETE` | `/api/v1/users/:id/block` | Unblock a user | Yes |

---

### Posts & Feed (`/api/v1/posts`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/posts` | Create new post (with text, media, feeling, visibility) | Yes |
| `GET` | `/api/v1/posts/feed` | Aggregated feed (Family + Friends + Public) | Yes |
| `GET` | `/api/v1/posts/:id` | Get single post details | Yes |
| `PATCH` | `/api/v1/posts/:id` | Update post (Author only) | Yes |
| `DELETE` | `/api/v1/posts/:id` | Delete post (Author/Admin only) | Yes |
| `POST` | `/api/v1/posts/:id/like` | React to post (`like`, `love`, `care`, `laugh`, `sad`, `pray`) | Yes |
| `DELETE` | `/api/v1/posts/:id/like` | Remove reaction | Yes |
| `POST` | `/api/v1/posts/:id/share` | Increment post share counter | Yes |

---

### Comments (`/api/v1/posts/:postId/comments`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/posts/:postId/comments` | Add comment / reply | Yes |
| `GET` | `/api/v1/posts/:postId/comments` | Get post comments (paginated) | Yes |
| `PATCH` | `/api/v1/comments/:id` | Update comment | Yes |
| `DELETE` | `/api/v1/comments/:id` | Delete comment | Yes |

---

### Friends (`/api/v1/friends`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/friends` | Get accepted friends list | Yes |
| `GET` | `/api/v1/friends/requests` | Get pending incoming friend requests | Yes |
| `GET` | `/api/v1/friends/suggestions` | Get suggested friends | Yes |
| `POST` | `/api/v1/friends/:userId/request` | Send friend request | Yes |
| `POST` | `/api/v1/friends/:userId/accept` | Accept friend request | Yes |
| `POST` | `/api/v1/friends/:userId/reject` | Reject friend request | Yes |
| `DELETE` | `/api/v1/friends/:userId` | Remove friend | Yes |

---

### Family Relationships (`/api/v1/family`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/family` | Add family relation (husband, wife, son, daughter, etc.) | Yes |
| `GET` | `/api/v1/family` | Get list of family members | Yes |
| `PATCH` | `/api/v1/family/:id` | Update relation title | Yes |
| `DELETE` | `/api/v1/family/:id` | Remove from family tree | Yes |

---

### Messaging & Real-Time Chat (`/api/v1/conversations`, `/api/v1/messages`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/conversations` | Get user's conversation threads | Yes |
| `POST` | `/api/v1/conversations` | Start or retrieve 1-on-1 chat | Yes |
| `GET` | `/api/v1/conversations/:id/messages` | Get chat history with pagination | Yes |
| `POST` | `/api/v1/conversations/:id/messages` | Send text / multimedia message (Live Socket) | Yes |
| `POST` | `/api/v1/conversations/:id/read` | Mark conversation messages as read | Yes |
| `DELETE` | `/api/v1/messages/:id` | Delete message for current user | Yes |

---

### Communities (`/api/v1/communities`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/communities` | Create community (Gardening, Cooking, Spirituality, etc.) | Yes |
| `GET` | `/api/v1/communities` | Browse communities with search and category filter | No |
| `GET` | `/api/v1/communities/:id` | View community details | No |
| `PATCH` | `/api/v1/communities/:id` | Update community details | Yes |
| `DELETE` | `/api/v1/communities/:id` | Delete community | Yes |
| `POST` | `/api/v1/communities/:id/join` | Join community | Yes |
| `POST` | `/api/v1/communities/:id/leave` | Leave community | Yes |
| `GET` | `/api/v1/communities/:id/members` | Get community members list | No |

---

### Notifications (`/api/v1/notifications`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/notifications` | Get notifications & unread counter | Yes |
| `PATCH` | `/api/v1/notifications/:id/read` | Mark specific notification as read | Yes |
| `POST` | `/api/v1/notifications/read-all` | Mark all notifications as read | Yes |
| `DELETE` | `/api/v1/notifications/:id` | Delete notification | Yes |

---

### Birthdays & Anniversaries (`/api/v1/birthdays`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/birthdays/today` | Today's birthdays among family & friends | Yes |
| `GET` | `/api/v1/birthdays/upcoming` | Upcoming birthdays in the next 30 days | Yes |

---

### Safety & Scam Moderation (`/api/v1/reports`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/reports` | Report scam, spam, harassment, or fake accounts | Yes |
| `GET` | `/api/v1/reports` | View reported incidents (Moderators & Admins) | Yes (Admin) |
| `PATCH` | `/api/v1/reports/:id` | Update resolution status (Moderators & Admins) | Yes (Admin) |

---

### Media Upload (`/api/v1/upload`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/upload/single` | Upload single picture (Max 10MB) | Yes |
| `POST` | `/api/v1/upload/multiple` | Upload multiple images/videos (Max 10 files) | Yes |

---

## ⚡ Real-Time Socket.IO Events

### Client -> Server

* `conversation:join` (`conversationId`)
* `conversation:leave` (`conversationId`)
* `typing:start` (`{ conversationId, recipientId }`)
* `typing:stop` (`{ conversationId, recipientId }`)
* `message:read` (`{ conversationId, messageId }`)
* `call:initiate` (`{ recipientId, offer, callType }`)
* `call:answer` (`{ callerId, answer }`)
* `call:ice-candidate` (`{ targetUserId, candidate }`)
* `call:end` (`{ targetUserId }`)

### Server -> Client

* `user:online` (`{ userId }`)
* `user:offline` (`{ userId, lastSeen }`)
* `message:new` (`{ message, conversationId }`)
* `typing:start` (`{ conversationId, userId }`)
* `typing:stop` (`{ conversationId, userId }`)
* `message:read` (`{ conversationId, messageId, readerId }`)
* `notification:new` (`notification`)
* `call:incoming` (`{ callerId, callerName, offer, callType }`)
* `call:answered` (`{ recipientId, answer }`)
* `call:ice-candidate` (`{ senderId, candidate }`)
* `call:ended` (`{ userId }`)
