import mongoose from 'mongoose';

async function dbConnect() {
   if (mongoose.connection.readyState >= 1) {
      return null;
   }

   return mongoose.connect(process.env.MONGO_URI, {
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASS,
   });
}

export default dbConnect;
