'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { type ProcessingStep, categoryColors } from '@/data/processing-proof';
import { fmtDuration } from '@/lib/format';

interface ProcessingTimelineProps {
  steps: ProcessingStep[];
  autoPlay?: boolean;
}

export default function ProcessingTimeline({ steps, autoPlay = false }: ProcessingTimelineProps) {
  const [visibleCount, setVisibleCount] = useState(autoPlay ? 0 : steps.length);

  useEffect(() => {
    if (!autoPlay) return;

    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setVisibleCount(index);
      if (index >= steps.length) clearInterval(interval);
    }, 120);

    return () => clearInterval(interval);
  }, [autoPlay, steps.length]);

  return (
    <div className="relative">
      {/* Vertical line */}
      <div
        className="absolute left-[7px] top-2 bottom-2 w-px"
        style={{ backgroundColor: '#252A35' }}
      />

      <div className="space-y-0">
        {steps.map((step, i) => {
          const visible = i < visibleCount;
          const color = categoryColors[step.category];

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative flex gap-4 pb-5"
            >
              {/* Timeline dot */}
              <div className="relative z-10 flex-shrink-0 mt-0.5">
                {step.category === 'complete' ? (
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: color }}
                  >
                    <Check size={9} color="#0C0E12" strokeWidth={3} />
                  </div>
                ) : (
                  <div
                    className="w-4 h-4 rounded-full border-2 transition-colors duration-300"
                    style={
                      visible
                        ? { backgroundColor: color, borderColor: color }
                        : { backgroundColor: '#13161C', borderColor: '#252A35' }
                    }
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Timestamp */}
                    <span
                      className="log-line text-xs shrink-0"
                      style={{ color: '#4A5268' }}
                    >
                      {step.timestamp}
                    </span>
                    {/* Category badge */}
                    <span
                      className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold font-mono uppercase tracking-wider"
                      style={{
                        color,
                        backgroundColor: `${color}18`,
                      }}
                    >
                      {step.category}
                    </span>
                  </div>
                  {/* Duration */}
                  {step.durationMs > 0 && (
                    <span
                      className="text-xs font-mono shrink-0"
                      style={{ color: '#4A5268' }}
                    >
                      {fmtDuration(step.durationMs)}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p
                  className="text-sm mt-0.5 font-medium"
                  style={{ color: '#E8ECF4' }}
                >
                  {step.description}
                </p>

                {/* Detail */}
                {step.detail && (
                  <p
                    className="log-line text-[12px] mt-1"
                    style={{ color: '#7A8499' }}
                  >
                    {step.detail}
                  </p>
                )}

                {/* Bytes */}
                {step.bytesProcessed !== undefined && (
                  <p
                    className="text-[11px] mt-0.5 font-mono"
                    style={{ color: '#4A5268' }}
                  >
                    {step.bytesProcessed.toLocaleString()} bytes processed
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
