'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useUiStore } from '@/store/ui.store';
import { clsx } from 'clsx';

const icons = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

const styles = {
  success: 'bg-dark text-white',
  error: 'bg-danger text-white',
  warning: 'bg-warning text-white',
  info: 'bg-info text-white',
};

export function Toaster() {
  const toasts = useUiStore((s) => s.toasts);
  const removeToast = useUiStore((s) => s.removeToast);

  return (
    <div className="fixed bottom-6 left-6 z-[300] flex flex-col gap-2 min-w-[280px]">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={clsx(
              'flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer',
              styles[toast.type]
            )}
            onClick={() => removeToast(toast.id)}
          >
            <span className="font-bold">{icons[toast.type]}</span>
            <span className="text-sm font-medium">{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
