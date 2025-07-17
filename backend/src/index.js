import express from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";

const app = express();
dotenv.config();
const port = process.env.PORT || 8000;

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.listen(port, () => {
  console.log("Server is running on http://localhost:" + port);
  connectDB();
});

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
