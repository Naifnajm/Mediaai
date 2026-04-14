'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = useAuthStore((s) => s.session);
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed);
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  if (!session) return null;

  const marginRight = sidebarCollapsed ? '60px' : '260px';

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar collapsed={sidebarCollapsed} />
      <div className="flex-1 flex flex-col transition-all duration-200" style={{ marginRight }}>
        <Topbar />
        <main className="flex-1 p-10 max-w-[1200px] w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
