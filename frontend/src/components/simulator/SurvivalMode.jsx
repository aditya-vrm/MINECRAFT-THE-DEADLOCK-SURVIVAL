import { useState, useCallback, useEffect } from 'react';
import { playClickSound, playSuccessSound, playErrorSound, calculateAvailable, createMatrix } from '../../utils/matrixUtils';
import { statelessSafetyCheck, getScenarios } from '../../services/api';
import styles from './SurvivalMode.module.css';

/* ─── Defaults ────────────────────────────────────── */
const DEFAULT_PROCS = 5;
const DEFAULT_RES = 3;

const DEFAULT_MAX = [
  [7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3],
];
const DEFAULT_ALLOC = [
  [0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2],
];
const DEFAULT_TOTAL = [10, 5, 7];
const DEFAULT_PNAMES = ['Team Alpha (P0)', 'Team Beta (P1)', 'Team Gamma (P2)', 'Team Delta (P3)', 'Team Omega (P4)'];
const DEFAULT_RNAMES = ['💻 Lab PCs (A)', '📽️ Projectors (B)', '📚 Ref Kits (C)'];

/* ─── Matrix input cell ───────────────────────────── */
function MatrixCell({ value, onChange, highlight }) {
  return (
    <input
      type="number"
      min="0"
      max="99"
      value={value}
      onChange={(e) => onChange(Math.max(0, parseInt(e.target.value, 10) || 0))}
      className={`${styles.matCell} ${highlight ? styles.matCellHL : ''}`}
    />
  );
}

/* ─── Result Step card ────────────────────────────── */
function StepCard({ step, index }) {
  return (
    <div
      className={styles.stepCard}
      style={{ animationDelay: `${index * 0.12}s` }}
    >
      <div className={styles.stepBadge}>Step {index + 1}</div>
      <div className={styles.stepProcess}>{step.process} completes ✓</div>
      <div className={styles.stepDetails}>
        <span>Work<sub>before</sub>: [{step.workBefore.join(', ')}]</span>
        <span>Need: [{step.need.join(', ')}]</span>
        <span>Released: [{step.allocationReleased.join(', ')}]</span>
        <span className={styles.stepAfter}>Work<sub>after</sub>: [{step.workAfter.join(', ')}]</span>
      </div>
    </div>
  );
}

/* ─── Resource request panel ──────────────────────── */
function RequestPanel({ numProcs, numRes, procNames, resNames, onRequest, disabled }) {
  const [proc, setProc] = useState(0);
  const [req, setReq] = useState(Array(numRes).fill(0));
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    setLoading(true);
    setResult(null);
    playClickSound();
    try {
      const res = await onRequest(proc, req);
      setResult(res);
      if (res.granted) playSuccessSound(); else playErrorSound();
    } catch (e) {
      setResult({ granted: false, reason: e.message });
      playErrorSound();
    }
    setLoading(false);
  };

  return (
    <div className={styles.requestPanel}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>📡</span>
        <span className={styles.sectionTitle}>Resource Request Simulator</span>
      </div>

      <div className={styles.requestForm}>
        <div className={styles.requestField}>
          <label className="mc-label">Process</label>
          <select
            className={styles.mcSelect}
            value={proc}
            onChange={(e) => setProc(parseInt(e.target.value, 10))}
          >
            {Array.from({ length: numProcs }, (_, i) => (
              <option key={i} value={i}>P{i} — {procNames[i] || `Process ${i}`}</option>
            ))}
          </select>
        </div>

        <div className={styles.requestFields}>
          {Array.from({ length: numRes }, (_, j) => (
            <div key={j} className={styles.reqResField}>
              <label className="mc-label">{resNames[j] || `R${j}`}</label>
              <input
                type="number"
                min="0"
                max="99"
                className={styles.reqInput}
                value={req[j]}
                onChange={(e) => {
                  const newReq = [...req];
                  newReq[j] = Math.max(0, parseInt(e.target.value, 10) || 0);
                  setReq(newReq);
                }}
              />
            </div>
          ))}
        </div>

        <button
          className={`mc-btn mc-btn-diamond ${styles.requestBtn}`}
          onClick={handleRequest}
          disabled={disabled || loading}
          id="btn-submit-request"
        >
          {loading ? '⏳ Checking...' : '📡 Submit Request'}
        </button>
      </div>

      {result && (
        <div className={`${styles.requestResult} ${result.granted ? styles.reqSafe : styles.reqUnsafe}`}>
          <div className={styles.requestVerdict}>
            {result.granted ? '✅ REQUEST GRANTED' : '❌ REQUEST DENIED'}
          </div>
          <div className={styles.requestReason}>{result.reason}</div>
          {result.safeResult?.safe && (
            <div className={styles.reqSeq}>
              Safe Sequence: {result.safeResult.safeSequence.join(' → ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Main Survival Mode ──────────────────────────── */
export default function SurvivalMode({ onBack }) {
  const [numProcs, setNumProcs] = useState(DEFAULT_PROCS);
  const [numRes, setNumRes] = useState(DEFAULT_RES);
  const [procNames, setProcNames] = useState([...DEFAULT_PNAMES]);
  const [resNames, setResNames] = useState([...DEFAULT_RNAMES]);
  const [totalRes, setTotalRes] = useState([...DEFAULT_TOTAL]);
  const [maxMat, setMaxMat] = useState(DEFAULT_MAX.map((r) => [...r]));
  const [allocMat, setAllocMat] = useState(DEFAULT_ALLOC.map((r) => [...r]));
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepMode, setStepMode] = useState(false);
  const [activeTab, setActiveTab] = useState('matrices'); // matrices | request | results | graph
  const [apiAvailable, setApiAvailable] = useState(true);

  // Derived: Available = Total - Σ Alloc
  const available = calculateAvailable(totalRes, allocMat);
  // Need = Max - Alloc
  const needMat = maxMat.map((row, i) =>
    row.map((val, j) => Math.max(0, val - (allocMat[i]?.[j] || 0)))
  );

  useEffect(() => {
    getScenarios()
      .then((d) => setScenarios(d.scenarios || []))
      .catch(() => setApiAvailable(false));
  }, []);

  // Resize matrices when dimensions change
  const resizeMat = useCallback((mat, n, m, fill = 0) => {
    const result = Array.from({ length: n }, (_, i) =>
      Array.from({ length: m }, (_, j) => mat[i]?.[j] ?? fill)
    );
    return result;
  }, []);

  const handleDimChange = (newP, newR) => {
    setNumProcs(newP);
    setNumRes(newR);
    setMaxMat((m) => resizeMat(m, newP, newR, 0));
    setAllocMat((m) => resizeMat(m, newP, newR, 0));
    setTotalRes((t) => Array.from({ length: newR }, (_, j) => t[j] ?? 3));
    setProcNames((n) => Array.from({ length: newP }, (_, i) => n[i] || `Process ${i}`));
    setResNames((n) => Array.from({ length: newR }, (_, j) => n[j] || `R${j}`));
    setResult(null);
  };

  const updateMax = (i, j, val) => {
    setMaxMat((m) => {
      const next = m.map((r) => [...r]);
      next[i][j] = val;
      return next;
    });
  };
  const updateAlloc = (i, j, val) => {
    setAllocMat((m) => {
      const next = m.map((r) => [...r]);
      next[i][j] = val;
      return next;
    });
  };

  const loadScenario = (scenario) => {
    playClickSound();
    const n = scenario.processes.length;
    const m = scenario.resources.length;
    setNumProcs(n);
    setNumRes(m);
    setProcNames(scenario.processes.map((p) => p.name));
    setResNames(scenario.resources.map((r) => r.name));
    setTotalRes(scenario.resources.map((r) => r.total));
    setMaxMat(scenario.processes.map((p) => [...p.max]));
    setAllocMat(scenario.processes.map((p) => [...p.allocation]));
    setResult(null);
    setError(null);
    setActiveTab('matrices');
  };

  // Pure client-side safety algorithm (mirrors backend)
  const runLocalSafety = useCallback((avail, alloc, need) => {
    const n = alloc.length;
    const m = avail.length;
    const work = [...avail];
    const finish = new Array(n).fill(false);
    const safeSeq = [];
    const steps = [];
    let found = true;

    while (found) {
      found = false;
      for (let i = 0; i < n; i++) {
        if (finish[i]) continue;
        if (need[i].every((v, j) => v <= work[j])) {
          const wb = [...work];
          for (let j = 0; j < m; j++) work[j] += alloc[i][j];
          finish[i] = true;
          safeSeq.push(`P${i} (${procNames[i] || i})`);
          steps.push({
            process: `P${i} — ${procNames[i] || 'Process ' + i}`,
            workBefore: wb,
            need: [...need[i]],
            allocationReleased: [...alloc[i]],
            workAfter: [...work],
          });
          found = true;
          break;
        }
      }
    }
    return { safe: finish.every(Boolean), safeSequence: safeSeq, steps };
  }, [procNames]);

  const runSafetyCheck = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setCurrentStep(0);
    playClickSound();

    // Validate
    for (let i = 0; i < numProcs; i++) {
      for (let j = 0; j < numRes; j++) {
        if (allocMat[i][j] > maxMat[i][j]) {
          setError(`⚠️ P${i} (${procNames[i]}): Allocation[${resNames[j]}] > Max! Invalid state.`);
          playErrorSound();
          setLoading(false);
          return;
        }
      }
    }
    for (let j = 0; j < numRes; j++) {
      if (available[j] < 0) {
        setError(`⚠️ ${resNames[j]}: Total allocations exceed total resources! Reduce allocations.`);
        playErrorSound();
        setLoading(false);
        return;
      }
    }

    try {
      let res;
      if (apiAvailable) {
        res = await statelessSafetyCheck(available, allocMat, maxMat);
        // Enhance process names
        if (res.steps) {
          res.steps = res.steps.map((s, i) => ({
            ...s,
            process: `P${s.process?.replace('P', '') || i} — ${procNames[parseInt(s.process?.replace('P', '')) || i] || ''}`,
          }));
        }
        if (res.safeSequence) {
          res.safeSequence = res.safeSequence.map((p) => {
            const idx = parseInt(p.replace('P', ''));
            return `${p} (${procNames[idx] || p})`;
          });
        }
      } else {
        // Run locally
        res = runLocalSafety(available, allocMat, needMat);
      }

      setResult(res);
      if (res.safe || res.status === 'SAFE') {
        playSuccessSound();
      } else {
        playErrorSound();
      }
      setActiveTab('results');
    } catch (e) {
      // Fallback to local
      const res = runLocalSafety(available, allocMat, needMat);
      setResult(res);
      if (res.safe) playSuccessSound(); else playErrorSound();
      setActiveTab('results');
    }

    setLoading(false);
  };

  const handleRequest = async (procIdx, req) => {
    // Run tentative locally
    const tentAvail = [...available];
    const tentAlloc = allocMat.map((r) => [...r]);
    const tentNeed = needMat.map((r) => [...r]);

    // Validate Rule 1
    for (let j = 0; j < numRes; j++) {
      if (req[j] > tentNeed[procIdx][j]) {
        return { granted: false, reason: `Request[${resNames[j]}] (${req[j]}) exceeds Need (${tentNeed[procIdx][j]}). Process is claiming more than its declared max!` };
      }
    }
    // Validate Rule 2
    for (let j = 0; j < numRes; j++) {
      if (req[j] > tentAvail[j]) {
        return { granted: false, reason: `Request[${resNames[j]}] (${req[j]}) exceeds Available (${tentAvail[j]}). Resources unavailable — process must wait!`, deferred: true };
      }
    }

    // Tentative allocation
    for (let j = 0; j < numRes; j++) {
      tentAvail[j] -= req[j];
      tentAlloc[procIdx][j] += req[j];
      tentNeed[procIdx][j] -= req[j];
    }

    const safeResult = runLocalSafety(tentAvail, tentAlloc, tentNeed);

    if (safeResult.safe) {
      // Commit
      setAllocMat(tentAlloc);
      setResult(null);
      return {
        granted: true,
        reason: `✅ Request granted! System remains safe after allocation.`,
        safeResult,
      };
    } else {
      return {
        granted: false,
        reason: `❌ Granting this would cause an UNSAFE state. Request deferred. State rolled back.`,
        safeResult,
      };
    }
  };

  const resetDefault = () => {
    playClickSound();
    setNumProcs(DEFAULT_PROCS);
    setNumRes(DEFAULT_RES);
    setProcNames([...DEFAULT_PNAMES]);
    setResNames([...DEFAULT_RNAMES]);
    setTotalRes([...DEFAULT_TOTAL]);
    setMaxMat(DEFAULT_MAX.map((r) => [...r]));
    setAllocMat(DEFAULT_ALLOC.map((r) => [...r]));
    setResult(null);
    setError(null);
  };

  const isSafe = result?.safe || result?.status === 'SAFE';
  const steps = result?.steps || [];
  const safeSeq = result?.safeSequence || [];
  const displayedSteps = stepMode ? steps.slice(0, currentStep + 1) : steps;

  return (
    <div className={styles.survivalMode}>
      {/* Minecraft crafting table background */}
      <div className={styles.craftingBg} />
      <div className={styles.overlay} />

      <div className={styles.gameUI}>
        {/* ── Top HUD bar ─────────────────────────────── */}
        <div className={styles.hud}>
          <div className={styles.hudLeft}>
            <button className="mc-btn mc-btn-sm" onClick={() => { playClickSound(); onBack(); }}>
              ← Menu
            </button>
          </div>
          <div className={styles.hudTitle}>
            <span className={styles.hudIcon}>💻</span>
            <span>Banker&apos;s Algorithm Simulator</span>
            <span className={styles.hudSub}>OS Resource Allocation Lab</span>
          </div>
          <div className={styles.hudRight}>
            <div className={`${styles.statusBadge} ${isSafe ? styles.statusSafe : result ? styles.statusUnsafe : styles.statusIdle}`}>
              {!result ? '⏸ IDLE' : isSafe ? '✅ SAFE' : '❌ UNSAFE'}
            </div>
          </div>
        </div>

        {/* ── Main layout ──────────────────────────────── */}
        <div className={styles.mainLayout}>
          {/* ── Left sidebar — scenarios & config ────── */}
          <div className={styles.sidebar}>
            {/* Config panel */}
            <div className={styles.panel}>
              <div className={styles.panelTitle}>⚙️ Configuration</div>
              <div className={styles.configRow}>
                <div className={styles.configItem}>
                  <label className="mc-label">Processes</label>
                  <input
                    type="number"
                    min="2"
                    max="8"
                    className={styles.configInput}
                    value={numProcs}
                    onChange={(e) => handleDimChange(parseInt(e.target.value, 10) || 2, numRes)}
                  />
                </div>
                <div className={styles.configItem}>
                  <label className="mc-label">Resources</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    className={styles.configInput}
                    value={numRes}
                    onChange={(e) => handleDimChange(numProcs, parseInt(e.target.value, 10) || 1)}
                  />
                </div>
              </div>

              {/* Total resources */}
              <div className={styles.totalResRow}>
                <div className="mc-label" style={{ marginBottom: 6 }}>Total Resources</div>
                <div className={styles.totalInputs}>
                  {Array.from({ length: numRes }, (_, j) => (
                    <div key={j} className={styles.totalField}>
                      <div className={styles.resNameInput}>
                        <input
                          className={styles.nameInput}
                          value={resNames[j] || `R${j}`}
                          onChange={(e) => {
                            const n = [...resNames];
                            n[j] = e.target.value;
                            setResNames(n);
                          }}
                          maxLength={12}
                        />
                      </div>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        className={styles.totalInput}
                        value={totalRes[j] || 0}
                        onChange={(e) => {
                          const t = [...totalRes];
                          t[j] = Math.max(0, parseInt(e.target.value, 10) || 0);
                          setTotalRes(t);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Available display */}
              <div className={styles.availRow}>
                <span className="mc-label">Available:</span>
                <div className={styles.availChips}>
                  {available.map((v, j) => (
                    <span key={j} className={`${styles.availChip} ${v < 0 ? styles.availNeg : v === 0 ? styles.availZero : styles.availPos}`}>
                      {resNames[j]?.split(' ')[0] || `R${j}`}: <strong>{v}</strong>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Scenarios */}
            {scenarios.length > 0 && (
              <div className={styles.panel}>
                <div className={styles.panelTitle}>📚 Scenarios</div>
                <div className={styles.scenarioList}>
                  {scenarios.map((s) => (
                    <button
                      key={s.id}
                      className={styles.scenarioBtn}
                      onClick={() => loadScenario(s)}
                    >
                      <span className={styles.scenarioName}>{s.name}</span>
                      <span className={styles.scenarioDesc}>{s.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className={styles.actionBtns}>
              <button
                id="btn-safety-check"
                className={`mc-btn mc-btn-green ${styles.fullBtn}`}
                onClick={runSafetyCheck}
                disabled={loading}
              >
                {loading ? '⏳ Computing...' : '🔍 Run Safety Check'}
              </button>
              <button
                className={`mc-btn ${styles.fullBtn}`}
                onClick={resetDefault}
              >
                🔄 Load Default
              </button>
            </div>
          </div>

          {/* ── Center — matrices & tabs ──────────────── */}
          <div className={styles.center}>
            {/* Tab bar */}
            <div className={styles.tabBar}>
              {[
                { id: 'matrices', label: '📊 Matrices' },
                { id: 'request', label: '📡 Request' },
                { id: 'results', label: `${isSafe ? '✅' : result ? '❌' : '📋'} Results` },
              ].map((t) => (
                <button
                  key={t.id}
                  className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ''}`}
                  onClick={() => { playClickSound(); setActiveTab(t.id); }}
                  id={`tab-${t.id}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* ── MATRICES TAB ──────────────────────── */}
            {activeTab === 'matrices' && (
              <div className={styles.tabContent}>
                {error && (
                  <div className={styles.errorBox}>
                    {error}
                  </div>
                )}

                <div className={styles.matricesGrid}>
                  {/* Allocation Matrix */}
                  <div className={styles.matrixPanel}>
                    <div className={styles.matrixHeader} style={{ borderColor: '#4ADCDE' }}>
                      <span className={styles.matrixName} style={{ color: '#4ADCDE' }}>
                        Allocation Matrix
                      </span>
                      <span className={styles.matrixHint}>Current allocations</span>
                    </div>
                    <table className={styles.matTable}>
                      <thead>
                        <tr>
                          <th className={styles.matTh}>Process</th>
                          {resNames.slice(0, numRes).map((r, j) => (
                            <th key={j} className={styles.matTh}>{r.split(' ')[0]}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: numProcs }, (_, i) => (
                          <tr key={i}>
                            <td className={styles.matProcCell}>
                              <input
                                className={styles.procNameInput}
                                value={procNames[i] || `P${i}`}
                                onChange={(e) => {
                                  const n = [...procNames];
                                  n[i] = e.target.value;
                                  setProcNames(n);
                                }}
                                maxLength={14}
                              />
                            </td>
                            {Array.from({ length: numRes }, (_, j) => (
                              <td key={j} className={styles.matTd}>
                                <MatrixCell
                                  value={allocMat[i]?.[j] ?? 0}
                                  onChange={(v) => updateAlloc(i, j, v)}
                                  highlight={allocMat[i]?.[j] > maxMat[i]?.[j]}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Max Matrix */}
                  <div className={styles.matrixPanel}>
                    <div className={styles.matrixHeader} style={{ borderColor: '#FFCC00' }}>
                      <span className={styles.matrixName} style={{ color: '#FFCC00' }}>
                        Max Demand Matrix
                      </span>
                      <span className={styles.matrixHint}>Maximum each process may need</span>
                    </div>
                    <table className={styles.matTable}>
                      <thead>
                        <tr>
                          <th className={styles.matTh}>Process</th>
                          {resNames.slice(0, numRes).map((r, j) => (
                            <th key={j} className={styles.matTh}>{r.split(' ')[0]}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: numProcs }, (_, i) => (
                          <tr key={i}>
                            <td className={styles.matProcCell} style={{ color: '#FFCC00', fontFamily: 'var(--font-pixel)', fontSize: '8px' }}>
                              P{i}
                            </td>
                            {Array.from({ length: numRes }, (_, j) => (
                              <td key={j} className={styles.matTd}>
                                <MatrixCell
                                  value={maxMat[i]?.[j] ?? 0}
                                  onChange={(v) => updateMax(i, j, v)}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Need Matrix (computed, read-only) */}
                  <div className={styles.matrixPanel}>
                    <div className={styles.matrixHeader} style={{ borderColor: '#17DD62' }}>
                      <span className={styles.matrixName} style={{ color: '#17DD62' }}>
                        Need Matrix
                      </span>
                      <span className={styles.matrixHint}>Need = Max − Allocation</span>
                    </div>
                    <table className={styles.matTable}>
                      <thead>
                        <tr>
                          <th className={styles.matTh}>Process</th>
                          {resNames.slice(0, numRes).map((r, j) => (
                            <th key={j} className={styles.matTh}>{r.split(' ')[0]}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: numProcs }, (_, i) => (
                          <tr key={i}>
                            <td className={styles.matProcCell} style={{ color: '#17DD62', fontFamily: 'var(--font-pixel)', fontSize: '8px' }}>
                              P{i}
                            </td>
                            {Array.from({ length: numRes }, (_, j) => (
                              <td
                                key={j}
                                className={`${styles.matTd} ${styles.matTdReadonly}`}
                                style={{ color: needMat[i]?.[j] === 0 ? '#17DD62' : '#DDD' }}
                              >
                                {needMat[i]?.[j] ?? 0}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── REQUEST TAB ───────────────────────── */}
            {activeTab === 'request' && (
              <div className={styles.tabContent}>
                <RequestPanel
                  numProcs={numProcs}
                  numRes={numRes}
                  procNames={procNames}
                  resNames={resNames}
                  onRequest={handleRequest}
                  disabled={loading}
                />
              </div>
            )}

            {/* ── RESULTS TAB ───────────────────────── */}
            {activeTab === 'results' && (
              <div className={styles.tabContent}>
                {!result ? (
                  <div className={styles.noResult}>
                    <div className={styles.noResultIcon}>🔍</div>
                    <div className={styles.noResultText}>
                      Run the Safety Check to see results here.
                    </div>
                    <button
                      className="mc-btn mc-btn-diamond"
                      onClick={runSafetyCheck}
                      disabled={loading}
                    >
                      🔍 Run Safety Check
                    </button>
                  </div>
                ) : (
                  <div className={styles.resultsPanel}>
                    {/* Verdict */}
                    <div className={`${styles.verdict} ${isSafe ? styles.verdictSafe : styles.verdictUnsafe}`}>
                      <div className={styles.verdictIcon}>{isSafe ? '🏆' : '💀'}</div>
                      <div className={styles.verdictTitle}>
                        {isSafe ? 'SYSTEM IS SAFE!' : 'SYSTEM IS UNSAFE!'}
                      </div>
                      <div className={styles.verdictSub}>
                        {isSafe
                          ? `Safe Sequence Found: ${safeSeq.join(' → ')}`
                          : `No safe sequence exists. Deadlock risk! Unfinished: ${result.unfinishedProcesses?.join(', ') || 'unknown'}`
                        }
                      </div>
                    </div>

                    {/* Step controls */}
                    {steps.length > 0 && (
                      <div className={styles.stepControls}>
                        <label className={styles.stepToggle}>
                          <input
                            type="checkbox"
                            checked={stepMode}
                            onChange={(e) => {
                              setStepMode(e.target.checked);
                              setCurrentStep(0);
                            }}
                          />
                          <span>Step-by-step mode</span>
                        </label>
                        {stepMode && (
                          <div className={styles.stepNav}>
                            <button
                              className="mc-btn mc-btn-sm"
                              onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                              disabled={currentStep === 0}
                            >
                              ← Prev
                            </button>
                            <span className={styles.stepCounter}>
                              {currentStep + 1} / {steps.length}
                            </span>
                            <button
                              className="mc-btn mc-btn-sm"
                              onClick={() => setCurrentStep((s) => Math.min(steps.length - 1, s + 1))}
                              disabled={currentStep >= steps.length - 1}
                            >
                              Next →
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Steps */}
                    <div className={styles.stepsList}>
                      {displayedSteps.map((step, i) => (
                        <StepCard key={i} step={step} index={i} />
                      ))}
                    </div>

                    {/* Safe sequence visual */}
                    {isSafe && safeSeq.length > 0 && (
                      <div className={styles.seqVisual}>
                        <div className="mc-label" style={{ marginBottom: 8 }}>✅ Safe Sequence</div>
                        <div className={styles.seqChips}>
                          {safeSeq.map((p, i) => (
                            <div key={i} className={styles.seqItem}>
                              <div className={styles.seqChip}>{p}</div>
                              {i < safeSeq.length - 1 && <div className={styles.seqArrow}>→</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Important distinction */}
                    {!isSafe && (
                      <div className={styles.detectionNote}>
                        ⚠️ <strong>Important:</strong> An UNSAFE state is not necessarily a deadlock.
                        It means no guaranteed safe sequence exists. Deadlock detection is a separate check!
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
