import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/smart_file_backup";

export async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB Compass Connected] Host: ${conn.connection.host}, Database: ${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error(`[MongoDB Connection Error] Could not connect to ${MONGO_URI}:`, err.message);
    console.warn(`[MongoDB Warning] Please ensure MongoDB is running on localhost:27017 to view documents in MongoDB Compass.`);
    return null;
  }
}

export function isDbConnected() {
  return mongoose.connection.readyState === 1;
}
