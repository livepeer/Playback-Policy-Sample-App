import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
  const { type, pub, stream } = req.body;

  try {
    // TODO: Change to livepeer.studio when in production
    const response = await fetch(`https://livepeer.monster/api/access-control/gate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.STAGING_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        pub,
        stream,
      }),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
}
