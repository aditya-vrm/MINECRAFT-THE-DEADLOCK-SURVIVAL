import { useState, useCallback } from 'react';
import { playClickSound } from '../../utils/matrixUtils';
import styles from './StoryMode.module.css';

const SLIDES = [
  {
    id: 0,
    bg: '/minecraft_sunset.jpg',
    theme: 'overworld',
    overlay: 'rgba(0,0,0,0.55)',
  },
  {
    id: 1,
    bg: '/minecraft_village.jpg',
    theme: 'village',
    overlay: 'rgba(0,0,0,0.5)',
  },
  {
    id: 2,
    bg: '/minecraft_ocean.jpg',
    theme: 'ocean',
    overlay: 'rgba(0,20,40,0.55)',
  },
  {
    id: 3,
    bg: '/minecraft_nether.jpg',
    theme: 'nether',
    overlay: 'rgba(20,0,0,0.5)',
  },
  {
    id: 4,
    bg: '/minecraft_warden.jpg',
    theme: 'warden',
    overlay: 'rgba(0,10,20,0.55)',
  },
  {
    id: 5,
    bg: '/minecraft_end.jpg',
    theme: 'end',
    overlay: 'rgba(10,0,30,0.5)',
  },
];

/** Placeholder person card */
function PersonCard({ emoji, name, role, subtitle }) {
  return (
    <div className={styles.personCard}>
      <div className={styles.personAvatar}>{emoji}</div>
      <div className={styles.personInfo}>
        <div className={styles.personName}>{name}</div>
        <div className={styles.personRole}>{role}</div>
        {subtitle && <div className={styles.personSub}>{subtitle}</div>}
      </div>
    </div>
  );
}

/** Matrix display for slide 3 */
function MatrixDisplay() {
  return (
    <div className={styles.matrixSection}>
      <div className={styles.matrixGroup}>
        <div className={styles.matrixTitle} style={{ color: '#4ADCDE' }}>Allocation</div>
        <table className="mc-matrix-table">
          <thead>
            <tr>
              <th></th><th>A</th><th>B</th><th>C</th>
            </tr>
          </thead>
          <tbody>
            {[['P0','0','1','0'],['P1','2','0','0'],['P2','3','0','2'],['P3','2','1','1'],['P4','0','0','2']].map(r => (
              <tr key={r[0]}>
                {r.map((c, i) => i === 0
                  ? <td key={i} style={{ color: '#FFCC00', fontFamily: 'var(--font-pixel)', fontSize: '9px' }}>{c}</td>
                  : <td key={i}>{c}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.matrixGroup}>
        <div className={styles.matrixTitle} style={{ color: '#FFCC00' }}>Max</div>
        <table className="mc-matrix-table">
          <thead>
            <tr><th></th><th>A</th><th>B</th><th>C</th></tr>
          </thead>
          <tbody>
            {[['P0','7','5','3'],['P1','3','2','2'],['P2','9','0','2'],['P3','2','2','2'],['P4','4','3','3']].map(r => (
              <tr key={r[0]}>
                {r.map((c, i) => i === 0
                  ? <td key={i} style={{ color: '#FFCC00', fontFamily: 'var(--font-pixel)', fontSize: '9px' }}>{c}</td>
                  : <td key={i}>{c}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.matrixGroup}>
        <div className={styles.matrixTitle} style={{ color: '#17DD62' }}>Need = Max − Alloc</div>
        <table className="mc-matrix-table">
          <thead>
            <tr><th></th><th>A</th><th>B</th><th>C</th></tr>
          </thead>
          <tbody>
            {[['P0','7','4','3'],['P1','1','2','2'],['P2','6','0','0'],['P3','0','1','1'],['P4','4','3','1']].map(r => (
              <tr key={r[0]}>
                {r.map((c, i) => i === 0
                  ? <td key={i} style={{ color: '#FFCC00', fontFamily: 'var(--font-pixel)', fontSize: '9px' }}>{c}</td>
                  : <td key={i} style={{ color: '#17DD62' }}>{c}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Safety algorithm step-by-step */
function SafetySteps() {
  const steps = [
    { p: 'P1', work: '[3,3,2]', need: '[1,2,2]', after: '[5,3,2]', done: true },
    { p: 'P3', work: '[5,3,2]', need: '[0,1,1]', after: '[7,4,3]', done: true },
    { p: 'P4', work: '[7,4,3]', need: '[4,3,1]', after: '[7,4,5]', done: true },
    { p: 'P0', work: '[7,4,5]', need: '[7,4,3]', after: '[7,5,5]', done: true },
    { p: 'P2', work: '[7,5,5]', need: '[6,0,0]', after: '[10,5,7]', done: true },
  ];
  return (
    <div className={styles.stepsContainer}>
      {steps.map((s, i) => (
        <div key={i} className={styles.step} style={{ animationDelay: `${i * 0.15}s` }}>
          <span className={styles.stepProcess}>{s.p}</span>
          <span className={styles.stepDetail}>Work{s.work} ≥ Need{s.need}</span>
          <span className={styles.stepArrow}>→</span>
          <span className={styles.stepResult}>Work = {s.after} ✓</span>
        </div>
      ))}
      <div className={styles.safeSeq}>
        ✅ Safe Sequence: <span>P1 → P3 → P4 → P0 → P2</span>
      </div>
    </div>
  );
}

/** Interactive request decision for slide 5 */
function InteractiveRequest({ onDecision }) {
  const [decided, setDecided] = useState(null);
  const decide = (choice) => {
    setDecided(choice);
    if (onDecision) onDecision(choice);
  };
  return (
    <div className={styles.interactiveBox}>
      <p className={styles.interactiveQ}>
        🎮 <strong>Live Poll:</strong> Steve (P0) requests [0,2,0] diamonds.<br />
        <span style={{ color: '#AAAAAA', fontSize: '18px' }}>
          Available = [3,3,2]. Should the OS grant this request?
        </span>
      </p>
      {!decided ? (
        <div className={styles.decisionBtns}>
          <button className="mc-btn mc-btn-green" onClick={() => decide('grant')}>
            ✅ GRANT IT!
          </button>
          <button className="mc-btn mc-btn-red" onClick={() => decide('deny')}>
            ❌ DENY IT!
          </button>
        </div>
      ) : (
        <div className={`${styles.verdict} ${decided === 'grant' ? styles.verdictSafe : styles.verdictUnsafe}`}>
          {decided === 'grant'
            ? '✅ CORRECT! After [0,2,0], Available=[3,1,2]. Safety check: P1→P3→P4→P0→P2 still safe!'
            : '❌ Actually, granting IS safe here! The new state has a safe sequence.'}
          <div style={{ marginTop: 8, fontSize: '16px', color: '#AAA' }}>
            The Banker always checks safety BEFORE granting!
          </div>
        </div>
      )}
    </div>
  );
}

function SlideContent({ slideIdx }) {
  switch (slideIdx) {
    case 0:
      return (
        <div className={styles.slideInner}>
          <div className={styles.uniTag}>🎓 Sarala Birla University — BCA Program</div>
          <h1 className={styles.slideTitle}>MINECRAFT: THE DEADLOCK SURVIVAL</h1>
          <p className={styles.slideSubtitle}>
            Banker&apos;s Algorithm & OS Deadlock Management
          </p>
          <div className={styles.teamGrid}>
            <PersonCard emoji="🧑‍💻" name="Aditya Verma" role="Lead Developer" subtitle="Roll No: 001" />
            <PersonCard emoji="👩‍💻" name="Student 2" role="Co-Developer" subtitle="Roll No: 002" />
            <PersonCard emoji="🧑‍🎓" name="Student 3" role="Researcher" subtitle="Roll No: 003" />
            <PersonCard emoji="👨‍🏫" name="Prof. Guide" role="Faculty Mentor" subtitle="Department of CS" />
          </div>
          <div className={styles.subjectBadge}>Subject: Operating Systems | Semester V</div>
        </div>
      );

    case 1:
      return (
        <div className={styles.slideInner}>
          <div className={styles.slideChip} style={{ background: '#2D4A1C' }}>
            🌿 OVERWORLD — Village Scene
          </div>
          <h2 className={styles.slideTitle} style={{ fontSize: 'clamp(20px, 3.5vw, 42px)' }}>
            💀 Deadlock & The 4 Conditions
          </h2>
          <div className={styles.analogyBox}>
            <div className={styles.analogyIcon}>⛏️</div>
            <p className={styles.analogyText}>
              <strong style={{ color: '#FFCC00' }}>Minecraft Analogy:</strong> Steve has a Diamond Pickaxe and needs Iron Ore.
              Alex has Iron Ore and needs the Diamond Pickaxe.
              <br /><em style={{ color: '#FF6B6B' }}>Neither will let go → DEADLOCK!</em>
            </p>
          </div>
          <div className={styles.conditionsGrid}>
            {[
              { icon: '🔒', title: 'Mutual Exclusion', desc: 'Only one player holds the Diamond Pickaxe at a time.' },
              { icon: '🤝', title: 'Hold & Wait', desc: 'Steve holds the Pickaxe while waiting for Iron Ore.' },
              { icon: '🚫', title: 'No Preemption', desc: 'You can\'t forcibly take the Pickaxe from Steve.' },
              { icon: '🔄', title: 'Circular Wait', desc: 'Steve waits for Alex, Alex waits for Steve — a cycle!' },
            ].map((c) => (
              <div key={c.title} className={styles.conditionCard}>
                <div className={styles.conditionIcon}>{c.icon}</div>
                <div className={styles.conditionTitle}>{c.title}</div>
                <div className={styles.conditionDesc}>{c.desc}</div>
              </div>
            ))}
          </div>
          <div className={styles.warningBox}>
            ⚠️ ALL 4 must hold simultaneously for deadlock. Break any one = no deadlock!
          </div>
        </div>
      );

    case 2:
      return (
        <div className={styles.slideInner}>
          <div className={styles.slideChip} style={{ background: '#0B3040' }}>
            🌊 UNDERWATER — Ocean Monument
          </div>
          <h2 className={styles.slideTitle} style={{ fontSize: 'clamp(18px, 3vw, 36px)' }}>
            🏦 Strategies & The Banker&apos;s Model
          </h2>
          <div className={styles.strategyRow}>
            {[
              { icon: '🛡️', label: 'Prevention', color: '#17DD62', desc: 'Deny at least one of the 4 conditions.' },
              { icon: '🔍', label: 'Avoidance', color: '#FFCC00', desc: "Banker's Algorithm — never enter unsafe state." },
              { icon: '🩺', label: 'Detection', color: '#4ADCDE', desc: 'Allow deadlocks, then detect & recover.' },
            ].map((s) => (
              <div key={s.label} className={styles.stratCard} style={{ borderColor: s.color }}>
                <div style={{ fontSize: 28 }}>{s.icon}</div>
                <div style={{ color: s.color, fontFamily: 'var(--font-pixel)', fontSize: '10px' }}>{s.label}</div>
                <div className={styles.stratDesc}>{s.desc}</div>
              </div>
            ))}
          </div>
          <div className={styles.formulaBox}>
            <div className={styles.formulaTitle}>📐 Core Formula</div>
            <div className={styles.formula}>
              <span style={{ color: '#17DD62' }}>Need</span>
              <span style={{ color: 'white' }}> = </span>
              <span style={{ color: '#FFCC00' }}>Max</span>
              <span style={{ color: 'white' }}> − </span>
              <span style={{ color: '#4ADCDE' }}>Allocation</span>
            </div>
            <div className={styles.formulaNote}>
              Available = Total Resources − Σ Allocations
            </div>
          </div>
          <MatrixDisplay />
        </div>
      );

    case 3:
      return (
        <div className={styles.slideInner}>
          <div className={styles.slideChip} style={{ background: '#3D0800' }}>
            🔥 NETHER — Ghasts & Lava Falls
          </div>
          <h2 className={styles.slideTitle} style={{ fontSize: 'clamp(18px, 3vw, 36px)' }}>
            ⚙️ Running the Safety Algorithm
          </h2>
          <div className={styles.algoSteps}>
            <div className={styles.algoInit}>
              <span className={styles.algoLabel}>Initial:</span>
              <span>Work = Available = <strong style={{ color: '#4ADCDE' }}>[3, 3, 2]</strong></span>
              <span>Finish = <strong style={{ color: '#FFCC00' }}>[F, F, F, F, F]</strong></span>
            </div>
          </div>
          <SafetySteps />
        </div>
      );

    case 4:
      return (
        <div className={styles.slideInner}>
          <div className={styles.slideChip} style={{ background: '#001020' }}>
            🦷 ANCIENT CITY — Warden Territory
          </div>
          <h2 className={styles.slideTitle} style={{ fontSize: 'clamp(18px, 3vw, 36px)' }}>
            📡 Runtime Request & System Override
          </h2>
          <div className={styles.requestProtocol}>
            {[
              { n: '1', rule: 'Request[i] ≤ Need[i]', detail: 'Process can\'t request more than it declared as its max.', color: '#17DD62' },
              { n: '2', rule: 'Request[i] ≤ Available', detail: 'Resources must actually be available right now.', color: '#FFCC00' },
              { n: '3', rule: 'Tentative Allocation', detail: 'OS temporarily grants the request in a copy of state.', color: '#4ADCDE' },
              { n: '4', rule: 'Safety Check', detail: 'Run Banker\'s Algorithm on the tentative state.', color: '#FF9944' },
              { n: '5', rule: 'Commit or Rollback', detail: 'Safe → commit. Unsafe → restore original state & defer.', color: '#E74040' },
            ].map((r) => (
              <div key={r.n} className={styles.ruleRow}>
                <div className={styles.ruleNum} style={{ color: r.color, borderColor: r.color }}>
                  {r.n}
                </div>
                <div className={styles.ruleContent}>
                  <div className={styles.ruleTitle} style={{ color: r.color }}>{r.rule}</div>
                  <div className={styles.ruleDetail}>{r.detail}</div>
                </div>
              </div>
            ))}
          </div>
          <InteractiveRequest />
        </div>
      );

    case 5:
      return (
        <div className={styles.slideInner}>
          <div className={styles.endContent}>
            <div className={styles.endBadge}>🐉 THE END</div>
            <h1 className={styles.endTitle}>DRAGON SLAIN!</h1>
            <p className={styles.endVerdict}>
              The Banker&apos;s Algorithm is the OS&apos;s shield — it ensures every resource
              allocation keeps the system in a safe state, just like a wise banker who
              never lends more than the kingdom can repay.
            </p>
            <div className={styles.endChips}>
              <span className="mc-badge mc-badge-safe">✅ Deadlock Avoided</span>
              <span className="mc-badge mc-badge-info">🏦 Banker Wins</span>
              <span className="mc-badge mc-badge-warn">⚔️ OS Mastered</span>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

export default function StoryMode({ onBack }) {
  const [slide, setSlide] = useState(0);
  const total = SLIDES.length;

  const prev = useCallback(() => {
    playClickSound();
    setSlide((s) => Math.max(0, s - 1));
  }, []);

  const next = useCallback(() => {
    playClickSound();
    setSlide((s) => Math.min(total - 1, s + 1));
  }, [total]);

  const current = SLIDES[slide];

  return (
    <div className={styles.storyMode}>
      {/* Background */}
      <div
        className={styles.bg}
        style={{ backgroundImage: `url('${current.bg}')` }}
      />
      <div className={styles.overlay} style={{ background: current.overlay }} />

      {/* Slide content */}
      <div key={slide} className={styles.slide}>
        <SlideContent slideIdx={slide} />
      </div>

      {/* Navigation */}
      <div className={styles.navBar}>
        {/* Back to menu */}
        <button className="mc-btn mc-btn-sm" onClick={() => { playClickSound(); onBack(); }}>
          ← MENU
        </button>

        <div className={styles.navControls}>
          {/* Prev */}
          <button
            className={`${styles.navBtn} ${slide === 0 ? styles.navDisabled : ''}`}
            onClick={prev}
            disabled={slide === 0}
            id="slide-prev"
          >
            ◀
          </button>

          {/* Slide indicators */}
          <div className={styles.dots}>
            {SLIDES.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === slide ? styles.dotActive : ''}`}
                onClick={() => { playClickSound(); setSlide(i); }}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Next */}
          <button
            className={`${styles.navBtn} ${slide === total - 1 ? styles.navDisabled : ''}`}
            onClick={next}
            disabled={slide === total - 1}
            id="slide-next"
          >
            ▶
          </button>
        </div>

        {/* Slide counter */}
        <div className={styles.counter}>
          {slide + 1} / {total}
        </div>
      </div>
    </div>
  );
}
