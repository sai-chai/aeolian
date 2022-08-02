// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import jwt from 'jsonwebtoken';
import { ObjectId as BSONObjectId } from 'bson';
import User from 'models/User';
import dbConnect from 'utils/dBconnect';

export default async function UserHandler(req, res) {
   const { method } = req;
   const { userName, lat, long, threshold } = req.body;
   const { u: userToken } = req.query;
   let decodedID;

   if (userToken) {
      decodedID = jwt.verify(userToken, process.env.JWT_AUTH_SECRET);
   } else if (method !== 'POST') {
      return res.status(400).json({ success: false });
   }

   try {
      await dbConnect();
   } catch (error) {
      return res.status(500).json({ success: false });
   }

   switch (method) {
      case 'POST':
         try {
            const userNameTaken = await User.exists({ userName });
            if (userNameTaken) {
               res.status(409).json({
                  success: false,
                  message: 'Username is taken.',
               });
            } else if (!(userName && lat && long && threshold)) {
               res.status(400).json({ success: false });
            } else {
               const newDoc = new User({
                  _id: new BSONObjectId(),
                  userName,
                  lat,
                  long,
                  threshold,
               });
               const newUserToken = jwt.sign(
                  newDoc.id,
                  process.env.JWT_AUTH_SECRET,
               );

               const newUser = (await newDoc.save()).toObject();

               res.status(201).json({
                  success: true,
                  payload: {
                     userToken: newUserToken,
                     user: newUser,
                  },
               });
            }
         } catch (error) {
            console.warn(error);
            res.status(500).json({ success: false });
         }
         break;

      case 'PUT':
         try {
            if (decodedID) {
               const targetDoc = await User.findById(decodedID);

               if (targetDoc) {
                  const target = targetDoc.toObject();

                  targetDoc.lat = lat || target.lat;
                  targetDoc.long = long || target.long;
                  targetDoc.threshold = threshold || target.threshold;

                  const result = await targetDoc.save();

                  res.status(200).json({
                     success: true,
                     payload: result.toObject(),
                  });
               } else {
                  res.status(404).json({ success: false });
               }
            } else {
               res.status(400).json({ success: false });
            }
            break;
         } catch (error) {
            console.warn(error);
            res.status(500).json({ success: false });
         }

      case 'GET':
         if (decodedID) {
            const targetDoc = await User.findById(decodedID);

            const result = targetDoc.toObject();

            if (result) {
               res.status(200).json({ success: true, payload: result });
            } else {
               res.status(404).json({ success: false });
            }
         } else {
            res.status(400).json({ success: false });
         }
         break;

      default:
         res.status(501).json({ success: false });
         break;
   }
}
