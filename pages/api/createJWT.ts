import type { NextApiRequest, NextApiResponse } from 'next';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { playbackId, address } = req.body;

  // Expires in 1 hour
  const expiration = Math.floor(Date.now() / 1000) + 60 * 60;
  // Creating JWT
  const payload: JwtPayload = {
    sub: playbackId,
    action: 'pull',
    custom: {
      'walletAddress': address,
    },
    iss: 'Livepeer Studio',
    pub: process.env.PUBLIC_KEY,
    exp: expiration,
  };

  res.json({
    token: jwt.sign(payload, process.env.PRIVATE_KEY as Secret, {
      algorithm: 'ES256',
    } ),
  });
}

