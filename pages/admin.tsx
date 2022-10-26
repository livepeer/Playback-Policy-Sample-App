import { FormEvent, useState } from 'react';
import styles from '../styles/Home.module.css';



export default function CreateStream() {
  // Key creation
  const [ playbackId, setPlaybackId ] = useState<string>();
  const [ streamId, setStreamId ] = useState<string>();
  const [ keyId, setKeyID ] = useState<string | null>(null);
  const [ keyName, setKeyName ] = useState<string>();
  const [ userId, setUserId] = useState<string>();
  const [ createdAt, setCreatedAt ] = useState<string>();
  const [ publicKey, setPublicKey ] = useState<string>();
  const [ privateKey, setPrivateKey ] = useState<string>();



// Create signing keys for playback policy
  async function createKeys() {
    try {
      const response = await fetch('/api/createKeys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      
      setKeyID(data.id)
      setKeyName(data.name)
      setUserId(data.userId)
      setCreatedAt(data.createdAt)
      setPublicKey(data.publicKey)
      setPrivateKey(data.privateKey)
    } catch ( error ) {
      console.log(error);
      
    }
  }

  // Apply playback policy to stream
  async function applyPlaybackPolicy( e: FormEvent ) {
    e.preventDefault();
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
      console.log(error);
      
    }
  }

  
// Gate stream
  async function gateStream( e: FormEvent ) {
    e.preventDefault();
    try {
      const response = await fetch('/api/gateAPI', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          streamId
        }),
      });
    } catch (error) {
     console.log(error);
      
    }
}

  return (
    <div className={styles.main}>
      <div>
        {/* Creating keys */}
        <div className={styles.card}>
          <h2>Create keys for Playback Policy</h2>
          <button onClick={createKeys}>Create keys</button>
        </div>

        <div className={styles.card}>
          <h2>Signing Keys Info</h2>
          <p>Id: {keyId}</p>
          <p>Name: {keyName}</p>
          <p>User Id: {userId}</p>
          <p>Created At: {createdAt}</p>
          <p>Public Key: {publicKey}</p>
          <p>Private Key: {privateKey}</p>
        </div>
      </div>

      {/* Getting keys */}
      {/* <a className={styles.card} href='/signingKeys'>
        Get Signing Keys
      </a> */}

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

        <form onSubmit={gateStream} method='PATCH' className={styles.card}>
        <h2>Gate Stream</h2>
          <label htmlFor='stream'>Playback Id: </label>
          <br />
          <input
            className='border rounded-md text-base mx-2'
            type='text'
            value={playbackId}
            name='name'
            required
            onChange={(e) => setPlaybackId(e.target.value)}
          />
          <br />
          <button type='submit'>Gate Stream</button>
        </form>
      </div>
  );
}
