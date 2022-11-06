import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { streamId, type } = req.body;
  console.log( type );
  console.log( streamId );
  console.log(req.body);
  
  
  try {
    const response = await fetch(`https://livepeer.studio/api/stream/${streamId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playbackPolicy: {
        type,
        },
      }),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
}
