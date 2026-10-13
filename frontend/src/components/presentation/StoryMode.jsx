import { useState, useCallback } from 'react';
import { playClickSound } from '../../utils/matrixUtils';
import styles from './StoryMode.module.css';

// Team and College Assets (Served from public directory)
const ADITYA_PFP = '/aditya-pfp.png';
const ANISH_PFP = '/anish-pfp.jpeg';
const VISHAL_PFP = '/vishal-pfp.jpeg';
const PRAKASH_PFP = '/prakash-pfp.jpeg';
const SBU_LOGO = '/sbu_logo.jpeg';

const SLIDES = [
  {
    id: 0,
    bg: '/minecraft_sunset.jpg',
    theme: 'overworld',
    overlay: 'rgba(0,0,0,0.6)',
  },
  {
    id: 1,
    bg: '/minecraft_village.jpg',
    theme: 'village',
    overlay: 'rgba(0,0,0,0.55)',
  },
  {
    id: 2,
    bg: '/minecraft_ocean.jpg',
    theme: 'ocean',
    overlay: 'rgba(0,20,40,0.58)',
  },
  {
    id: 3,
    bg: '/minecraft_nether.jpg',
    theme: 'nether',
    overlay: 'rgba(20,0,0,0.55)',
  },
  {
    id: 4,
    bg: '/minecraft_warden.jpg',
    theme: 'warden',
    overlay: 'rgba(0,10,20,0.58)',
  },
  {
    id: 5,
    bg: '/minecraft_end.jpg',
    theme: 'end',
    overlay: 'rgba(10,0,30,0.55)',
  },
];

/** Student Card with Minecraft Pixelated Frame */
function StudentCard({ img, name, id }) {
  return (
    <div className={styles.personCard}>
      <div className={styles.pixelFrame}>
        <img
          src={img}
          alt={name}
          className={styles.personImg}
          loading="eager"
        />
      </div>
      <div className={styles.personInfo}>
        <div className={styles.personName}>{name}</div>
        <div className={styles.personId}>SBU ID: {id}</div>
      </div>
    </div>
  );
}

/** Professor Card with Minecraft Golden Pixelated Frame */
function ProfessorCard({ img, name }) {
  return (
    <div className={`${styles.personCard} ${styles.professorCard}`}>
      <div className={`${styles.pixelFrame} ${styles.profFrame}`}>
        <img
          src={img}
          alt={name}
          className={styles.personImg}
          loading="eager"
        />
      </div>
      <div className={styles.personInfo}>
        <div className={styles.profName}>{name}</div>
      </div>
    </div>
  );
}

/** Matrix display for slide 2 */
function MatrixDisplay() {
  return (
    <div className={styles.matrixSection}>
      <div className={styles.matrixGroup}>
        <div className={styles.matrixTitle} style={{ color: '#4ADCDE' }}>Allocation (Held)</div>
        <table className="mc-matrix-table">
          <thead>
            <tr>
              <th></th><th>A (PCs)</th><th>B (Projectors)</th><th>C (Kits)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['P0 (Team 0)', '0', '1', '0'],
              ['P1 (Team 1)', '2', '0', '0'],
              ['P2 (Team 2)', '3', '0', '2'],
              ['P3 (Team 3)', '2', '1', '1'],
              ['P4 (Team 4)', '0', '0', '2'],
            ].map((r) => (
              <tr key={r[0]}>
                {r.map((c, i) =>
                  i === 0 ? (
                    <td key={i} style={{ color: '#FFCC00', fontFamily: 'var(--font-pixel)', fontSize: '8px' }}>
                      {c}
                    </td>
                  ) : (
                    <td key={i}>{c}</td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.matrixGroup}>
        <div className={styles.matrixTitle} style={{ color: '#FFCC00' }}>Max (Required)</div>
        <table className="mc-matrix-table">
          <thead>
            <tr><th></th><th>A (PCs)</th><th>B (Projectors)</th><th>C (Kits)</th></tr>
          </thead>
          <tbody>
            {[
              ['P0 (Team 0)', '7', '5', '3'],
              ['P1 (Team 1)', '3', '2', '2'],
              ['P2 (Team 2)', '9', '0', '2'],
              ['P3 (Team 3)', '2', '2', '2'],
              ['P4 (Team 4)', '4', '3', '3'],
            ].map((r) => (
              <tr key={r[0]}>
                {r.map((c, i) =>
                  i === 0 ? (
                    <td key={i} style={{ color: '#FFCC00', fontFamily: 'var(--font-pixel)', fontSize: '8px' }}>
                      {c}
                    </td>
                  ) : (
                    <td key={i}>{c}</td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.matrixGroup}>
        <div className={styles.matrixTitle} style={{ color: '#17DD62' }}>Need (Max − Alloc)</div>
        <table className="mc-matrix-table">
          <thead>
            <tr><th></th><th>A (PCs)</th><th>B (Projectors)</th><th>C (Kits)</th></tr>
          </thead>
          <tbody>
            {[
              ['P0 (Team 0)', '7', '4', '3'],
              ['P1 (Team 1)', '1', '2', '2'],
              ['P2 (Team 2)', '6', '0', '0'],
              ['P3 (Team 3)', '0', '1', '1'],
              ['P4 (Team 4)', '4', '3', '1'],
            ].map((r) => (
              <tr key={r[0]}>
                {r.map((c, i) =>
                  i === 0 ? (
                    <td key={i} style={{ color: '#FFCC00', fontFamily: 'var(--font-pixel)', fontSize: '8px' }}>
                      {c}
                    </td>
                  ) : (
                    <td key={i}>{c}</td>
                  )
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
    { p: 'P1 (Team 1)', work: '[3,3,2]', need: '[1,2,2]', after: '[5,3,2]' },
    { p: 'P3 (Team 3)', work: '[5,3,2]', need: '[0,1,1]', after: '[7,4,3]' },
    { p: 'P4 (Team 4)', work: '[7,4,3]', need: '[4,3,1]', after: '[7,4,5]' },
    { p: 'P0 (Team 0)', work: '[7,4,5]', need: '[7,4,3]', after: '[7,5,5]' },
    { p: 'P2 (Team 2)', work: '[7,5,5]', need: '[6,0,0]', after: '[10,5,7]' },
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
        ✅ Safe Execution Order: <span>P1 → P3 → P4 → P0 → P2</span>
      </div>
    </div>
  );
}

/** Interactive request decision for slide 4 */
function InteractiveRequest({ onDecision }) {
  const [decided, setDecided] = useState(null);
  const decide = (choice) => {
    setDecided(choice);
    if (onDecision) onDecision(choice);
  };
  return (
    <div className={styles.interactiveBox}>
      <p className={styles.interactiveQ}>
        💡 <strong>Live Campus Lab Scenario:</strong> Team P0 requests [0, 2, 0] units of Projectors.<br />
        <span style={{ color: '#CCCCCC', fontSize: '18px' }}>
          Available Lab Pool = [3, 3, 2]. Should the Lab In-Charge grant this request?
        </span>
      </p>
      {!decided ? (
        <div className={styles.decisionBtns}>
          <button className="mc-btn mc-btn-green" onClick={() => decide('grant')}>
            ✅ GRANT REQUEST
          </button>
          <button className="mc-btn mc-btn-red" onClick={() => decide('deny')}>
            ❌ DENY / DEFER
          </button>
        </div>
      ) : (
        <div className={`${styles.verdict} ${decided === 'grant' ? styles.verdictSafe : styles.verdictUnsafe}`}>
          {decided === 'grant'
            ? '✅ CORRECT! After allocating [0,2,0], Available=[3,1,2]. The system can still execute in order P1→P3→P4→P0→P2 safely!'
            : '❌ Actually, granting this request IS safe! The tentative state leaves enough resources for all teams to finish.'}
          <div style={{ marginTop: 8, fontSize: '16px', color: '#BBB' }}>
            The Banker evaluates tentative allocation and preserves a guaranteed safe sequence!
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
          <div className={styles.uniTag}>
            <img src={SBU_LOGO} alt="SBU Logo" className={styles.collegeLogo} />
            <span>Sarala Birla University — BCA Program</span>
          </div>
          <h1 className={styles.slideTitle}>BANKER&apos;S ALGORITHM &amp; DEADLOCK</h1>
          <p className={styles.slideSubtitle}>
            Resource Allocation &amp; Deadlock Avoidance in Operating Systems
          </p>

          <div className={styles.teamSection}>
            {/* Students in one row */}
            <div className={styles.studentsRow}>
              <StudentCard img={ADITYA_PFP} name="Aditya Verma" id="SBU2500852" />
              <StudentCard img={ANISH_PFP} name="Anish Deep Kerketta" id="SBU2500871" />
              <StudentCard img={VISHAL_PFP} name="Vishal Kumar" id="SBU2500915" />
            </div>

            {/* Professor in another row */}
            <div className={styles.professorRow}>
              <ProfessorCard img={PRAKASH_PFP} name="DR. Prakash Kumar" />
            </div>
          </div>

          <div className={styles.subjectBadge}>Operating Systems Project • 2026</div>
        </div>
      );

    case 1:
      return (
        <div className={styles.slideInner}>
          <div className={styles.slideChip} style={{ background: '#1C3A5A' }}>
            🏫 REAL-WORLD CAMPUS SCENARIO
          </div>
          <h2 className={styles.slideTitle} style={{ fontSize: 'clamp(20px, 3.5vw, 40px)' }}>
            💀 Deadlock &amp; The 4 Coffman Conditions
          </h2>
          <div className={styles.analogyBox}>
            <div className={styles.analogyIcon}>💻</div>
            <p className={styles.analogyText}>
              <strong style={{ color: '#FFCC00' }}>College Lab Example:</strong> Student Team A holds the College Projector and waits for the High-End Lab PC.
              Student Team B holds the High-End Lab PC and waits for the Projector.
              <br /><em style={{ color: '#FF6B6B' }}>Neither team can complete their submission, and neither releases equipment → DEADLOCK!</em>
            </p>
          </div>
          <div className={styles.conditionsGrid}>
            {[
              { icon: '🔒', title: 'Mutual Exclusion', desc: 'At least one resource (e.g. Lab Projector) is non-shareable; only one team uses it at a time.' },
              { icon: '🤝', title: 'Hold & Wait', desc: 'A team already holds allocated resources while waiting to acquire additional ones.' },
              { icon: '🚫', title: 'No Preemption', desc: 'Resources cannot be forcefully confiscated from a team until they finish voluntarily.' },
              { icon: '🔄', title: 'Circular Wait', desc: 'A closed chain of teams exists where Team A waits for Team B, and Team B waits for Team A.' },
            ].map((c) => (
              <div key={c.title} className={styles.conditionCard}>
                <div className={styles.conditionIcon}>{c.icon}</div>
                <div className={styles.conditionTitle}>{c.title}</div>
                <div className={styles.conditionDesc}>{c.desc}</div>
              </div>
            ))}
          </div>
          <div className={styles.warningBox}>
            ⚠️ All 4 conditions must hold simultaneously for a deadlock. Breaking even ONE condition eliminates deadlock!
          </div>
        </div>
      );

    case 2:
      return (
        <div className={styles.slideInner}>
          <div className={styles.slideChip} style={{ background: '#0B3040' }}>
            🏢 RESOURCE ALLOCATION STRATEGY
          </div>
          <h2 className={styles.slideTitle} style={{ fontSize: 'clamp(18px, 3vw, 36px)' }}>
            🏦 Banker&apos;s Algorithm &amp; Safety State
          </h2>
          <div className={styles.strategyRow}>
            {[
              { icon: '🛡️', label: 'Prevention', color: '#17DD62', desc: 'Design protocols to eliminate one of the 4 Coffman conditions.' },
              { icon: '🔍', label: 'Avoidance', color: '#FFCC00', desc: "Banker's Algorithm: OS only grants requests if a Safe Sequence remains." },
              { icon: '🩺', label: 'Detection', color: '#4ADCDE', desc: 'Allow allocations, periodically check for cycles, and recover if deadlocked.' },
            ].map((s) => (
              <div key={s.label} className={styles.stratCard} style={{ borderColor: s.color }}>
                <div style={{ fontSize: 26 }}>{s.icon}</div>
                <div style={{ color: s.color, fontFamily: 'var(--font-pixel)', fontSize: '10px' }}>{s.label}</div>
                <div className={styles.stratDesc}>{s.desc}</div>
              </div>
            ))}
          </div>
          <div className={styles.formulaBox}>
            <div className={styles.formulaTitle}>📐 Fundamental Matrices &amp; Formula</div>
            <div className={styles.formula}>
              <span style={{ color: '#17DD62' }}>Need[i][j]</span>
              <span style={{ color: 'white' }}> = </span>
              <span style={{ color: '#FFCC00' }}>Max[i][j]</span>
              <span style={{ color: 'white' }}> − </span>
              <span style={{ color: '#4ADCDE' }}>Allocation[i][j]</span>
            </div>
            <div className={styles.formulaNote}>
              Available[j] = Total Resources[j] − Σ Allocation[i][j]
            </div>
          </div>
          <MatrixDisplay />
        </div>
      );

    case 3:
      return (
        <div className={styles.slideInner}>
          <div className={styles.slideChip} style={{ background: '#3D0800' }}>
            ⚙️ STEP-BY-STEP SIMULATION
          </div>
          <h2 className={styles.slideTitle} style={{ fontSize: 'clamp(18px, 3vw, 36px)' }}>
            📋 Executing the Banker&apos;s Safety Algorithm
          </h2>
          <div className={styles.algoSteps}>
            <div className={styles.algoInit}>
              <span className={styles.algoLabel}>Initial Work Pool:</span>
              <span>Work = Available = <strong style={{ color: '#4ADCDE' }}>[3, 3, 2]</strong> (PCs, Projectors, Kits)</span>
              <span>Finish = <strong style={{ color: '#FFCC00' }}>[False, False, False, False, False]</strong></span>
            </div>
          </div>
          <SafetySteps />
        </div>
      );

    case 4:
      return (
        <div className={styles.slideInner}>
          <div className={styles.slideChip} style={{ background: '#001020' }}>
            📡 RESOURCE REQUEST PROTOCOL
          </div>
          <h2 className={styles.slideTitle} style={{ fontSize: 'clamp(18px, 3vw, 36px)' }}>
            🎯 Dynamic Request Evaluation
          </h2>
          <div className={styles.requestProtocol}>
            {[
              { n: '1', rule: 'Request[i] ≤ Need[i]', detail: 'Process cannot request more than its declared maximum claim.', color: '#17DD62' },
              { n: '2', rule: 'Request[i] ≤ Available', detail: 'System must have enough free resources right now; otherwise process waits.', color: '#FFCC00' },
              { n: '3', rule: 'Tentative Allocation', detail: 'OS hypothetically allocates: Avail -= Req, Alloc += Req, Need -= Req.', color: '#4ADCDE' },
              { n: '4', rule: 'Safety Check', detail: 'Run safety algorithm on the tentative state to search for a safe sequence.', color: '#FF9944' },
              { n: '5', rule: 'Commit or Rollback', detail: 'If safe → permanently grant. If unsafe → rollback state and process waits.', color: '#E74040' },
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
            <div className={styles.endBadge}>🎓 CONCLUSION</div>
            <h1 className={styles.endTitle}>SAFE STATE GUARANTEED!</h1>
            <p className={styles.endVerdict}>
              The Banker&apos;s Algorithm ensures the Operating System never enters an unsafe state.
              Like a prudent resource administrator, it only grants requests when all processes
              and student project teams can finish without starvation or circular deadlock.
            </p>
            <div className={styles.endChips}>
              <span className="mc-badge mc-badge-safe">✅ Deadlock Avoided</span>
              <span className="mc-badge mc-badge-info">📊 Optimal Allocation</span>
              <span className="mc-badge mc-badge-warn">🛡️ Operating Systems</span>
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
