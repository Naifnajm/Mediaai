'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useConnectionStore } from '@/store/connection.store';
import { resetOdooClient } from '@/lib/odoo/client';

export default function ConnectPage() {
  const router = useRouter();
  const { setConnection } = useConnectionStore();

  const [serverUrl, setServerUrl] = useState('https://albait.jtcgov.com/odoo');
  const [databases, setDatabases] = useState<string[]>([]);
  const [selectedDb, setSelectedDb] = useState('');
  const [manualDb, setManualDb] = useState('MediaAi');
  const [detecting, setDetecting] = useState(false);
  const [detectError, setDetectError] = useState<string | null>(null);
  const [detected, setDetected] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDetect = async () => {
    setDetecting(true);
    setDetectError(null);
    setDetected(false);
    setDatabases([]);
    setSelectedDb('');
    setManualMode(false);

    try {
      const res = await fetch('/api/detect-dbs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serverUrl }),
      });
      const data = (await res.json()) as { databases?: string[]; error?: string };
      if (!res.ok || data.error) {
        // Auto-detect failed → switch to manual mode
        setDetectError('تعذّر اكتشاف قواعد البيانات تلقائياً. أدخل اسمها يدوياً:');
        setManualMode(true);
        return;
      }
      const dbs = data.databases ?? [];
      setDatabases(dbs);
      setDetected(true);
      if (dbs.length === 1) setSelectedDb(dbs[0]!);
      const mediaAi = dbs.find((d) => d.toLowerCase() === 'mediaai');
      if (mediaAi) setSelectedDb(mediaAi);
    } catch {
      setDetectError('تعذّر الاتصال. أدخل اسم قاعدة البيانات يدوياً:');
      setManualMode(true);
    } finally {
      setDetecting(false);
    }
  };

  const handleConnect = () => {
    const db = manualMode ? manualDb.trim() : selectedDb;
    if (!serverUrl || !db) return;
    resetOdooClient();
    setConnection(serverUrl.replace(/\/$/, ''), db);
    router.push('/login');
  };

  const effectiveDb = manualMode ? manualDb.trim() : selectedDb;
  const canConnect = !!effectiveDb && !detecting;

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.07] bg-accent blur-[80px]" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full opacity-[0.05] bg-accent blur-[60px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white rounded-2xl p-10" dir="rtl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-dark rounded-xl mb-4">
              <span className="text-white text-2xl font-bold font-display">M</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary font-display">إعداد الاتصال</h1>
            <p className="text-text-muted text-sm mt-1">أدخل رابط خادم Odoo الخاص بك</p>
          </div>

          <div className="space-y-4">
            {/* Server URL */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wide">
                رابط الخادم
              </label>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="url"
                  value={serverUrl}
                  onChange={(e) => {
                    setServerUrl(e.target.value);
                    setDetected(false);
                    setDatabases([]);
                    setSelectedDb('');
                    setDetectError(null);
                    setManualMode(false);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleDetect()}
                  placeholder="https://your-odoo.com/odoo"
                  dir="ltr"
                  className="flex-1 bg-surface border border-transparent rounded-md px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-accent focus:bg-white outline-none text-[14px] font-mono"
                />
                <button
                  onClick={handleDetect}
                  disabled={detecting || !serverUrl.trim()}
                  className="shrink-0 bg-dark text-white rounded-pill px-4 py-3 text-sm font-semibold hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {detecting ? (
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      جاري…
                    </span>
                  ) : 'كشف'}
                </button>
              </div>
              <p className="text-text-muted text-[11px] mt-1.5 text-right">
                مثال: https://albait.jtcgov.com/odoo
              </p>
            </div>

            {/* Error + manual fallback */}
            <AnimatePresence>
              {detectError && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-[rgba(236,126,0,0.08)] border border-[rgba(236,126,0,0.2)] rounded-xl p-3"
                >
                  <p className="text-warning text-sm">{detectError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Manual DB input */}
            <AnimatePresence>
              {manualMode && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <label className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wide">
                    اسم قاعدة البيانات
                  </label>
                  <input
                    type="text"
                    value={manualDb}
                    onChange={(e) => setManualDb(e.target.value)}
                    placeholder="MediaAi"
                    dir="ltr"
                    className="w-full bg-surface border border-transparent rounded-md px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-accent focus:bg-white outline-none text-[15px] font-mono"
                    autoFocus
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Auto-detected DB list */}
            <AnimatePresence>
              {detected && databases.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <label className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wide">
                    قاعدة البيانات
                  </label>
                  <div className="grid gap-2">
                    {databases.map((db) => (
                      <button
                        key={db}
                        onClick={() => setSelectedDb(db)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                          selectedDb === db
                            ? 'border-accent bg-[rgba(73,79,223,0.06)] text-accent'
                            : 'border-transparent bg-surface text-text-primary hover:border-text-muted/30'
                        }`}
                      >
                        <span dir="ltr" className="font-mono">{db}</span>
                        {selectedDb === db && (
                          <svg className="w-4 h-4 text-accent shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Connect button */}
            <button
              onClick={handleConnect}
              disabled={!canConnect}
              className="w-full bg-accent text-white rounded-pill py-3.5 text-[15px] font-semibold hover:opacity-85 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
            >
              {effectiveDb ? `اتصال بـ ${effectiveDb}` : 'اكتشف قاعدة البيانات أولاً'}
            </button>
          </div>

          <p className="text-center text-text-muted text-xs mt-8">
            MediaOS v1.0 · Odoo 19 Community
          </p>
        </div>
      </motion.div>
    </div>
  );
}
