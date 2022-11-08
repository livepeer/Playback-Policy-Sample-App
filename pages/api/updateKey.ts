import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { disabled, name, updateKeyId } = req.body;
  // console.log(req.body);
  

  try {
    const response = await fetch(
      `https://livepeer.studio/api/access-control/signing-key/${updateKeyId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          disabled,
          name,
        }),
      }
    );
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    res.status(400).send(error);
  }
}
