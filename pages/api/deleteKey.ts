import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
  try {
    // TODO: Change to livepeer.studio when in production
    const response = await fetch(
      `https://livepeer.studio/api/access-control/signing-key/${req.body.deleteKeyId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${process.env.STAGING_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    res.status(400).send(error);
    
  }
}
