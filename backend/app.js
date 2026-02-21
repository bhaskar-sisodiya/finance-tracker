import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB Atlas
connectDB();

// CORS — allow both localhost dev and production frontend
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174", // Vite fallback port
  process.env.FRONTEND_URL,
].filter(Boolean); // remove undefined if FRONTEND_URL not set

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
import expenseRoutes from "./routes/expenseRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import summaryRoutes from "./routes/summaryRoutes.js";

app.use("/api/expenses", expenseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", summaryRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});