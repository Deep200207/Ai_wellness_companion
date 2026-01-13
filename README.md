#AI Wellness Companion | Full-Stack Health & Fitness Platform

AI Wellness Companion is a full-stack, production-oriented wellness application designed to track physical activity, visualize health metrics, and provide AI-assisted wellness insights using real-time data.

This project demonstrates end-to-end full-stack development, secure authentication, REST API integration, and scalable backend architecture, aligned with modern industry standards.

##🔑 Key Highlights (Recruiter Snapshot)

Full-stack application (React + Node.js + MongoDB)

Secure authentication (Firebase OAuth + JWT)

Real-time Fitbit API integration

Interactive dashboards & data visualization

Modular, scalable backend architecture

Clean codebase with industry best practices

##🚀 Core Features
Authentication & Security

Google OAuth using Firebase Authentication

JWT-based authorization for protected APIs

Secure token handling and session management

Activity Tracking & Real-Time Data

Fitbit Web API integration

Weekly step count & activity analytics

Real-time data fetching and processing

Dashboard & Visualization

Interactive charts and plots

Health metrics visualization (steps, BMI, height, weight)

Responsive UI for improved user experience

AI & Automation

AI chatbot for wellness interaction and guidance

Extensible architecture for ML/CV features

##🛠️ Technology Stack (ATS-Optimized)

Frontend

React.js

JavaScript (ES6+)

Firebase Authentication

Data Visualization (Plotly / Charts)

Tailwind CSS / CSS

Backend

Node.js

Express.js

MongoDB

RESTful APIs

JWT Authentication

Fitbit Web API Integration

Tools & Practices

Git & GitHub

Environment-based configuration

Modular folder structure

API-first development

##🧱 System Architecture
Client (React)
   │
   ├── Firebase Auth (Google OAuth)
   │
Backend (Node + Express)
   ├── JWT Authorization
   ├── Fitbit API Integration
   └── MongoDB Database

##📂 Project Structure
ai-wellness-companion
│
├── ai-companion/        # Frontend (React)
│   ├── src/
│   ├── components/
│   ├── services/
│   └── package.json
│
├── backend/             # Backend (Node.js)
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── app.js
│
├── .gitignore
└── README.md

##⚙️ Environment Configuration

Create a .env file inside the backend directory:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

FITBIT_CLIENT_ID=your_fitbit_client_id
FITBIT_CLIENT_SECRET=your_fitbit_client_secret

FIREBASE_API_KEY=your_firebase_api_key


##🔐 Environment variables are used to ensure security and scalability.
.env files are excluded from version control.

▶️ Local Development Setup
Backend
cd backend
npm install
npm run dev


##Runs on: http://localhost:5000

Frontend
cd ai-companion
npm install
npm start


##Runs on: http://localhost:3000

📈 Learning Outcomes & Skills Demonstrated

Full-stack application development

OAuth & JWT-based authentication flows

Real-time third-party API integration

REST API design & backend scalability

Frontend data visualization

Secure handling of user data

Clean Git workflow & project documentation

🔮 Future Enhancements

Mood detection using OpenCV

Disease analysis using CNN models

Social wellness features (feeds, groups)

CI/CD pipeline & cloud deployment

Role-based access control (RBAC)

##👨‍💻 Author

Deepak Roy
CSE Student | Full-Stack Developer (React & Node.js)
📍 India

🔗 GitHub: https://github.com/Deep200207

⭐ Why Recruiters Care About This Project

This project reflects real-world software engineering practices, including:

Authentication & authorization

API integration with external platforms

Frontend + backend separation

Security-first design

Scalable architecture

Built not just as a college project, but as a production-ready system. 
