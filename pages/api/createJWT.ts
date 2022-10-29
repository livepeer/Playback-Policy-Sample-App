import type { NextApiRequest, NextApiResponse } from 'next';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  // const { playbackId} = req.body;

  // if (!req.body) {
  //   res.statusCode = 404;
  //   res.end('Error');
  //   return;
  // }

  // Creating JWT
  const expiration = Math.floor(Date.now() / 1000) * 1000;
  const payload: JwtPayload = {
    sub: 'b5e7kxt3zi69o4x8',
    action: 'pull',
    iss: 'Livepeer Studio',
    pub: process.env.PUBLIC_KEY,
    exp: expiration,
  };

  res.json( {
     token: jwt.sign(payload, process.env.PRIVATE_KEY as Secret, {
    algorithm: 'ES256',
  })
  });
}
