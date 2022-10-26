import { ConnectKitButton } from 'connectkit';
import { Player } from '@livepeer/react';
import { useAccount } from 'wagmi';
import styles from '../styles/Home.module.css';


export default function Login() {

  const { address} = useAccount();

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Connect Wallet to view streams</h1>
        <ConnectKitButton />
        {address && (
          <div className={styles.player}>
            <Player playbackId='d93a49mu90eaxweo' showPipButton loop autoPlay muted />
          </div>
        )}
      </main>
    </div>
  );
};


