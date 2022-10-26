import jwt, { TokenExpiredError, JwtPayload } from 'jsonwebtoken';
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



// Create signing keys for playback policy
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
      
    }
  }


  
// Gate stream
  async function gateStream() {

  const expiration = Math.floor( Date.now() / 1000 ) + 1000;
  const payload: JwtPayload = {
    sub: streamId,
    action: 'pull',
    iss: 'Livepeer Studio',
    pub: publicKey, 
    ex: expiration,
    video: 'none'
  }

const token = jwt.sign(payload, 'privateKey', {algorithm: 'ES256'}) 


    try {
      const response = await fetch(`/api/gateAPI`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( {
          type: 'jwt',
          pub: token,
          stream: streamId  
        } )
      } );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      
    }

  }

  return (
    <div className={styles.main}>
      {keyId ? (
        <div>
          <div className={styles.card}>
            <h2>Signing Keys Info</h2>
            <p>Id: {keyId}</p>
            <p>Name: {keyName}</p>
            <p>User Id: {userId}</p>
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
          <div className={styles.card}>
            <h2>Gate Stream</h2>
            <button onClick={gateStream}>Gate API</button>
          </div>
        </div>
      ) : (
        <div className={styles.card}>
          <h2>Create keys for Playback Policy</h2>
          <button onClick={createKeys}>Create keys</button>
        </div>
      )}
    </div>
  );
}
