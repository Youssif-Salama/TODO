import mongoose from 'mongoose';

/**
 * Connect to MongoDB database.
 * @function connectDB
 * @returns {Promise}
 * @throws {Error} If unable to connect to MongoDB.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;
