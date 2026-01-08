import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
      console.error('❌ MONGO_URI not found in environment variables');
      console.log('⚠️  Using mock data mode (no database connection)');
      return false;
    }

    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Atlas connected successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Using mock data mode (no database connection)');
    return false;
  }
};

export default connectDB;
