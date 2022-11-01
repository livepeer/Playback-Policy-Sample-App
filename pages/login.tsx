import { useState } from 'react';
import { ConnectKitButton } from 'connectkit';
import { Player } from '@livepeer/react';
import { useAccount, useBalance, useNetwork, useSignMessage, useSigner } from 'wagmi';
import styles from '../styles/Home.module.css';
import { SiweMessage } from 'siwe';


export default function Login() {
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();
  const { data: signer } = useSigner();
  const [verifyMessage, setVerifiedMessage] = useState<string>();
  const [ verifySignature, setVerifiedSignature ] = useState<string>();
  const [ token, setToken ] = useState<string>();
  const [playbackId, setPlaybackId] = useState<string>('b5e7kxt3zi69o4x8');

  const signIn = async () => {
    const nonceRes = await fetch('/api/nonce');
    const nonce = await nonceRes.text();

    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement: 'Sign in with Etherum to the app',
      uri: window.location.origin,
      chainId: chain?.id,
      nonce,
    });

    const signature = await signMessageAsync({
      message: message.prepareMessage(),
    });

    const verifyRes = await fetch('/api/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        signature,
      }),
    } );
    if ( verifyRes.ok ) {
      setVerifiedMessage( 'Signaure Verified' );
      setVerifiedSignature(signature)
    } else {
      setVerifiedMessage('Not Verified');
    }

    // Generate JWT
      const createJWTRes = await fetch('/api/createJWT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playbackId,
        }),
      });
    const {token }= await createJWTRes.json();
    console.log(token);
    
      setToken(token);

  };

  // Set minimum amount of Eth in wallet to view(ACL)
  const minimumEth = 0.001;

  // Using Wagmi to get wallet information
  const { address, isConnected } = useAccount();
  const { data } = useBalance({
    addressOrName: address, //Getting wallet address with useAccount()
    chainId: 5, //Goerli testnet});
  } );
  
  
  const playbackURL = `https://livepeercdn.com/hls/${playbackId}/index.m3u8/${token}`;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Connect Wallet to view streams</h1>
        <ConnectKitButton />
        {isConnected && Number(data?.formatted) > minimumEth ? (
          <div>
            <button onClick={signIn}>Sign in with Ethereum</button>
          </div>
        ) : (
          <></>
        )}

        { verifySignature ?  (
            <div className={styles.card}>
              <p>Signature: {verifySignature}</p>
              <p>Message: {verifyMessage}</p>
              <p>Token: {token}</p>
            </div> 
        )}

       

        {/* verifySignature ? (
          <div className={styles.player}>
            <Player playbackId={playbackId} showPipButton loop autoPlay muted />
            <p>Playback URL: {playbackURL}</p>
          </div> */}
      </main>
      </div>
  );
}
