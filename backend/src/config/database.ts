import mongoose from 'mongoose';
import { env } from './env';

export const connectDatabase = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', true);
    
    await mongoose.connect(env.MONGODB_URI);

    console.log(`✅ MongoDB Connected Successfully: ${env.MONGODB_URI}`);

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB Connection Error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB Disconnected. Attempting reconnection...');
    });
  } catch (error: any) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    // In production we may want to exit, in dev we log
    if (env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected cleanly');
  } catch (error) {
    console.error('Error disconnecting MongoDB:', error);
  }
};
