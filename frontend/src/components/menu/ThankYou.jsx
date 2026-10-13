import { useEffect, useState } from 'react';
import { playClickSound } from '../../utils/matrixUtils';
import styles from './ThankYou.module.css';

// Team and College Assets (Served from public directory)
const ADITYA_PFP = '/aditya-pfp.png';
const ANISH_PFP = '/anish-pfp.jpeg';
const VISHAL_PFP = '/vishal-pfp.jpeg';
const PRAKASH_PFP = '/prakash-pfp.jpeg';
const SBU_LOGO = '/sbu_logo.jpeg';

/** Generate random cherry petals */
function usePetals(count = 40) {
  const [petals] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 12 + 6,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 10,
      rotation: Math.random() * 360,
      drift: (Math.random() - 0.5) * 80,
      opacity: Math.random() * 0.7 + 0.3,
    }))
  );
  return petals;
}

export default function ThankYou({ onBack }) {
  const petals = usePetals(50);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div className={styles.screen}>
      {/* Cherry blossom background */}
      <div className={styles.bg} />
      <div className={styles.bgOverlay} />

      {/* Falling petals */}
      {petals.map((p) => (
        <div
          key={p.id}
          className={styles.petal}
          aria-hidden="true"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.7,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            '--drift': `${p.drift}px`,
            opacity: p.opacity,
          }}
        />
      ))}

      {/* Content */}
      <div className={`${styles.content} ${visible ? styles.visible : ''}`}>
        <div className={styles.thanksBox}>
          {/* Pixelated Thank You */}
          <div className={styles.thankYouLabel}>🌸 THANK YOU 🌸</div>
          <h1 className={styles.bigTitle}>ARIGATO!</h1>
          <p className={styles.subtitle}>
            <img src={SBU_LOGO} alt="SBU" className={styles.collegeLogoInline} />
            Sarala Birla University — Department of Computer Science
          </p>

          {/* Team Layout: Students in Row 1, Professor in Row 2 */}
          <div className={styles.teamSection}>
            {/* Students in one row with Minecraft Pixelated Frames */}
            <div className={styles.studentsRow}>
              {[
                { img: ADITYA_PFP, name: 'Aditya Verma', id: 'SBU2500852' },
                { img: ANISH_PFP, name: 'Anish Deep Kerketta', id: 'SBU2500871' },
                { img: VISHAL_PFP, name: 'Vishal Kumar', id: 'SBU2500915' },
              ].map((m) => (
                <div key={m.name} className={styles.member}>
                  <div className={styles.pixelFrame}>
                    <img src={m.img} alt={m.name} className={styles.personImg} loading="eager" />
                  </div>
                  <div className={styles.memberName}>{m.name}</div>
                  <div className={styles.memberId}>SBU ID: {m.id}</div>
                </div>
              ))}
            </div>

            {/* Professor in another row with Golden Pixelated Frame */}
            <div className={styles.professorRow}>
              <div className={styles.professorMember}>
                <div className={`${styles.pixelFrame} ${styles.profFrame}`}>
                  <img src={PRAKASH_PFP} alt="DR. Prakash Kumar" className={styles.personImg} loading="eager" />
                </div>
                <div className={styles.profName}>DR. Prakash Kumar</div>
              </div>
            </div>
          </div>

          {/* Credits */}
          <div className={styles.credits}>
            <div className={styles.creditLine}>
              <span className={styles.creditKey}>Institution:</span>
              <span className={styles.creditVal}>
                <img src={SBU_LOGO} alt="SBU" className={styles.collegeLogoInline} />
                Sarala Birla University — Ranchi
              </span>
            </div>
            <div className={styles.creditLine}>
              <span className={styles.creditKey}>Course:</span>
              <span className={styles.creditVal}>Operating Systems — BCA Semester V</span>
            </div>
            <div className={styles.creditLine}>
              <span className={styles.creditKey}>Topic:</span>
              <span className={styles.creditVal}>Deadlock Avoidance — Banker&apos;s Algorithm</span>
            </div>
            <div className={styles.creditLine}>
              <span className={styles.creditKey}>Implementation:</span>
              <span className={styles.creditVal}>Full-Stack Interactive Simulation &amp; PWA</span>
            </div>
          </div>

          {/* Quote */}
          <blockquote className={styles.quote}>
            &ldquo;The question of whether a computer can think is no more interesting than
            the question of whether a submarine can swim.&rdquo;
            <cite>— Edsger W. Dijkstra</cite>
          </blockquote>

          {/* Badges */}
          <div className={styles.badges}>
            <span className="mc-badge mc-badge-safe">✅ No Deadlocks</span>
            <span className="mc-badge mc-badge-info">💎 Diamond Grade</span>
            <span className="mc-badge mc-badge-warn">🌸 Cherry Blossom</span>
          </div>
        </div>

        {/* Back button */}
        <button
          className="mc-btn mc-btn-lg"
          id="btn-back-from-thankyou"
          onClick={() => { playClickSound(); onBack(); }}
          style={{ marginTop: 20 }}
        >
          🏠 Return to Main Menu
        </button>
      </div>
    </div>
  );
}
