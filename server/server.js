import "dotenv/config";

import mongoose from "mongoose";

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const PORT = Number(process.env.PORT) || 5000;

const validateEnvironment = () => {
  if (
    !process.env.MONGO_URI ||
    process.env.MONGO_URI.includes("YOUR_MONGODB_CONNECTION_STRING")
  ) {
    throw new Error("MONGO_URI is not configured in .env");
  }

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters.");
  }
};

const startServer = async () => {
  validateEnvironment();

  await connectDB();

  const server = app.listen(PORT, () => {
    console.log("");
    console.log("Study Planner Backend");

    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);

    console.log(`API: http://localhost:${PORT}`);

    console.log(`Health: http://localhost:${PORT}/api/health`);

    console.log("");
  });

  const shutdown = async (signal) => {
    console.log(`${signal} received. Closing server...`);

    server.close(async () => {
      await mongoose.connection.close();

      console.log("MongoDB connection closed.");

      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("SIGTERM", () => shutdown("SIGTERM"));
};

startServer().catch(async (error) => {
  console.error("Server startup failed:", error.message);

  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }

  process.exit(1);
});
