import { useEffect, useState } from 'react';
import { playClickSound } from '../../utils/matrixUtils';
import styles from './ThankYou.module.css';

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
            From the Deadlock Survivors of Sarala Birla University
          </p>

          {/* Team */}
          <div className={styles.teamRow}>
            {[
              { emoji: '🧑‍💻', name: 'Aditya Verma', role: 'Lead Dev' },
              { emoji: '👩‍💻', name: 'Student 2', role: 'Co-Dev' },
              { emoji: '🧑‍🎓', name: 'Student 3', role: 'Research' },
              { emoji: '👨‍🏫', name: 'Prof. Guide', role: 'Mentor' },
            ].map((m) => (
              <div key={m.name} className={styles.member}>
                <div className={styles.memberEmoji}>{m.emoji}</div>
                <div className={styles.memberName}>{m.name}</div>
                <div className={styles.memberRole}>{m.role}</div>
              </div>
            ))}
          </div>

          {/* Credits */}
          <div className={styles.credits}>
            <div className={styles.creditLine}>
              <span className={styles.creditKey}>Course:</span>
              <span className={styles.creditVal}>Operating Systems — BCA Semester V</span>
            </div>
            <div className={styles.creditLine}>
              <span className={styles.creditKey}>Topic:</span>
              <span className={styles.creditVal}>Deadlock Avoidance — Banker&apos;s Algorithm</span>
            </div>
            <div className={styles.creditLine}>
              <span className={styles.creditKey}>Tech Stack:</span>
              <span className={styles.creditVal}>React + Node.js + Express</span>
            </div>
            <div className={styles.creditLine}>
              <span className={styles.creditKey}>Inspired by:</span>
              <span className={styles.creditVal}>Edsger W. Dijkstra (1965) &amp; Minecraft 🎮</span>
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
