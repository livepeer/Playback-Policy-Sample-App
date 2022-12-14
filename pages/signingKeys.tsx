
import {useState} from 'react';
import styles from '../styles/Home.module.css';

interface SigningKeysDetails {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  publicKey: string;
}


export default function SigningKeys() {
  const [keyInfo, setKeyInfo] = useState<Array<SigningKeysDetails>>([]);

  async function gettingKeyInfo() {
    try {
      const response = await fetch( `/api/keyInfos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      } );
      const data = await response.json();
      console.log( data );
      if (data) {
        setKeyInfo(data)
      }

    } catch (error) {
      console.log(error);

    }
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}> Signing Keys</h1>
        <button className={styles.button} onClick={gettingKeyInfo}>
          Get List
        </button>
        {keyInfo.map((item) => (
          <ul className={styles.grid} key={item.id}>
            <div className={styles.card}>
              <h2>Get Keys Info</h2>
              <p>Key Id:{item.id} </p>
              <p>Key Name:{item.name} </p>
              <p>Public Key: {item.publicKey}</p>
              <p>Created At: {item.createdAt}</p>
              <p>User Id: {item.userId}</p>
            </div>
          </ul>
        ))}
    </main>
  );
}
