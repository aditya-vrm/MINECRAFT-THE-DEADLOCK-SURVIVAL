import { useState, useEffect } from 'react';
import { playClickSound } from '../../utils/matrixUtils';
import styles from './MainMenu.module.css';

/**
 * The Hub — Main Menu
 * Full-screen cinematic sunset with animated title and main mode buttons.
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
        {/* Topic Title Group */}
        <div className={`${styles.logoGroup} ${titleAnim ? styles.visible : ''}`}>
          {/* Prominent SBU College Branding at Top */}
          <div className={styles.topUniHeader}>
            <img src="/sbu_logo.jpeg" alt="SBU Logo" className={styles.topCollegeLogo} />
            <span className={styles.topUniText}>SARALA BIRLA UNIVERSITY</span>
          </div>

          <h1 className={styles.logoMC}>
            <span>BANKER&apos;S ALGORITHM</span>
            <span className={styles.logoSub}>&amp; DEADLOCK</span>
          </h1>

          {/* Splash text */}
          <div className={styles.splash}>
            ⚡ RESOURCE ALLOCATION &amp; SAFETY SIMULATOR ⚡
          </div>

          {/* Subtitle detail */}
          <p className={styles.edition}>
            Operating Systems • BCA III Semester
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
            <span className={styles.btnHint}>The Presentation Slides</span>
          </button>

          {/* Survival Mode */}
          <button
            id="btn-survival-mode"
            className={`mc-btn mc-btn-lg mc-btn-diamond ${styles.menuBtn}`}
            onClick={() => handleBtn(onSurvivalMode)}
          >
            💻 Simulator Mode
            <span className={styles.btnHint}>Banker&apos;s Algorithm Lab</span>
          </button>

          {/* Thank You / Cinematic */}
          <button
            id="btn-thank-you"
            className={`mc-btn mc-btn-lg ${styles.menuBtn} ${styles.btnCherry}`}
            onClick={() => handleBtn(onThankYou)}
          >
            🌸 Acknowledgments
            <span className={styles.btnHint}>Team &amp; Guidance</span>
          </button>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.footerBrand}>
            <img src="/sbu_logo.jpeg" alt="SBU Logo" className={styles.collegeLogoSmall} />
            <span className={styles.footerText}>Sarala Birla University — BCA Program</span>
          </div>
          <p className={styles.footerText}>Department of Computer Science • 2026</p>
        </div>
      </div>

      {/* Version watermark */}
      <div className={styles.version}>v2.0 • SBU Edition</div>
    </div>
  );
}
