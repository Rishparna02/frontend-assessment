import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.js';
import { categoriesRouter } from './routes/categories.js';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(json());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to ECOMMERCE Backend API Services');
});
app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 