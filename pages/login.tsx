import { useEffect, useState } from 'react';
import { Player} from '@livepeer/react';
import jwt from 'jsonwebtoken';
import { useAccount, useBalance, useNetwork, useSignMessage, useConnect, useDisconnect } from 'wagmi';
import { SiweMessage } from 'siwe';
import styles from '../styles/Home.module.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Login() {
  const { chain } = useNetwork();
  const { signMessageAsync, isSuccess } = useSignMessage();
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();


  

  const [verifySignature, setVerifiedSignature] = useState<string>();
  const [token, setToken] = useState<string>();
  const [disableButton, setDisablebutton] = useState<boolean>(false);
  const [playbackId, setPlaybackId] = useState<string>('d93a10vyv3b3ot12');



  // Using Wagmi to get wallet information
  const { address, isConnected, isDisconnected } = useAccount();
  const { data } = useBalance({
    addressOrName: address, //Getting wallet address with useAccount()
    chainId: 5, //Goerli testnet});
    formatUnits: 'ether', //in ether
  });

  const signIn = async () => {
    const nonceRes = await fetch('/api/nonce');

    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement: 'Sign in with Etherum to the app',
      uri: window.location.origin,
      version: '1',
      chainId: chain?.id,
      nonce: await nonceRes.text(),
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
    // console.log(signature);

    // Generate JWT
    const createJWTRes = await fetch('/api/createJWT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playbackId,
        address,
      }),
    });
    const { token } = await createJWTRes.json();
    // console.log(token);

    if (verifyRes.ok) {
      setVerifiedSignature(signature);
    }
    setToken(token);
    setDisablebutton(true);
    // Decode token to get playbackId of stream
    if (token) {
      const decodedToken = jwt.decode(token) as { [key: string]: string };
      setPlaybackId(decodedToken.sub);
    }
  };

  // Logout of Siwe
  async function logOut() {
    await fetch('/api/logout', {
      method: 'POST',
    });
    setVerifiedSignature('');
    setDisablebutton(false);
  }

  // Set minimum amount of Eth in wallet to view(ACL)
  const minimumEth = 0.001;

  useEffect(() => {
    if (isDisconnected) {
      setDisablebutton(false);
    }
  }, [isDisconnected]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Connect Wallet to view streams</h1>
        <div className={styles.card}>
          {/* Getting wallets */}
          <div>
            <div>
              <ConnectButton />
            </div>
          </div>

          { isConnected && Number( data?.formatted ) < minimumEth && <p className={styles.description}>Access Not Granted: Invalid funds or wallet</p> }

          {isConnected && Number(data?.formatted) > minimumEth && (
            <div>
              <button onClick={signIn} disabled={disableButton} className={styles.button}>
                Sign in with Ethereum
              </button>
              {verifySignature ? (
                <button onClick={logOut} className={styles.button}>
                  Sign Out
                </button>
              ) : (
                <></>
              )}
            </div>
          )}
          {verifySignature ? <p>Signature: {verifySignature}</p> : <></>}
        </div>
        {verifySignature && isConnected ? (
          <div className={styles.player}>
            <Player
              src={`https://livepeercdn.com/hls/${playbackId}/index.m3u8?jwt=${token}`}
              showPipButton
              loop
              autoPlay
              muted
            />
          </div>
        ) : (
          <></>
        )}
      </main>
    </div>
  );
}
