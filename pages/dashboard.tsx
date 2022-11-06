import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import axios from 'axios';

interface KeyInfo {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  publicKey: string;
}

export default function CreateStream() {
  // Key creation
  const [playbackId, setPlaybackId] = useState<string>();
  const [streamId, setStreamId] = useState<string>();
  const [keyId, setKeyID] = useState<string | null>(null);
  const [deleteKeyId, setDeleteKeyId] = useState<string>();
  const [updateKeyId, setUpdateKeyId] = useState<string>();
  const [updateKeyName, setUpdateKeyName] = useState<string>();
  const [getKeyId, setGetKeyId] = useState<string>();
  const [keyName, setKeyName] = useState<string>();
  const [signKeyInfo, setSignKeyInfo] = useState<KeyInfo>();
  const [userId, setUserId] = useState<string>();
  const [createdAt, setCreatedAt] = useState<string>();
  const [publicKey, setPublicKey] = useState<string>();
  const [privateKey, setPrivateKey] = useState<string>();

  // Get key by Id
  async function getKeyById(e: FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch(`/api/keyInfo/${getKeyId}`, {
        method: 'GET',
      });
      const data = await response.json();
      setSignKeyInfo(data);
      console.log(data);
    } catch (error) {}
  }


  // Apply playback policy to stream
  async function applyPlaybackPolicy(e: FormEvent) {
    e.preventDefault();
    try {
      fetch('/api/applyPlaybackPolicy', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          streamId,
          playbackPolicy: {
            type: 'jwt',
          },
        }),
      });
    } catch (error) {
      console.log(error);
    }
    setStreamId('');
  }

  // Update playback policy
  async function updatePlaybackPolicy( policy: string) {
    try {
      await axios.patch( '/api/updatePlaybackPolicy', {
        streamId,
          type: policy
        } )
    } catch (error) {
      console.log(error);
    }
    setStreamId('');
  }

  // Update key
  async function updateKey(e: FormEvent) {
    e.preventDefault();
    try {
      await axios.patch('/api/updateKey', {
        updateKeyId,
        name: updateKeyName,
      });
    } catch (error) {
      console.log(error);
    }
    setUpdateKeyId('');
    setUpdateKeyName('');
  }

  // Disable Key

  async function disable(e: FormEvent) {
    e.preventDefault();
    try {
      await axios.patch('/api/updateKey', {
        updateKeyId,
        disabled: true,
      });
    } catch (error) {
      console.log(error);
    }
    setUpdateKeyId('');
  }

  // Disable Key
  async function enable(e: FormEvent) {
    e.preventDefault();
    try {
      await axios.patch('/api/updateKey', {
        updateKeyId,
        disabled: false,
      });
    } catch (error) {
      console.log(error);
    }
    setUpdateKeyId('');
  }

  //Delete Key
  async function deleteKey(e: FormEvent) {
    e.preventDefault();
    try {
      await fetch(`/api/deleteKey`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deleteKeyId,
        }),
      });
      setDeleteKeyId('');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Settings Dashboard</h1>
      <div className={styles.main2}>
        {/* Get key info */}
        <form onSubmit={getKeyById} method='GET' className={styles.card}>
          <h2>Get Key Info</h2>
          <label htmlFor='stream'>Key Id: </label>
          <br />
          <input
            className={styles.input}
            type='search'
            value={getKeyId}
            name='query'
            required
            onChange={(e) => setGetKeyId(e.target.value)}
          />
          <br />
          <button type='submit' className={styles.button}>
            Get Key Info
          </button>
          {!signKeyInfo ? (
            <></>
          ) : (
            <div className={styles.card}>
              <h2> Key Info</h2>
              <p>Id: {signKeyInfo.id}</p>
              <p>Name: {signKeyInfo.name}</p>
              <p>User Id: {signKeyInfo.userId}</p>
              <p>Created At: {signKeyInfo.createdAt}</p>
              <p>Public Key: {signKeyInfo.publicKey}</p>
            </div>
          )}
        </form>

        {/* Apply Playback Policy */}
        <div className={styles.card}>
          <h2>Playback Policy</h2>
          <label htmlFor='streamId'>Stream Id: </label>
          <br />
          <input
            className={styles.input}
            type='text'
            value={streamId}
            name='stream Id'
            required
            onChange={(e) => setStreamId(e.target.value)}
          />
          <br />
          <label htmlFor='policy'>Apply Playback Policy </label>
          <br />
          <button onClick={applyPlaybackPolicy} className={styles.button}>
            Apply Policy
          </button>
          <br />
          <label htmlFor='policy'>Update Playback Policy </label>
          <br />
          <button
            value={streamId}
            onClick={() => updatePlaybackPolicy('public')}
            className={styles.button}
          >
            Public Policy
          </button>

          <button value={streamId} onClick={applyPlaybackPolicy} className={styles.button}>
            Private Policy
          </button>
        </div>

        {/* Update signing key */}
        <div className={styles.card}>
          <h2>Update Signing Key</h2>
          <label htmlFor='stream'>Key Id: </label>
          <br />
          <input
            className={styles.input}
            type='text'
            value={updateKeyId}
            name='keyId'
            required
            onChange={(e) => setUpdateKeyId(e.target.value)}
          />
          <br />
          <label>Update Key Name: </label>
          <br />
          <input
            className={styles.input}
            type='text'
            value={updateKeyName}
            name='name'
            onChange={(e) => setUpdateKeyName(e.target.value)}
          />

          <br />
          <button onClick={updateKey} className={styles.button}>
            Update
          </button>
          <br />
          <p>Enable/Disable key</p>
          <button onClick={disable} className={styles.button}>
            Disable Key
          </button>
          <button onClick={enable} className={styles.button}>
            Enable Key
          </button>
        </div>

        {/* Delete Signing Key */}
        <form onSubmit={deleteKey} method='DELETE' className={styles.card}>
          <h2>Delete Key</h2>
          <label htmlFor='stream'>Key Id: </label>
          <br />
          <input
            className={styles.input}
            type='text'
            value={deleteKeyId}
            name='name'
            required
            onChange={(e) => setDeleteKeyId(e.target.value)}
          />
          <br />
          <button type='submit' className={styles.deletebutton}>
            Delete
          </button>
        </form>
      </div>

      {/* Getting keys */}
      <Link className={styles.card} href='/signingKeys'>
        Get Signing Keys
      </Link>
    </div>
  );
}
