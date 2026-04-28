# 🚀 AI App Developer - Full Stack Platform

> An intelligent platform to generate fully working applications from natural language prompts, similar to ChatGPT + Replit.

## ✨ Core Features

### 🎯 **AI Prompt to App Generator**
- Convert natural language prompts into fully functional applications
- Support for HTML, CSS, JavaScript, React, Vue, Python, Node.js
- Real-time code generation using OpenAI GPT-4

### 💻 **Built-in Code Editor**
- Monaco Editor (VS Code-like experience)
- Syntax highlighting for all languages
- File explorer with folder structure
- Real-time code editing with auto-save

### 🎨 **Live Preview System**
- Split-screen layout (Editor + Preview)
- Auto-reload on code changes
- Browser console integration
- Responsive design testing tools

### 🤖 **AI Code Assistant**
- Automatic bug detection and fixing
- Code optimization suggestions
- Feature addition via prompts
- Performance analysis

### 🌐 **App Deployment**
- One-click deploy to Vercel, Netlify, Heroku
- Auto-generated public URLs
- Custom domain support
- Deployment history & rollback

### 📂 **Project Management**
- Save unlimited projects
- Version control integration
- Export code as ZIP
- GitHub push functionality
- Collaboration features

### 🔐 **Authentication System**
- Secure login/signup with JWT
- OAuth integration (GitHub, Google)
- User profiles & dashboard
- Project history tracking

## 🛠️ Tech Stack

**Frontend:**
- React.js 18+
- TailwindCSS 3+
- Monaco Editor
- Socket.io (Real-time)
- Axios (HTTP)

**Backend:**
- Node.js 18+
- Express.js
- MongoDB
- JWT Authentication
- OpenAI API

**DevOps:**
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- AWS/Vercel/Heroku (Deployment)

## 📦 Project Structure

```
AI-App-Developer/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── App.jsx
│   └── package.json
│
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.js
│   └── package.json
│
├── ai-engine/               # AI code generation
│   ├── src/
│   │   ├── generators/
│   │   ├── optimizers/
│   │   └── validators/
│   └── package.json
│
└── deployment/              # Docker & deployment
    ├── docker-compose.yml
    └── Dockerfile.*
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (Local or Atlas)
- OpenAI API Key
- Docker (Optional)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Docker Setup (Recommended)
```bash
cd deployment
docker-compose up -d
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### AI Features
- `POST /api/ai/generate` - Generate code from prompt
- `POST /api/ai/optimize` - Optimize code
- `POST /api/ai/fix` - Fix code errors

### Code Execution
- `POST /api/code/execute` - Execute code
- `POST /api/code/validate` - Validate syntax

### Deployment
- `POST /api/deployment/deploy` - Deploy project
- `GET /api/deployment/status/:id` - Check deployment status

## 🔧 Environment Variables

**Backend (.env)**
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-app-developer
JWT_SECRET=your_secret_key
OPENAI_API_KEY=sk-your_key
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WS_URL=ws://localhost:5000
```

## 🌟 Advanced Features

- 🎤 Voice prompts to generate apps
- 🎯 Drag & drop UI builder
- 🐛 AI-powered bug fixer
- 🎨 AI UI/UX designer
- 📱 Export APK & Web App bundles
- 🤝 Real-time code collaboration
- 📊 Analytics & insights
- 🔄 Auto-save and version history
- 🌍 Multi-language support

## 📖 Documentation

- [Setup Guide](docs/SETUP.md)
- [API Documentation](docs/API.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Contributing](CONTRIBUTING.md)

## 📝 License

MIT License © 2026 Rajnish Kumar Sakh

## 👨‍💻 Author

**Rajnish Kumar Sakh**
- GitHub: [@rajnishkumarsakh2007-web](https://github.com/rajnishkumarsakh2007-web)
- Email: contact@example.com

---

**Last Updated**: April 28, 2026
