// backend/app.js (ES module)
import dotenv from 'dotenv';
dotenv.config(); // load env early

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// Optional: routers (if you have them). If not, comment these lines out.
import authrouter from './routes/auth.js';
import profilerouter from './routes/profile.js';
// import fitbitRouter from './routes/fitbitTest.js';
import firebaseGoogleRouter from './routes/google_login.js';
import firebase_fitbit from './routes/firebase_fitbit.js';
import chatbotRoute from './routes/chatbotRoute.js';
import hospitalrouter from './routes/hospitalRoute.js';
// import aqi from './routes/aqi.js';

const {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  MONGO_URI,
  PORT = 5000
} = process.env;

const app = express(); // create app first

app.use(express.json()); // built-in json parser
app.use(cors({
  origin: '*', // dev frontend origin
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','Accept'],
  credentials: true
}));

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

  app.use('/', authrouter);
  app.use('/', profilerouter);
  app.use('/',firebase_fitbit);
  app.use('/',firebaseGoogleRouter);
  app.use('/',chatbotRoute);
  app.use('/api/hospital',hospitalrouter)
  // app.use('/',aqi)


// Start server
app.listen(PORT, () => {
  console.log(`Server Running at http://localhost:${PORT}`);
});
