import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, TrendingDown, Zap, AlertTriangle, RotateCcw, Eye } from 'lucide-react';

const CHAR_SPEED = 10; // ms per character
const SECTION_PAUSE = 400; // ms between sections
const BULLET_PAUSE = 150; // ms between bullets

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const SECTION_ICONS = {
  'BOTTOM LINE': <Shield size={12} />,
  'WHAT CHANGED': <TrendingUp size={12} />,
  'WHAT CONFIRMS': <TrendingUp size={12} />,
  'WHAT INVALIDATES': <TrendingDown size={12} />,
  'BEST EXPRESSIONS': <Zap size={12} />,
  'WATCHPOINTS': <AlertTriangle size={12} />,
  'ACTION BIAS': <Eye size={12} />,
};

/* Convert COMPRESSION_DATA entry to streamable sections */
export function compressionToSections(data) {
  if (!data) return [];
  const sections = [];

  if (data.bottomLine) {
    sections.push({ label: 'BOTTOM LINE', body: data.bottomLine });
  }
  if (data.whatChanged?.length) {
    sections.push({ label: 'WHAT CHANGED', bullets: data.whatChanged });
  }
  if (data.confirms?.length) {
    sections.push({ label: 'WHAT CONFIRMS', bullets: data.confirms });
  }
  if (data.invalidates?.length) {
    sections.push({ label: 'WHAT INVALIDATES', bullets: data.invalidates });
  }
  if (data.bestExpressions?.length) {
    sections.push({
      label: 'BEST EXPRESSIONS',
      bullets: data.bestExpressions.map(
        (e) => `${e.name} — ${e.conviction}`
      ),
    });
  }
  if (data.watchpoints?.length) {
    sections.push({ label: 'WATCHPOINTS', bullets: data.watchpoints });
  }
  if (data.actionBias) {
    sections.push({
      label: 'ACTION BIAS',
      body: data.actionBias,
      emphasis: true,
    });
  }
  return sections;
}

export default function StreamingCompressionRead({
  sections = [],
  title = 'COMPRESSION READ',
  subtitle,
  convictionScore,
  reducedMotion = false,
  onStreamComplete,
}) {
  const [streamState, setStreamState] = useState('idle'); // idle | streaming | done
  const [revealedSections, setRevealedSections] = useState([]);
  const [currentText, setCurrentText] = useState('');
  const [activeSectionIdx, setActiveSectionIdx] = useState(-1);
  const [activeBulletIdx, setActiveBulletIdx] = useState(-1);
  const cancelRef = useRef(false);
  const containerRef = useRef(null);

  const reset = useCallback(() => {
    cancelRef.current = true;
    setStreamState('idle');
    setRevealedSections([]);
    setCurrentText('');
    setActiveSectionIdx(-1);
    setActiveBulletIdx(-1);
  }, []);

  /* Auto-start when sections change */
  useEffect(() => {
    if (sections.length > 0) {
      reset();
      // Small delay to let reset settle
      const t = setTimeout(() => startStream(), 50);
      return () => clearTimeout(t);
    }
  }, [sections]); // eslint-disable-line react-hooks/exhaustive-deps

  async function typeText(text, speed = CHAR_SPEED) {
    if (reducedMotion) {
      setCurrentText(text);
      return;
    }
    setCurrentText('');
    for (let i = 0; i < text.length; i++) {
      if (cancelRef.current) return;
      setCurrentText(text.slice(0, i + 1));
      await sleep(speed);
    }
  }

  async function startStream() {
    cancelRef.current = false;
    setStreamState('streaming');
    setRevealedSections([]);
    setActiveSectionIdx(-1);
    setActiveBulletIdx(-1);

    for (let si = 0; si < sections.length; si++) {
      if (cancelRef.current) return;
      const section = sections[si];
      setActiveSectionIdx(si);

      if (section.body) {
        await typeText(section.body);
        if (cancelRef.current) return;
        // Commit completed section
        setRevealedSections((prev) => [
          ...prev,
          { ...section, streamedBody: section.body },
        ]);
        setCurrentText('');
        await sleep(SECTION_PAUSE);
      } else if (section.bullets) {
        const completed = [];
        for (let bi = 0; bi < section.bullets.length; bi++) {
          if (cancelRef.current) return;
          setActiveBulletIdx(bi);
          await typeText(section.bullets[bi]);
          if (cancelRef.current) return;
          completed.push(section.bullets[bi]);
          setCurrentText('');
          // Update revealed with partial bullets
          setRevealedSections((prev) => {
            const next = prev.filter((s) => s.label !== section.label);
            return [...next, { ...section, streamedBullets: [...completed] }];
          });
          await sleep(BULLET_PAUSE);
        }
        await sleep(SECTION_PAUSE);
      }

      setActiveBulletIdx(-1);
    }

    if (!cancelRef.current) {
      setStreamState('done');
      setActiveSectionIdx(-1);
      onStreamComplete?.();
    }
  }

  function handleReplay() {
    reset();
    setTimeout(() => startStream(), 80);
  }

  const isStreaming = streamState === 'streaming';
  const isDone = streamState === 'done';

  return (
    <div className="stream-read-container" ref={containerRef}>
      {/* Header */}
      <div className="stream-read-header">
        <div className="stream-read-header-left">
          <Shield size={14} className="stream-read-header-icon" />
          <span className="stream-read-title">{title}</span>
          {subtitle && (
            <span className="stream-read-subtitle">{subtitle}</span>
          )}
        </div>
        <div className="stream-read-header-right">
          {convictionScore != null && (
            <div className="stream-read-conviction">
              <span className="stream-read-conviction-label">CONVICTION</span>
              <span className="stream-read-conviction-value">
                {convictionScore}
              </span>
            </div>
          )}
          {isDone && (
            <button className="stream-replay-btn" onClick={handleReplay}>
              <RotateCcw size={12} />
              <span>Replay</span>
            </button>
          )}
        </div>
      </div>

      {/* Streaming body */}
      <div className="stream-read-body">
        {/* Already-revealed sections */}
        {revealedSections.map((section, i) => {
          const isCurrent =
            activeSectionIdx === sections.findIndex((s) => s.label === section.label);
          if (isCurrent && isStreaming) return null; // Active section rendered separately
          return (
            <div key={section.label + i} className="stream-section revealed">
              <div className="stream-section-label">
                {SECTION_ICONS[section.label]}
                <span>{section.label}</span>
              </div>
              {section.streamedBody && (
                <div
                  className={`stream-section-body ${section.emphasis ? 'stream-emphasis' : ''}`}
                >
                  {section.streamedBody}
                </div>
              )}
              {section.streamedBullets?.map((b, bi) => (
                <div key={bi} className="stream-bullet revealed">
                  <span className="stream-bullet-marker" />
                  {b}
                </div>
              ))}
            </div>
          );
        })}

        {/* Currently streaming section */}
        {isStreaming && activeSectionIdx >= 0 && (
          <div className="stream-section active">
            <div className="stream-section-label">
              {SECTION_ICONS[sections[activeSectionIdx].label]}
              <span>{sections[activeSectionIdx].label}</span>
            </div>

            {/* Already streamed bullets for current section */}
            {sections[activeSectionIdx].bullets &&
              revealedSections
                .find((s) => s.label === sections[activeSectionIdx].label)
                ?.streamedBullets?.map((b, bi) => (
                  <div key={bi} className="stream-bullet revealed">
                    <span className="stream-bullet-marker" />
                    {b}
                  </div>
                ))}

            {/* Active streaming text */}
            {currentText && (
              <div
                className={`stream-active-text ${
                  sections[activeSectionIdx].emphasis ? 'stream-emphasis' : ''
                } ${sections[activeSectionIdx].bullets ? 'stream-bullet' : 'stream-section-body'}`}
              >
                {sections[activeSectionIdx].bullets && (
                  <span className="stream-bullet-marker" />
                )}
                {currentText}
                <span className="stream-cursor">&#x258B;</span>
              </div>
            )}
          </div>
        )}

        {/* Idle / waiting state */}
        {streamState === 'idle' && sections.length === 0 && (
          <div className="stream-idle">Awaiting compression data...</div>
        )}
      </div>

      {/* Status bar */}
      <div className="stream-read-status">
        <div
          className={`stream-status-dot ${isStreaming ? 'streaming' : isDone ? 'done' : ''}`}
        />
        <span className="stream-status-text">
          {isStreaming
            ? 'Streaming compression read...'
            : isDone
              ? 'Compression complete'
              : 'Ready'}
        </span>
      </div>
    </div>
  );
}
