import { useState } from 'react';
import { ConnectKitButton } from 'connectkit';
import { Player } from '@livepeer/react';
import jwt from 'jsonwebtoken';
import { useAccount, useBalance, useNetwork, useSignMessage, useSigner } from 'wagmi';
import { SiweMessage } from 'siwe';
import styles from '../styles/Home.module.css';

export default function Login() {
  const { chain } = useNetwork();
  const { signMessageAsync , isSuccess} = useSignMessage();
  const { data: signer } = useSigner();

  const [verifySignature, setVerifiedSignature] = useState<string>();
  const [ token, setToken ] = useState<string>();
  const [ signed, setSigned ] = useState<boolean>();
  const [disableButton, setDisablebutton] = useState<boolean>(false)
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

    // Verifying the signature
    const verifyRes = await fetch('/api/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        signature,
      }),
    });
    console.log(signature);

    if (verifyRes.ok) {
      setVerifiedSignature(signature);
    }

    // Generate JWT
    const createJWTRes = await fetch('/api/createJWT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playbackId,
        verifySignature,
      }),
    });
    const { token } = await createJWTRes.json();
    console.log(token);

    setToken(token);
    setDisablebutton( true );
    // Decode token
    if ( token ) {
      const decodedToken = jwt.decode( token ) as {[key: string]: string}
      setPlaybackId( decodedToken.sub )
      console.log(decodedToken.sub);
      
    }
  };

  


  // Set minimum amount of Eth in wallet to view(ACL)
  const minimumEth = 0.001;

  // Using Wagmi to get wallet information
  const { address, isConnected } = useAccount();
  const { data } = useBalance({
    addressOrName: address, //Getting wallet address with useAccount()
    chainId: 5, //Goerli testnet});
  });



  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Connect Wallet to view streams</h1>
        <ConnectKitButton />
        {isConnected && Number(data?.formatted) > minimumEth && (
          <div>
            <button onClick={signIn} disabled={disableButton}>Sign in with Ethereum</button>
          </div>
        )}

        {verifySignature ? (
          <div className={styles.player}>
            <Player src={`https://livepeercdn.monster/hls/${playbackId}/index.m3u8`} showPipButton loop autoPlay muted />
          </div>
        ) : (
          <></>
        )}
      </main>
    </div>
  );
}
