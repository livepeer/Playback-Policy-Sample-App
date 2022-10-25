import React from 'react'
import { Player } from '@livepeer/react'
import styles from '../styles/Home.module.css';

export default function view() {
  return (
    <div className={ styles.main }>
      <h1>Enjoy the video</h1>
      <div className={styles.card}>
        <Player
          // playbackId={ }
          showPipButton
        />
      </div>
    </div>
  );
}
