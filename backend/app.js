import express from "express";
const app = express();
const port = 3000;

import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
connectDB();

import { generateMonthlySnapshots } from "./jobs/monthlySnapshot.js";

generateMonthlySnapshots()
  .then(() => console.log("📊 Monthly snapshot checked on startup"))
  .catch((err) => console.error("❌ Snapshot generation failed:", err));

// Allow requests from your frontend
import cors from 'cors';
const allowedOrigins = ['http://localhost:5173', 'https://your-deployed-frontend.com'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));



import expenseRoutes from "./routes/expenseRoutes.js";
import authRoutes from './routes/authRoutes.js';
import summaryRoutes from './routes/summaryRoutes.js'
// import snapshotRoutes from "./routes/snapshotRoutes.js";

app.use(express.json());
app.use(express.urlencoded({extended: true}));



app.use("/api/expenses", expenseRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/user", summaryRoutes);
// app.use("/api/snapshot", snapshotRoutes);


app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
