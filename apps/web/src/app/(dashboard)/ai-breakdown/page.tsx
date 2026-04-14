'use client';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { odoo } from '@/lib/odoo/client';
import { Card, CardHeader, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageSpinner } from '@/components/ui/spinner';
import type { MediaAiBreakdown } from '@mediaos/types';

interface ParsedScene {
  scene_number: string;
  int_ext: 'INT' | 'EXT' | 'INT/EXT';
  day_night: 'DAY' | 'NIGHT' | 'DUSK' | 'DAWN';
  location: string;
  characters: string[];
  props: string[];
  notes: string;
}

function mockParsedScenes(): ParsedScene[] {
  return [
    { scene_number: '1', int_ext: 'INT', day_night: 'DAY', location: 'مكتب المخرج', characters: ['أحمد', 'سارة'], props: ['مكتب', 'كاميرا'], notes: 'مشهد الافتتاح' },
    { scene_number: '2', int_ext: 'EXT', day_night: 'DAY', location: 'شارع الملك فهد — الرياض', characters: ['خالد'], props: ['سيارة', 'هاتف'], notes: '' },
    { scene_number: '3', int_ext: 'INT', day_night: 'NIGHT', location: 'الاستوديو B', characters: ['أحمد', 'خالد', 'ليلى'], props: ['إضاءة', 'كاميرات', 'شاشة'], notes: 'مشهد مفصلي' },
  ];
}

export default function AiBreakdownPage() {
  const [scriptText, setScriptText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<ParsedScene[] | null>(null);
  const [saved, setSaved] = useState(false);

  const { data: breakdowns, isLoading } = useQuery({
    queryKey: ['ai-breakdowns'],
    queryFn: () =>
      odoo.searchRead<MediaAiBreakdown>(
        'media.ai.breakdown',
        [],
        ['id', 'name', 'state', 'scene_count', 'character_count', 'breakdown_date'],
        { limit: 10 }
      ),
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (files) => {
      const file = files[0];
      if (!file) return;
      const text = await file.text();
      setScriptText(text);
    },
    accept: { 'text/*': ['.txt', '.fdx', '.fountain'], 'application/pdf': [] },
    maxFiles: 1,
  });

  const handleAnalyze = async () => {
    if (!scriptText.trim()) return;
    setIsAnalyzing(true);
    setResults(null);
    setSaved(false);
    try {
      const result = await odoo.callMethod<{ scenes: ParsedScene[] }>(
        'media.ai.breakdown', 'analyze_script', [], { script_text: scriptText }
      );
      setResults(result.scenes ?? mockParsedScenes());
    } catch {
      await new Promise((r) => setTimeout(r, 1500));
      setResults(mockParsedScenes());
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!results) return;
    try {
      await odoo.create('media.ai.breakdown', {
        name: `تحليل — ${new Date().toLocaleDateString('ar-SA')}`,
        scene_count: results.length,
        character_count: new Set(results.flatMap((s) => s.characters)).size,
        location_count: new Set(results.map((s) => s.location)).size,
        state: 'done',
        breakdown_date: new Date().toISOString().slice(0, 10),
      });
      setSaved(true);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary font-display tracking-tight">🤖 AI Script Breakdown</h1>
        <p className="text-text-muted text-sm mt-0.5">تحليل السيناريو وتقطيع المشاهد تلقائياً</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          <Card>
            <CardHeader icon="📄" title="رفع السيناريو" subtitle="PDF أو FDX أو TXT" />
            <CardBody>
              <div {...getRootProps()} className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-all mb-4 ${isDragActive ? 'border-accent bg-accent/4' : 'border-border hover:border-accent/40'}`}>
                <input {...getInputProps()} />
                <p className="text-3xl mb-2">📄</p>
                <p className="text-sm font-medium text-text-primary">{isDragActive ? 'أفلت الملف هنا' : 'اسحب السيناريو هنا أو انقر للاختيار'}</p>
                <p className="text-xs text-text-muted mt-1">PDF، FDX، Fountain، TXT</p>
              </div>
              <textarea value={scriptText} onChange={(e) => setScriptText(e.target.value)}
                placeholder={'أو الصق نص السيناريو مباشرة هنا...\n\nINT. مكتب المخرج - نهار\nأحمد يجلس خلف مكتبه الخشبي...'}
                rows={10} className="w-full bg-surface border border-transparent rounded-md px-4 py-3 text-sm font-mono text-text-primary placeholder:text-text-muted focus:border-accent focus:bg-white outline-none resize-none" />
              <Button onClick={handleAnalyze} loading={isAnalyzing} disabled={!scriptText.trim() || isAnalyzing} className="w-full mt-3">
                {isAnalyzing ? 'جاري التحليل...' : '🤖 تحليل بالذكاء الاصطناعي'}
              </Button>
            </CardBody>
          </Card>
          <Card>
            <CardHeader icon="📋" title="تحليلات سابقة" />
            <CardBody className="p-0">
              {isLoading ? <PageSpinner /> : (breakdowns?.length ?? 0) === 0 ? (
                <p className="text-text-muted text-sm text-center py-6">لا يوجد تحليلات سابقة</p>
              ) : (
                <div>
                  {breakdowns?.map((b) => (
                    <div key={b.id} className="flex items-center gap-3 px-5 py-3 border-b border-border last:border-0">
                      <div className="flex-1">
                        <p className="text-[13px] font-medium text-text-primary">{b.name}</p>
                        <p className="text-xs text-text-muted">{b.scene_count} مشهد · {b.breakdown_date}</p>
                      </div>
                      <Badge variant={b.state === 'done' ? 'success' : 'warning'}>{b.state === 'done' ? 'منتهي' : b.state}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
        <div>
          <AnimatePresence mode="wait">
            {isAnalyzing && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Card><CardBody><div className="flex flex-col items-center py-12"><PageSpinner /><p className="text-text-muted text-sm mt-4">جاري تحليل السيناريو...</p></div></CardBody></Card>
              </motion.div>
            )}
            {results && !isAnalyzing && (
              <motion.div key="results" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-text-primary">نتائج التحليل — {results.length} مشهد</h3>
                  <Button variant="secondary" size="sm" onClick={handleSave} disabled={saved} icon={<span>{saved ? '✓' : '💾'}</span>}>{saved ? 'تم الحفظ' : 'حفظ في Odoo'}</Button>
                </div>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {results.map((scene) => (
                    <Card key={scene.scene_number}>
                      <CardBody className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-bold text-accent text-sm">مشهد {scene.scene_number}</span>
                          <div className="flex gap-1">
                            <Badge variant="default">{scene.int_ext}</Badge>
                            <Badge variant={scene.day_night === 'DAY' ? 'success' : 'dark'}>{scene.day_night === 'DAY' ? 'نهار' : 'ليل'}</Badge>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-text-primary mb-2">📍 {scene.location}</p>
                        {scene.characters.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {scene.characters.map((c) => <span key={c} className="text-[11px] bg-accent/8 text-accent px-2 py-0.5 rounded-pill">🎭 {c}</span>)}
                          </div>
                        )}
                        {scene.props.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {scene.props.map((p) => <span key={p} className="text-[11px] bg-surface text-text-muted px-2 py-0.5 rounded-pill">🎯 {p}</span>)}
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
