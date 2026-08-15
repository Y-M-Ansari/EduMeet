# EduMeet

Live demo: https://edumeet-yma.netlify.app/

EduMeet is a modern live classroom and virtual session platform where users can sign up, create sessions, invite participants, and join real-time video meetings. The app is designed for online learning, team discussions, and remote collaboration.

## Features

- User authentication and registration
- Create a live class room/session
- Join a room using a room ID
- Real-time video and audio communication using ZegoCloud
- Participant list with host and participant roles
- Session dashboard and session history
- Responsive UI for desktop and mobile screens
- Secure API routes with JWT authentication

## Tech Stack

### Frontend

- React
- React Router
- Axios
- Tailwind CSS
- ZegoCloud UIKit Prebuilt

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- CORS and dotenv configuration

## Project Structure

```bash
live-class-main/
├── client/
│   ├── public/
│   ├── src/
│   ├── .env
│   ├── package.json
│   └── README.md
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── model/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   ├── index.js
│   └── package.json
└── README.md
```

## Live Demo

https://edumeet-yma.netlify.app/

## Getting Started

### Prerequisites

- Node.js (v18 or above)
- npm or yarn
- MongoDB database
- ZegoCloud account with App ID and Server Secret

### 1. Clone the project

```bash
git clone <your-repository-url>
cd live-class-main
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

### 4. Configure environment variables

#### Frontend environment (.env in client)

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ZEGO_APP_ID=your_zego_app_id
```

Important:

- Do not expose the Zego server secret in the frontend.
- The secret must stay on the backend server only.

#### Backend environment (.env in server)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/edumeet
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
NODE_ENV=development
ZEGO_APP_ID=your_zego_app_id
ZEGO_SERVER_SECRET=your_zego_server_secret
```

### 5. Start the backend

```bash
cd server
npm run dev
```

### 6. Start the frontend

```bash
cd client
npm start
```

The app will run on:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Production Deployment Notes

For production deployment:

- Host the frontend on Netlify, Vercel, or similar
- Host the backend on Render, Railway, Heroku, or a Node.js VPS
- Set real environment variables in the hosting platform
- Keep `ZEGO_SERVER_SECRET` only on the backend
- Use `REACT_APP_API_URL` and `REACT_APP_ZEGO_APP_ID` on the frontend only

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Sessions

- `POST /api/session/create`
- `POST /api/session/join`
- `GET /api/session/:roomId`
- `POST /api/session/end/:sessionId`
- `POST /api/session/leave`
- `GET /api/session/list`

### Zego

- `POST /api/zego/token`

## License

This project is for educational and demonstration purposes.

## Contact

For support or collaboration, please contact the project maintainer YM Ansari.
