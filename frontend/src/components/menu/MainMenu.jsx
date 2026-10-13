import { useState, useEffect } from 'react';
import { playClickSound } from '../../utils/matrixUtils';
import styles from './MainMenu.module.css';

/**
 * The Hub — Main Menu
 * Full-screen cinematic Minecraft sunset with animated title and three main buttons.
 */
export default function MainMenu({ onStoryMode, onSurvivalMode, onThankYou }) {
  const [titleAnim, setTitleAnim] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setTitleAnim(true), 100);

    // Generate floating particle stars
    const pts = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 2,
    }));
    setParticles(pts);
  }, []);

  const handleBtn = (fn) => {
    playClickSound();
    fn();
  };

  return (
    <div className={styles.menu}>
      {/* Cinematic panning background */}
      <div className={styles.bgPan} aria-hidden="true" />
      {/* Dark overlay for contrast */}
      <div className={styles.overlay} aria-hidden="true" />

      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className={styles.particle}
          aria-hidden="true"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      <div className={styles.content}>
        {/* Game Logo */}
        <div className={`${styles.logoGroup} ${titleAnim ? styles.visible : ''}`}>
          {/* MINECRAFT title */}
          <h1 className={styles.logoMC}>
            <span>MINECRAFT</span>
          </h1>

          {/* Splash / subtitle */}
          <div className={styles.splash}>
            ✨ THE DEADLOCK SURVIVAL ✨
          </div>

          {/* Subtitle detail */}
          <p className={styles.edition}>
            Banker&apos;s Algorithm Edition — OS Deep Dive
          </p>
        </div>

        {/* Main buttons */}
        <div className={`${styles.btnGroup} ${titleAnim ? styles.visible : ''}`}>
          {/* Story Mode */}
          <button
            id="btn-story-mode"
            className={`mc-btn mc-btn-lg ${styles.menuBtn}`}
            onClick={() => handleBtn(onStoryMode)}
          >
            📖 Story Mode
            <span className={styles.btnHint}>The Presentation</span>
          </button>

          {/* Survival Mode */}
          <button
            id="btn-survival-mode"
            className={`mc-btn mc-btn-lg mc-btn-diamond ${styles.menuBtn}`}
            onClick={() => handleBtn(onSurvivalMode)}
          >
            ⚔️ Survival Mode
            <span className={styles.btnHint}>DeadlockGuard Simulator</span>
          </button>

          {/* Thank You / Cinematic */}
          <button
            id="btn-thank-you"
            className={`mc-btn mc-btn-lg ${styles.menuBtn} ${styles.btnCherry}`}
            onClick={() => handleBtn(onThankYou)}
          >
            🌸 Cherry Blossom Realm
            <span className={styles.btnHint}>Credits & Thank You</span>
          </button>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <p className={styles.footerText}>Sarala Birla University — BCA Program</p>
          <p className={styles.footerText}>Operating Systems Project • 2026</p>
        </div>
      </div>

      {/* Version watermark */}
      <div className={styles.version}>v1.0.0 • Banker&apos;s Edition</div>
    </div>
  );
}
