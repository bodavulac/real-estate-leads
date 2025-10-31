import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

const connectDatabase = async (): Promise<void> => {
  try {
    let mongoURI = process.env.MONGODB_URI;

    if (!mongoURI || mongoURI === 'mongodb://localhost:27017/real_estate_leads') {
      console.log('🔄 Starting in-memory MongoDB for testing...');
      mongod = await MongoMemoryServer.create();
      mongoURI = mongod.getUri();
    }

    await mongoose.connect(mongoURI);

    console.log('✅ MongoDB connected successfully');
    console.log(`📍 Database URI: ${mongoURI}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('📡 MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB error:', error);
});

export default connectDatabase;