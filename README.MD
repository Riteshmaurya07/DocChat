# **DocChat - AI-Powered Document Q&A**  

DocChat is a MERN stack web application that allows users to upload documents, generate summaries, and seamlessly interact with them using AI-powered Q&A. 

## **Key Features**  
- **Secure User Authentication:** Register, login, and secure sessions (JWT).
- **Document Processing:** Upload PDF documents and extract text accurately.
- **AI-Powered Insights:** Get AI-generated document summaries and ask contextual questions.
- **Conversation History:** Save and display the last 5 conversations for logged-in users.
- **Responsive UI:** A modern interface built with React and Tailwind CSS.

## **Tech Stack**  

### **Frontend**
- React 19 (Vite)
- React Router DOM
- Tailwind CSS v4
- Axios
- React Markdown

### **Backend**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT) & bcryptjs (Authentication)
- Multer (File Uploads)
- pdf.js-extract (PDF Text Extraction)
- Google Gen AI SDK (Gemini API Processing)

---

## **Project Structure**

The repository is organized into a client-server architecture:

```text
DocChat/
├── backend/                  # Node.js/Express server
│   ├── config/               # Database and server config (e.g., CORS, DB conn)
│   ├── controllers/          # Route logic handlers (Auth, Document processing)
│   ├── middlewares/          # Custom middleware (JWT auth, error handlers)
│   ├── models/               # Mongoose schemas (User, Conversation)
│   ├── routes/               # API route definitions
│   ├── services/             # Core business logic (Gen AI service, PDF extraction)
│   ├── index.js              # Server entry point
│   └── package.json          # Backend dependencies
│
├── frontend/                 # React application (Vite)
│   ├── public/               # Public static assets
│   ├── src/
│   │   ├── assets/           # Application images/icons
│   │   ├── components/       # Reusable React components (Sidebar, Layouts)
│   │   ├── context/          # React Context providers (AuthContext)
│   │   ├── pages/            # View components (Home, Login, Register)
│   │   ├── App.jsx           # Main application shell
│   │   └── main.jsx          # React DOM entry point
│   ├── vite.config.js        # Vite bundler configuration
│   └── package.json          # Frontend dependencies
│
└── README.md                 # Project documentation
```

---

## **Local Development Setup**

### 1. Prerequisites
- Node.js installed
- MongoDB connection string (local or Atlas)
- Google Gemini API Key

### 2. Backend Setup
Navigate to the `backend` directory, install dependencies, and setup your `.env` file:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

Run the backend server:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

### 3. Frontend Setup
Navigate to the `frontend` directory and install dependencies:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder to point to the backend server:
```env
VITE_API_URL=http://localhost:5000
```

Start the Vite development server:
```bash
npm run dev
```

The frontend will typically be available at `http://localhost:5173`.

---

## **Available API Endpoints**

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| **POST** | `/api/auth/register` | Register a new user | ❌ |
| **POST** | `/api/auth/login` | Login and receive JWT cookie | ❌ |
| **POST** | `/api/auth/logout` | Logout (clears JWT cookie) | ✅ |
| **POST** | `/api/chat/upload` | Upload a PDF and initialize document | ✅ |
| **POST** | `/api/chat/ask` | Ask a question about the uploaded document | ✅ |
| **GET** | `/api/chat/history` | Get the last 5 conversations for the user | ✅ |

---

## **Contributing**
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## **License**
This project is licensed under the ISC License.
