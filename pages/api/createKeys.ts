export default async function handler(req: any , res: any) {

  try {
    // TODO: Change to livepeer.studio when in production
    const response = await fetch(`https://livepeer.monstor/api/access-control/signing-key`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.STAGING_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
}
