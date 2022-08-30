// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fetch from 'node-fetch';

const uri = process.env.AQICN_URI;
const token = process.env.AQICN_TOKEN;

export default async function CoordinateHandler(req, res) {
   const { method } = req;
   const { lat, long } = req.query;

   switch (method) {
      case 'GET':
         try {
            if (lat && long) {
               const aqiRes = await fetch(`${uri}/feed/geo:${lat};${long}/?token=${token}`);
               const {
                  status,
                  data: {
                     aqi,
                     city: {
                        name: cityName,
                     },
                  },
               } = await aqiRes.json();

               /**
                * api returns a 2xx status even if there's an error. 
                * Actual status is sent in response body.
                */
               if (status === 'ok') {
                  res.status(200).json({
                     success: true,
                     payload: {
                        aqi,
                        cityName,
                     },
                  });
               } else {
                  throw new Error(aqiRes.statusText);
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
