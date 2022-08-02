// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import jwt from 'jsonwebtoken';
import { ObjectId as BSONObjectId } from 'bson';
import User from 'models/User';
import dbConnect from 'utils/dBconnect';

export default async function LoginHandler(req, res) {
   const { method } = req;
   const { u: userName } = req.query;

   try {
      await dbConnect();
   } catch (error) {
      return res.status(500).json({ success: false });
   }

   switch (req.method) {
      case 'GET':
         try {
            if (usersDB.length) {
               const targetDoc = User.findOne({ userName });

               if (targetDoc) {
                  const userToken = jwt.sign(
                     targetDoc.id,
                     process.env.JWT_AUTH_SECRET,
                  );

                  res.status(200).json({ success: true, payload: userToken });
               } else {
                  res.status(404).json({ success: false });
               }
            } else {
               res.status(400).json({ success: false });
            }
         } catch (error) {
            res.status(500).json({ success: false });
         }
         break;

      default:
         res.status(501).json({ success: false });
         break;
   }
}
