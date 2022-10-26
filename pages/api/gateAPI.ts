import jwt, {JsonWebTokenError, JwtPayload, Secret} from 'jsonwebtoken'
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
  const { playbackId } = req.body;
  const publicKey = process.env.PUBLIC_KEY;
  
  
  const expiration = Math.floor( Date.now() / 1000 ) + 1000;
  const payload: JwtPayload = {
    sub: playbackId,
    action: 'pull',
    iss: 'Livepeer Studio',
    pub: publicKey,
    exp: expiration,
    video: 'none'
  }
  
  const token = jwt.sign( payload, process.env.PRIVATE_KEY as Secret, { algorithm: 'ES256' } )
  
  
  // TODO: Change to livepeer.studio when in production
  try {
  const response = await fetch(`https://livepeer.monster/api/access-control/gate`, {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${process.env.STAGING_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'jwt',
        pub:token.Claims.(jwt.MapClaims)["pub"],
        playbackId,
      }),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
}
