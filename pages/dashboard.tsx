import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

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
  const [disabledCreate, setDisabledCreate] = useState<boolean>(false);
  const [selectDisableKey, setSelectDisableKey] = useState<string>();
  const [disableKey, setDisableKey] = useState<boolean>(false);


 
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
  }

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

  // Update key
  async function updateKey(e: FormEvent) {
    e.preventDefault();
    try {
      if (selectDisableKey === 'true') {
        setDisableKey(true);
      }
      if (selectDisableKey === 'false') {
        setDisableKey(false);
      }
      await fetch(`/api/updateKey`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updateKeyId,
          // disable: disableKey,
          name: updateKeyName,
        }),
      });
    } catch (error) {
      console.log(error);
    }
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
        <form onSubmit={applyPlaybackPolicy} method='PATCH' className={styles.card}>
          <h2>Apply Playback Policy</h2>
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
          <button type='submit' className={styles.button}>
            Apply Policy
          </button>
        </form>

        {/* Update signing key */}
        <form onSubmit={updateKey} method='PATCH' className={styles.card}>
          <h2>Update Signing Key</h2>
          <label htmlFor='stream'>Key Id: </label>
          <br />
          <input
            className={styles.input}
            type='text'
            value={updateKeyId}
            name='name'
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
          {/* <br />
          <label htmlFor='disabledKey'>Disable Key</label>
          <br />
          <select name='disableKey' onChange={(e) => setSelectDisableKey(e.target.value)}>
            <option disabled selected>
              Select an option
            </option>
            <option value={'true'}>Disable Key</option>
            <option value={'false'}>Enable Key</option>
          </select> */}

          <br />
          <button type='submit' className={styles.button}>
            Update
          </button>
        </form>

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
      {/* <Link className={styles.card} href='/signingKeys'>
        Get Signing Keys
      </Link> */}
    </div>
  );
}
