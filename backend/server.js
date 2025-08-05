// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4001;
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://mern:gpGPSjUAqIaazWFi@cluster7.gynar.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=Cluster7";

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enhanced MongoDB Connection with Connection Pooling
mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000, // 5 seconds timeout for server selection
  socketTimeoutMS: 45000, // 45 seconds socket timeout
  connectTimeoutMS: 30000, // 30 seconds connection timeout
  maxPoolSize: 10, // Maximum number of sockets in the connection pool
  minPoolSize: 2, // Minimum number of sockets in the connection pool
  waitQueueTimeoutMS: 10000, // Max time to wait for a connection from the pool
  retryWrites: true,
  w: "majority"
});

// MongoDB Connection Events
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB Connected Successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB Connection Error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB Disconnected');
});

// Import Routes
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const dvboysRoutes = require("./routes/dvboys");
const billRoutes = require("./routes/billRoutes");

// Route Middlewares
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/dvboys", dvboysRoutes);
app.use("/api/bills", billRoutes);

// Health Check Endpoint (for Render keepalive and monitoring)
app.get("/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusText = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  }[dbStatus] || 'unknown';

  res.status(200).json({
    status: "healthy",
    database: dbStatusText,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memoryUsage: process.memoryUsage()
  });
});

// Keepalive Endpoint (for Render cron job)
app.get("/keepalive", (req, res) => {
  console.log('Keeping server alive...');
  res.status(200).json({
    message: "Server is alive and warm",
    timestamp: new Date().toISOString()
  });
});

// Default Route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the MERN Stack Backend Server!",
    endpoints: {
      auth: "/api/auth",
      customers: "/api/customers",
      dvboys: "/api/dvboys",
      bills: "/api/bills",
      health: "/health",
      keepalive: "/keepalive"
    },
    documentation: "Add your API documentation link here"
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message || "Something went wrong!",
    timestamp: new Date().toISOString()
  });
});
let server;
// Start Server only after MongoDB connection is established
mongoose.connection.once('open', () => {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed');
        process.exit(0);
      });
    });
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Close server and exit process
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});
