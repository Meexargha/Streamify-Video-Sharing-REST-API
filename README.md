# 🎬 Streamify — Video Sharing REST API

A full-featured **video sharing REST API** built with Node.js, Express, MongoDB, and Cloudinary. Users can sign up, log in, upload videos with thumbnails, manage their content, like/unlike, subscribe to channels, and browse all videos.

---

## 🚀 Features

- 🔐 **User Authentication** — Sign up & login with JWT (10-day expiry)
- 📤 **Video Upload** — Upload videos + thumbnails to Cloudinary
- ✏️ **Video Management** — Update or delete your own videos
- 👤 **Profile Management** — Update channel name, phone & profile picture
- 👍 **Likes** — Like/unlike videos
- 👁️ **View Tracking** — Track who viewed each video
- 🔔 **Channel Subscription** — Subscribe/unsubscribe to channels
- 📋 **Browse All** — Get all videos or your own uploads

---

## 📝 About

Streamify is a **modern video sharing platform** designed for content creators and viewers alike. Built with scalability and user experience in mind, this REST API provides a complete solution for hosting and sharing video content online.

### 🎯 Project Purpose

Streamify enables users to:
- Create professional channels with custom profiles
- Upload high-quality videos with advanced metadata support
- Build engaged audiences through subscription systems
- Interact with content through likes, views, and comments
- Manage their entire video library from a single dashboard

### 🌟 Key Differentiators

- **Real-time Engagement** — Track views, likes, and subscriber growth instantly
- **Content Discovery** — Browse trending videos and personalized recommendations
- **Creator Tools** — Comprehensive analytics and management tools for content creators
- **Enterprise Ready** — Scalable architecture supporting millions of users
- **Modern Tech Stack** — Built with the latest Node.js and Express best practices

### 🏢 Use Cases

**For Content Creators:**
- Personal vlogs and diaries
- Educational tutorials and courses
- Business promotional videos
- Gaming and entertainment channels

**For Viewers:**
- Discovering new content
- Following favorite creators
- Building personalized watchlists
- Sharing content with friends

### 📈 Future Roadmap

- 🔄 **Real-time Chat** — Live video chat functionality
- 🎥 **Live Streaming** — Go live with your audience
- 🎬 **Video Analytics** — Detailed creator analytics dashboard
- 👥 **Community Features** — Create and join communities
- 🌍 **Multi-language Support** — Global content accessibility

### 💼 Architecture Highlights

- **Modular Design** — Clean separation of concerns for easy maintenance
- **Security First** — JWT authentication with token expiration
- **Performance Optimized** — Efficient database queries and caching strategies
- **Cloud-Native** — Built on Cloudinary for scalable media storage
- **API-First** — Designed for integration with mobile and web applications

> 💡 **Why Streamify?** Because sharing video content should be effortless, secure, and engaging — for both creators and viewers.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (Mongoose) |
| File Storage | Cloudinary |
| Authentication | JSON Web Token (JWT) |
| File Upload | express-fileupload |
| Env Config | dotenv |

---

## 📦 Installation

### 1. Clone the repo
```bash
git clone https://github.com/Meexargha/Streamify-Video-Sharing-REST-API.git
cd Streamify-Video-Sharing-REST-API
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: `3000`) |
| `MONGO_URI` | MongoDB connection string |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |
| `JWT_SECRET` | Secret key for signing JWT tokens |

### 4. Start the server
```bash
npm run dev
```
Server runs at `http://localhost:3000`

---

## 📡 API Endpoints

### 🔑 Authentication (No auth required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/users/signup` | Create a new user account |
| `POST` | `/api/v1/users/login` | Login with email & password |

### 📱 Postman API Testing

You can test all API endpoints using the official Postman collection:

🔗 **Postman Collection**: [Download Streamify Video API Collection](postman-collection.json)

#### Postman Collection Features:

- ✅ All endpoints (Auth, User, Video routes)
- ✅ Request/response examples
- ✅ Variables setup (base URL, auth tokens)
- ✅ Form data and JSON bodies
- ✅ File upload support
- ✅ Error handling examples

#### Quick Start with Postman:

1. **Install Postman** (Desktop app or web)
2. **Import Collection**:
   - Click `Import` → Select `postman-collection.json`
   - Or paste this raw URL: `https://github.com/Meexargha/Streamify-Video-Sharing-REST-API/raw/main/postman-collection.json`
3. **Set Environment Variables**:
   - Create environment: `baseUrl = http://localhost:3000`
   - Update `YOUR_JWT_TOKEN` with actual token from login response
4. **Test Endpoints**:
   - Use the built-in test cases for expected responses
   - Import collections automatically validate responses

#### Expected Response Formats:

**User Signup (POST /api/v1/users/signup)**:
```json
{
  "message": "User created successfully",
  "user": {
    "_id": "user_id_here"
  }
}
```

**User Login (POST /api/v1/users/login)**:
```json
{
  "_id": "user_id_here",
  "channelName": "channel_name",
  "email": "user@example.com",
  "phone": "phone_number",
  "logoId": "logo_id",
  "logoUrl": "https://cloudinary.com/logo_url",
  "token": "jwt_token_here",
  "subscription": "plan_type",
  "subscribedChannels": ["channel_id1", "channel_id2"]
}
```

**Video Upload (POST /api/v1/videos/upload)**:
```json
{
  "message": "Video uploaded successfully",
  "video": {
    "_id": "video_id_here",
    "title": "video_title",
    "description": "video_description"
  }
}
```

**Error Responses** (all error endpoints return similar format):
```json
{
  "error": "Error message"
}
```

> 💡 **Tip**: Use the Postman collection's built-in tests to automatically validate response formats and status codes.

---

### 👤 User Routes (Auth required — send JWT in `Authorization: Bearer <token>` header)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `PUT` | `/api/v1/users/update-profile` | Update profile (name, phone, logo) |
| `POST` | `/api/v1/users/subscribe` | Subscribe to a channel |

### 🎥 Video Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/v1/videos/upload` | Upload video + thumbnail | ✅ |
| `PUT` | `/api/v1/videos/update/:id` | Update video details | ✅ (owner) |
| `DELETE` | `/api/v1/videos/delete/:id` | Delete video | ✅ (owner) |
| `GET` | `/api/v1/videos/all` | Get all videos (latest first) | ❌ |
| `GET` | `/api/v1/videos/my-videos` | Get your uploaded videos | ✅ |
| `GET` | `/api/v1/videos/:id` | Get video details + track view | ✅ |
| `POST` | `/api/v1/videos/like` | Like/unlike a video | ✅ |

---

## 📂 Project Structure

```
Streamify-Video-Sharing-REST-API/
├── config/
│   ├── db.js              # MongoDB connection
│   └── cloudinary.js      # Cloudinary configuration
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── models/
│   ├── user.js            # User schema
│   └── video.js           # Video schema
├── routes/
│   ├── userRoutes.js      # User endpoints
│   └── videoRoutes.js     # Video endpoints
├── .env.example           # Environment template
├── .gitignore
├── index.js               # Entry point
├── package.json
└── README.md
```

---

## 🧪 Usage Example

### Sign Up
```bash
curl -X POST http://localhost:3000/api/v1/users/signup \
  -F "email=test@test.com" \
  -F "password=password123" \
  -F "channelName=MyChannel" \
  -F "phone=1234567890" \
  -F "logoUrl=@logo.png"
```

### Upload a Video (after login)
```bash
curl -X POST http://localhost:3000/api/v1/videos/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=My Video" \
  -F "description=Description here" \
  -F "category=Education" \
  -F "tags=tag1,tag2" \
  -F "video=@video.mp4" \
  -F "thumbnail=@thumbnail.jpg"
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or pull requests.

---

## 📄 License

ISC
