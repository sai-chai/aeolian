import mongoose from 'mongoose';

const userTransform = (doc, res, options) => {
   delete res._id;
   delete res.__v;
   return res;
};

const UserSchema = new mongoose.Schema(
   {
      userName: String,
      lat: Number,
      long: Number,
      threshold: Number,
   },
   {
      toObject: {
         transform: userTransform,
      },
   },
);

export default mongoose.models.User ||
   mongoose.model('User', UserSchema, 'users');
