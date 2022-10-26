import { FormEvent, useState } from 'react';
import styles from '../styles/Home.module.css';



export default function CreateStream() {
  // Key creation
  const [ playbackId, setPlaybackId ] = useState<string>();
  const [ streamId, setStreamId ] = useState<string>();
  const [ keyId, setKeyID ] = useState<string | null>(null);
  const [ getKeyId, setGetKeyId ] = useState<string>();
  const [ keyName, setKeyName ] = useState<string>();
  const [ userId, setUserId] = useState<string>();
  const [ createdAt, setCreatedAt ] = useState<string>();
  const [ publicKey, setPublicKey ] = useState<string>();
  const [ privateKey, setPrivateKey ] = useState<string>();
  const [ disabledCreate, setDisabledCreate ] = useState<boolean>( false );



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
      setPrivateKey( data.privateKey )
      setDisabledCreate(true)
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
        } )
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
      } );
    } catch (error) {
     console.log(error);
      
    }
}

//Delete Key

  async function deleteKey() {
    try {
    const response = await fetch('/api/deleteKey', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
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
          <button onClick={createKeys} className={styles.button} disabled={disabledCreate}>
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

      {/* Apply Playback Policy */}
      <div className={styles.main2}>
        <form onSubmit={applyPlaybackPolicy} method='PATCH' className={styles.card}>
          <h2>Apply Playback Policy</h2>
          <label htmlFor='streamId'>Stream Id: </label>
          <br />
          <input
            className={styles.input}
            type='text'
            value={streamId}
            name='name'
            required
            onChange={(e) => setStreamId(e.target.value)}
          />
          <br />
          <button type='submit' className={styles.button}>
            Apply Policy
          </button>
        </form>

        {/* Gate Stream */}
        <form onSubmit={gateStream} method='PATCH' className={styles.card}>
          <h2>Gate Stream</h2>
          <label htmlFor='stream'>Playback Id: </label>
          <br />
          <input
            className={styles.input}
            type='text'
            value={playbackId}
            name='name'
            required
            onChange={(e) => setPlaybackId(e.target.value)}
          />
          <br />
          <button type='submit' className={styles.button}>
            Gate Stream
          </button>
        </form>

        {/* Delete Signing Key */}
        <form onSubmit={gateStream} method='DELETE' className={styles.card}>
          <h2>Delete Key</h2>
          <label htmlFor='stream'>Key Id: </label>
          <br />
          <input
            className={styles.input}
            type='text'
            value={getKeyId}
            name='name'
            required
            onChange={(e) => setGetKeyId(e.target.value)}
          />
          <br />
          <button type='submit' className={styles.deletebutton}>
            Delete
          </button>
        </form>

        {/* Getting keys */}
        <a className={styles.card} href='/signingKeys'>
          Get Signing Keys
        </a>
      </div>
    </div>
  );
}
