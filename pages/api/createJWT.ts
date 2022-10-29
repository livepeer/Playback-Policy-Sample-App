import type { NextApiRequest, NextApiResponse } from 'next';
import { ConnectKitButton } from 'connectkit';
import { useAccount, useBalance } from 'wagmi';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {


  try {
    // Set minimum amount of Eth in wallet to view(ACL)
    const minimumEth = 0.001;

    // Using Wagmi to get wallet information
    const { address, isConnected } = useAccount();
    const { data } = useBalance({
      addressOrName: address, //Getting wallet address with useAccount()
      chainId: 5, //Goerli testnet});
    });

    // Creating JWT
    const playbackId = 'b5e7kxt3zi69o4x8';
    const expiration = Math.floor(Date.now() / 1000) * 1000;
    const payload: JwtPayload = {
      sub: playbackId,
      action: 'pull',
      iss: 'Livepeer Studio',
      pub: process.env.NEXT_PUBLIC_PUBLIC_KEY,
      exp: expiration,
    };

    const token = jwt.sign(payload, process.env.NEXT_PUBLIC_PRIVATE_KEY as Secret, {
      algorithm: 'ES256',
    });

    const playbackURL = `https://livepeercdn.com/hls/${playbackId}/index.m3u8/${token}`;

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
}
