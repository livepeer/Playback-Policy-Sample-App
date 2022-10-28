import { ConnectKitButton } from 'connectkit';
import { Player } from '@livepeer/react';
import { useAccount } from 'wagmi';
import styles from '../styles/Home.module.css';
import jwt, { JwtPayload, Secret} from 'jsonwebtoken'

  
  
  
export default function Login() {
  
const expiration = Math.floor(Date.now() / 1000) + 1000;
const payload: JwtPayload = {
  sub: playbackId,
  action: 'pull',
  iss: 'Livepeer Studio',
  pub: publicKey,
  exp: expiration,
  video: 'none',
};

const token = jwt.sign(payload, process.env.PRIVATE_KEY as Secret, { algorithm: 'ES256' });


  const { address, isConnected} = useAccount();

  return (
    <div className={styles.container}>
      <main className={styles.main}>
          <h1 className={styles.title}>Connect Wallet to view streams</h1>
          <ConnectKitButton />
          {isConnected && (
            <div className={styles.player}>
              <Player playbackId='d93a49mu90eaxweo' showPipButton loop autoPlay muted />
            </div>
          )}
      </main>
    </div>
  );
};


