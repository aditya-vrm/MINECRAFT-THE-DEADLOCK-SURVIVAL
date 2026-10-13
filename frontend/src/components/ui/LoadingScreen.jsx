import { useEffect, useState } from 'react';
import styles from './LoadingScreen.module.css';

/**
 * Minecraft-style dirt block loading screen.
 * Shows a pixelated progress bar from 0 → 100% in ~1.5 seconds,
 * then calls onComplete().
 */
export default function LoadingScreen({ message = 'Loading world...', onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      const increment = Math.random() * 12 + 6;
      current = Math.min(current + increment, 100);
      setProgress(Math.floor(current));
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(onComplete, 200);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={styles.screen}>
      {/* Dirt block tiled background */}
      <div className={styles.dirtBg} aria-hidden="true" />

      <div className={styles.content}>
        {/* Title */}
        <div className={styles.logo}>
          <span className={styles.logoMC}>BANKER&apos;S ALGORITHM</span>
          <span className={styles.logoSub}>&amp; DEADLOCK SIMULATOR</span>
        </div>

        {/* Loading label */}
        <p className={styles.message}>{message}</p>

        {/* Progress bar */}
        <div className={styles.barWrapper}>
          <div className={styles.barFill} style={{ width: `${progress}%` }} />
          <span className={styles.barText}>{progress}%</span>
        </div>

        {/* Minecraft tip */}
        <p className={styles.tip}>
          💡 TIP: The Banker&apos;s Algorithm was developed by Edsger W. Dijkstra!
        </p>
      </div>
    </div>
  );
}
