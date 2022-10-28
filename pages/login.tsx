import { ConnectKitButton } from 'connectkit';
import { useEffect, useState } from 'react';
import { Player } from '@livepeer/react';
import { useAccount, useBalance } from 'wagmi';
import styles from '../styles/Home.module.css';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

export default function Login() {
  const minimumEth = 0.001;

  // Creating JWT
  const playbackId = 'b5e7kxt3zi69o4x8';
  const expiration = Math.floor(Date.now() / 1000) + 1000;
  const payload: JwtPayload = {
    sub: playbackId,
    action: 'pull',
    iss: 'Livepeer Studio',
    pub: process.env.PUBLIC_KEY,
    exp: expiration,
    // video: 'none',
  };

  // const token = jwt.sign(payload, process.env.PRIVATE_KEY as Secret, { algorithm: 'ES256' });

  // const playbackURL = `https://livepeercdn.com/hls/${playbackId}/index.m3u8/${token}`;

  // Using Wagmi to get wallet information
  const { address, isConnected } = useAccount();
  const { data, isSuccess } = useBalance( {
    addressOrName: address,
    chainId: 5, //Goerli testnet});
  } );

console.log(Number(data?.formatted));

  

    


  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Connect Wallet to view streams</h1>
        <ConnectKitButton />
        { isConnected && Number(data?.formatted) > minimumEth  && (
          <div className={styles.player}>
            {/* <p>Playback URL: {playbackURL}</p> */}
            <Player playbackId={playbackId} showPipButton loop autoPlay muted />
          </div>
        )}
      </main>
    </div>
  );
}
