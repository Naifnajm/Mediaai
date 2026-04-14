'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { getOdooClient } from '@/lib/odoo/client';
import { useAuthStore } from '@/store/auth.store';
import { useConnectionStore } from '@/store/connection.store';

const schema = z.object({
  username: z.string().min(1, 'اسم المستخدم مطلوب'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const { serverUrl, db } = useConnectionStore();
  const [serverError, setServerError] = useState<string | null>(null);

  // Guard: redirect to connect if no server configured
  useEffect(() => {
    if (!serverUrl || !db) {
      router.replace('/connect');
    }
  }, [serverUrl, db, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      const session = await getOdooClient().authenticate(data.username, data.password);
      setSession(session);
      router.push('/dashboard');
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'خطأ في تسجيل الدخول');
    }
  };

  if (!serverUrl || !db) return null;

  // Display a shortened host for the server badge
  const displayHost = (() => {
    try {
      return new URL(serverUrl).hostname;
    } catch {
      return serverUrl;
    }
  })();

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_20%_50%,#494fdf_0%,transparent_50%),radial-gradient(circle_at_80%_20%,#494fdf_0%,transparent_50%)]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-2xl p-10">
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-dark rounded-xl mb-4">
              <span className="text-white text-2xl font-bold font-display">M</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight font-display">MediaOS</h1>
            <p className="text-text-muted text-sm mt-1">نظام إدارة الإنتاج الإعلامي</p>
          </div>

          {/* Server badge */}
          <div className="flex items-center justify-between bg-surface rounded-xl px-4 py-2.5 mb-6" dir="rtl">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2 h-2 rounded-full bg-success shrink-0" />
              <span className="text-xs text-text-secondary truncate" dir="ltr">
                {displayHost} · {db}
              </span>
            </div>
            <button
              onClick={() => router.push('/connect')}
              className="text-xs text-accent font-medium hover:opacity-75 shrink-0 mr-2"
            >
              تغيير
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" dir="rtl">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wide">
                اسم المستخدم
              </label>
              <input
                {...register('username')}
                type="text"
                autoComplete="username"
                placeholder="admin"
                className="w-full bg-surface border border-transparent rounded-md px-4 py-3.5 text-text-primary placeholder:text-text-muted focus:border-accent focus:bg-white outline-none text-[15px]"
              />
              {errors.username && (
                <p className="text-danger text-xs mt-1.5">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wide">
                كلمة المرور
              </label>
              <input
                {...register('password')}
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-surface border border-transparent rounded-md px-4 py-3.5 text-text-primary placeholder:text-text-muted focus:border-accent focus:bg-white outline-none text-[15px]"
              />
              {errors.password && (
                <p className="text-danger text-xs mt-1.5">{errors.password.message}</p>
              )}
            </div>

            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[rgba(226,59,74,0.08)] border border-[rgba(226,59,74,0.2)] rounded-xl p-3"
              >
                <p className="text-danger text-sm">{serverError}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-dark text-white rounded-pill py-3.5 text-[15px] font-semibold mt-2 hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  جاري الدخول...
                </span>
              ) : (
                'تسجيل الدخول'
              )}
            </button>
          </form>

          <p className="text-center text-text-muted text-xs mt-8">
            MediaOS v1.0 · Odoo 19 Community
          </p>
        </div>
      </motion.div>
    </div>
  );
}
