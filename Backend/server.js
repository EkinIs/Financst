import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import UserRoutes from "./routes/UserRoutes.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import StocksRoutes from "./routes/StocksRoutes.js";
import ContactRoutes from "./routes/ContactRoutes.js";

dotenv.config({ path: './.env' });

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://www.financst.com',
  'https://financst.com',
];

app.use(cors({
  origin: function (origin, callback) {

    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {

      return callback(new Error('CORS policy: This origin is not allowed.'), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());


app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});


app.use("/api/user", UserRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/stocks", StocksRoutes);
app.use("/api/contact", ContactRoutes);


app.get("/api/ping", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
  res.json({
    message: "Pong!",
    dbStatus: dbStatus,
    serverTime: new Date().toISOString()
  });
});


const PORT = process.env.PORT || 4000;

console.log("Attempting to connect to MongoDB at");

mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });