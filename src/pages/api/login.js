// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import jwt from 'jsonwebtoken';
import User from 'models/User';
import dbConnect from 'utils/dbConnect';

export default async function LoginHandler(req, res) {
   const { method } = req;
   const { u: userName } = req.query;

   try {
      await dbConnect();
   } catch (error) {
      return res.status(500).json({ success: false });
   }

   switch (method) {
      case 'GET':
         try {
            if (userName) {
               const targetDoc = await User.findOne({ userName });

               if (targetDoc) {
                  const userToken = jwt.sign(
                     targetDoc.id,
                     process.env.JWT_AUTH_SECRET,
                  );

                  res.status(200).json({
                     success: true,
                     payload: userToken,
                  });
               } else {
                  res.status(404).json({ success: false });
               }
            } else {
               res.status(400).json({ success: false });
            }
         } catch (error) {
            console.warn(error);
            res.status(500).json({ success: false });
         }
         break;

      default:
         res.status(501).json({ success: false });
         break;
   }
}
