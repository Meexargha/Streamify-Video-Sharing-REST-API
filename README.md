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
