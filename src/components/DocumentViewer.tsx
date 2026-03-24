'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Archive, FileText, ArrowRight, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { type DocumentExample } from '@/data/processing-proof';
import { fmtBytes } from '@/lib/format';
import ConfidenceBadge from '@/components/ConfidenceBadge';

interface DocumentViewerProps {
  example: DocumentExample;
}

function FileIcon({ format }: { format: string }) {
  const cls = 'w-8 h-8';
  const color = '#3B7BF5';
  if (format === '.p7m') return <Shield className={cls} style={{ color }} />;
  if (format === '.zip' || format === '.zip/.rar') return <Archive className={cls} style={{ color }} />;
  return <FileText className={cls} style={{ color }} />;
}

function FlowArrow({ active }: { active: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center px-2 md:px-4 py-4 md:py-0 shrink-0">
      <div className="relative flex items-center justify-center">
        {/* Track */}
        <div
          className="w-12 md:w-16 h-px md:h-px relative overflow-hidden"
          style={{ backgroundColor: '#252A35' }}
        >
          {/* Flowing dots */}
          {active && (
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: '100%' }}
            >
              {[0, 0.3, 0.6].map((delay, i) => (
                <span
                  key={i}
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-px rounded-full"
                  style={{
                    backgroundColor: '#3B7BF5',
                    animation: `flow-dots 1.2s linear ${delay}s infinite`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
        <ArrowRight
          size={14}
          className="absolute right-0 translate-x-2"
          style={{ color: active ? '#3B7BF5' : '#252A35' }}
        />
      </div>
    </div>
  );
}

function renderAiBrief(text: string): React.ReactNode {
  const lines = text.split('\n').filter(Boolean);
  return lines.map((line, i) => {
    const boldMatch = /^\*\*(.+?)\*\*(.*)/.exec(line);
    if (boldMatch) {
      return (
        <p key={i} className="text-sm mb-2" style={{ color: '#E8ECF4' }}>
          <span className="font-semibold" style={{ color: '#60A5FA' }}>
            {boldMatch[1]}
          </span>
          <span style={{ color: '#7A8499' }}>{boldMatch[2]}</span>
        </p>
      );
    }
    return (
      <p key={i} className="text-sm mb-2" style={{ color: '#7A8499' }}>
        {line}
      </p>
    );
  });
}

type ProcessingState = 'idle' | 'panel1' | 'panel2' | 'panel3' | 'done';

export default function DocumentViewer({ example }: DocumentViewerProps) {
  const [state, setState] = useState<ProcessingState>('idle');

  const isProcessing = state !== 'idle' && state !== 'done';
  const showPanel2 = state === 'panel2' || state === 'panel3' || state === 'done';
  const showPanel3 = state === 'panel3' || state === 'done';
  const arrow1Active = state === 'panel1' || showPanel2;
  const arrow2Active = state === 'panel2' || showPanel3;

  function handleProcess() {
    if (state !== 'idle' && state !== 'done') return;
    setState('panel1');
    setTimeout(() => setState('panel2'), 900);
    setTimeout(() => setState('panel3'), 2000);
    setTimeout(() => setState('done'), 3100);
  }

  const isGo = example.aiBrief.toLowerCase().includes('go') && !example.aiBrief.toLowerCase().includes('no-go');

  return (
    <div className="space-y-6">
      {/* Three panels */}
      <div className="flex flex-col md:flex-row gap-0 md:gap-0 items-stretch">

        {/* Panel 1 — Raw Input */}
        <div
          className="flex-1 rounded-xl border p-5 transition-all duration-500"
          style={{
            backgroundColor: '#13161C',
            borderColor: state === 'panel1' ? '#3B7BF5' : '#252A35',
            boxShadow: state === 'panel1' ? '0 0 20px 2px rgba(59,123,245,0.12)' : 'none',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{ backgroundColor: '#252A35', color: '#7A8499' }}
            >
              1
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#4A5268' }}>
              Raw Input
            </span>
          </div>

          <div className="flex flex-col items-center text-center py-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: '#3B7BF520' }}
            >
              <FileIcon format={example.format} />
            </div>
            <p className="text-sm font-medium mb-1 font-mono" style={{ color: '#E8ECF4' }}>
              {example.fileName}
            </p>
            <p className="text-xs mb-3" style={{ color: '#7A8499' }}>
              {fmtBytes(example.fileSize)}
            </p>
            <span
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold font-mono border"
              style={{ color: '#60A5FA', backgroundColor: '#60A5FA15', borderColor: '#60A5FA30' }}
            >
              {example.format}
            </span>
          </div>

          <p className="text-xs mt-3" style={{ color: '#7A8499', lineHeight: '1.6' }}>
            {example.formatDescription}
          </p>
        </div>

        {/* Arrow 1 */}
        <FlowArrow active={arrow1Active} />

        {/* Panel 2 — Extracted Content */}
        <div
          className="flex-1 rounded-xl border p-5 transition-all duration-500"
          style={{
            backgroundColor: '#13161C',
            borderColor: showPanel2 ? '#F59E0B' : '#252A35',
            boxShadow: showPanel2 ? '0 0 16px 2px rgba(245,158,11,0.08)' : 'none',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{ backgroundColor: '#252A35', color: '#7A8499' }}
              >
                2
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#4A5268' }}>
                Extracted Text
              </span>
            </div>
            {showPanel2 && <ConfidenceBadge confidence={example.confidence} />}
          </div>

          <AnimatePresence>
            {showPanel2 ? (
              <motion.div
                key="panel2-content"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                {/* Extracted text block */}
                <div
                  className="rounded-lg p-3 mb-4 overflow-auto max-h-32"
                  style={{ backgroundColor: '#0C0E12', border: '1px solid #252A35' }}
                >
                  <pre
                    className="text-xs whitespace-pre-wrap font-mono"
                    style={{ color: '#22C55E', lineHeight: '1.7' }}
                  >
                    {example.extractedText}
                  </pre>
                </div>

                {/* Extraction steps */}
                <ul className="space-y-1.5">
                  {example.extractionSteps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ChevronRight size={12} className="mt-0.5 shrink-0" style={{ color: '#F59E0B' }} />
                      <span className="text-xs" style={{ color: '#7A8499' }}>{step}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ) : (
              <motion.div
                key="panel2-empty"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-8"
              >
                <div className="space-y-2 w-full">
                  {[40, 70, 55, 35].map((w, i) => (
                    <div
                      key={i}
                      className="h-2 rounded skeleton"
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>
                <p className="text-xs mt-4" style={{ color: '#4A5268' }}>
                  Awaiting processing...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Arrow 2 */}
        <FlowArrow active={arrow2Active} />

        {/* Panel 3 — AI Analysis */}
        <div
          className="flex-1 rounded-xl border p-5 transition-all duration-500"
          style={{
            backgroundColor: '#13161C',
            borderColor: showPanel3 ? '#A855F7' : '#252A35',
            boxShadow: showPanel3 ? '0 0 16px 2px rgba(168,85,247,0.08)' : 'none',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{ backgroundColor: '#252A35', color: '#7A8499' }}
              >
                3
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#4A5268' }}>
                AI Analysis
              </span>
            </div>
            {showPanel3 && (
              isGo ? (
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border"
                  style={{ color: '#22C55E', backgroundColor: '#22C55E15', borderColor: '#22C55E30' }}
                >
                  <CheckCircle size={12} />
                  GO
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border"
                  style={{ color: '#EF4444', backgroundColor: '#EF444415', borderColor: '#EF444430' }}
                >
                  <XCircle size={12} />
                  NO-GO
                </span>
              )
            )}
          </div>

          <AnimatePresence>
            {showPanel3 ? (
              <motion.div
                key="panel3-content"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="overflow-auto max-h-52"
              >
                {renderAiBrief(example.aiBrief)}
              </motion.div>
            ) : (
              <motion.div
                key="panel3-empty"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-8"
              >
                <div className="space-y-2 w-full">
                  {[60, 45, 80, 35, 50].map((w, i) => (
                    <div
                      key={i}
                      className="h-2 rounded skeleton"
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>
                <p className="text-xs mt-4" style={{ color: '#4A5268' }}>
                  Awaiting AI analysis...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Process button */}
      <div className="flex justify-center">
        <button
          onClick={handleProcess}
          disabled={isProcessing}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
          style={{
            backgroundColor: isProcessing ? '#1A1E27' : '#3B7BF5',
            color: isProcessing ? '#4A5268' : '#FFFFFF',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            boxShadow: isProcessing ? 'none' : '0 0 0 0 rgba(59,123,245,0.4)',
          }}
          onMouseEnter={(e) => {
            if (!isProcessing) {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px 4px rgba(59,123,245,0.2)';
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
          }}
        >
          {isProcessing ? (
            <>
              <span
                className="w-3 h-3 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: '#4A5268', borderTopColor: 'transparent' }}
              />
              Processing...
            </>
          ) : (
            <>
              <Shield size={15} />
              {state === 'done' ? 'Process Again' : 'Process Document'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
