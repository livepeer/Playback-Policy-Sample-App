import { FormEvent, useState } from 'react';
import styles from '../styles/Home.module.css';

export default function CreateStream() {
  const [ streamId, setStreamId ] = useState<string>();
  const [ keyId, setKeyID ] = useState<string | null>(null);
  const [ keyName, setKeyName ] = useState<string>();
  const [ userId, setUserId] = useState<string>();
  const [ createdAt, setCreatedAt ] = useState<string>();
  const [ publicKey, setPublicKey ] = useState<string>();
  const [ privateKey, setPrivateKey ] = useState<string>();

  async function createKeys() {
    try {
      const response = await fetch('/api/createKeys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      console.log(data);
      
      setKeyID(data.id)
      setKeyName(data.name)
      setUserId(data.userId)
      setCreatedAt(data.createdAt)
      setPublicKey(data.publicKey)
      setPrivateKey(data.privateKey)
    } catch (error) {
    }
  }

  async function applyPlaybackPolicy() {
    try {
      fetch( '/api/applyPlaybackPolicy', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( {
          streamId,
          playbackPolicy: {
            'type': 'jwt'
          }
        })
      }
      )
    } catch (error) {
      
    }
  }

  return (
    <div className={styles.main}>
      <div className={styles.card}>
        <h2>Create keys for Playback Policy</h2>
        <button onClick={createKeys}>Create keys</button>
      </div>

      {/* {keyId ? ( */}
        <div>
          <div className={styles.card}>
            <h2>Signing Keys Info</h2>
            <p>Id: {keyId}</p>
            <p>Name: {keyName}</p>
            <p>userId: {userId}</p>
            <p>Created At: {createdAt}</p>
            <p>Public Key: {publicKey}</p>
            <p>Private Key: {privateKey}</p>
          </div>

          <form onSubmit={applyPlaybackPolicy} method='PATCH' className={styles.card}>
            <label htmlFor='stream'>Stream Id: </label>
            <br />
            <input
              className='border rounded-md text-base mx-2'
              type='text'
              value={streamId}
              name='name'
              required
              onChange={(e) => setStreamId(e.target.value)}
            />
            <br />
            <button type='submit'>Apply Playback Policy</button>
          </form>
      </div>
      
       {/* ) : (
         <></>
       )} */}
    </div>
  );
}
