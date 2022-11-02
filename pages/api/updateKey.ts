import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
  const { disableKey, updateKeyName, updateKeyId } = req.body;
  try {
    const response = await fetch(
      `https://livepeer.studio/api/access-control/signing-key/${updateKeyId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( {
          // disable:disableKey,
          name:updateKeyName
        })
      }
    );
    const data = await response.json();
    return res.status( 200 ).json( data );
    
  } catch (error) {
    res.status(400).send(error);
  }
}
