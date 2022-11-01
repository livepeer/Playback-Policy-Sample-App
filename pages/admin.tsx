import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

export default function CreateStream() {
  // Key creation
  const [keyId, setKeyID] = useState<string | null>(null);
  const [keyName, setKeyName] = useState<string>();
  const [userId, setUserId] = useState<string>();
  const [createdAt, setCreatedAt] = useState<string>();
  const [publicKey, setPublicKey] = useState<string>();
  const [privateKey, setPrivateKey] = useState<string>();
  const [disabledCreate, setDisabledCreate] = useState<boolean>(false);
  const [ createKeys, setCreateKeys ] = useState<string>();

   useEffect(() => {
     window.localStorage.setItem('signingKeys', JSON.stringify(createKeys));
   }, [ createKeys ] );
  
  console.log(createKeys);
  

  // Create signing keys for playback policy
  async function creatingKeys() {
    try {
      const response = await fetch('/api/createKeys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();

     setCreateKeys(data)

      setKeyID(data.id);
      setKeyName(data.name);
      setUserId(data.userId);
      setCreatedAt(data.createdAt);
      setPublicKey(data.publicKey);
      setPrivateKey(data.privateKey);
      // setPrivateKey(window.btoa(data.privateKey));
      setDisabledCreate(true);
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className={styles.main}>
      <div className={styles.main2}>
        {/* Creating keys */}
        <div className={styles.card}>
          <h2>Create keys for Playback Policy</h2>
          <button onClick={creatingKeys} className={styles.button} disabled={disabledCreate}>
            Create keys
          </button>
          {keyId ? (
            <div className={styles.card}>
              <h2>Signing Keys Info</h2>
              <p>Id: {keyId}</p>
              <p>Name: {keyName}</p>
              <p>User Id: {userId}</p>
              <p>Created At: {createdAt}</p>
              <p>Public Key: {publicKey}</p>
              <p>Private Key: {privateKey}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
