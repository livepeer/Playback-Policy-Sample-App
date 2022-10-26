import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { streamId } = req.body;
  try {
    const response = await fetch(`https://livepeer.studio/api/stream/${streamId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${process.env.STAGING_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playbackPolicy: {
          type: 'jwt',
        },
      }),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
}
