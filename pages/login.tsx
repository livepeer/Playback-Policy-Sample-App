import { ConnectKitButton } from 'connectkit';
import { Player } from '@livepeer/react';
import { useAccount, useBalance } from 'wagmi';
import styles from '../styles/Home.module.css';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

export default function Login() {
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

  // console.log(token);
  
  const playbackURL = `https://livepeercdn.com/hls/${playbackId}/index.m3u8/${token}`;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Connect Wallet to view streams</h1>
        <ConnectKitButton />
        {isConnected && Number(data?.formatted) > minimumEth && (
          <div className={styles.player}>
            <Player playbackId={playbackId} showPipButton loop autoPlay muted />
            <p>Playback URL: {playbackURL}</p>
          </div>
        )}
      </main>
    </div>
  );
}
