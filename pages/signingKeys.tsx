import React from 'react';
import styles from '../styles/Home.module.css';

interface SigningKeysDetails {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  publicKey: string;
}



export async function getServerSideProps() {
  const res = await fetch(`https://livepeer.monster/api/access-control/signing-key`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.STAGING_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  const data: Array<SigningKeysDetails> = await res.json();

  console.log(data);
  return {
    props: {
       data,
    },
    
  };
}

export default function signingKeys([...data]: Array<SigningKeysDetails>) {
  return (
      <main className={styles.main}>
        <h1 className={styles.title}> Signing Keys</h1>
        <ul className={styles.grid}>
          {data.map((keyInfo) => {
            <div className={styles.card} key={keyInfo.id}>
              <h2>Get Keys Info</h2>
              <p>Key Id:{keyInfo.id} </p>
              <p>Key Name:{keyInfo.name} </p>
              <p>Public Key: {keyInfo.publicKey}</p>
              <p>Created At: {keyInfo.createdAt}</p>
              <p>User Id: {keyInfo.userId}</p>
            </div>;
          })}
        </ul>
      </main>
  );
}
