'use client';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';
import { odoo } from '@/lib/odoo/client';

interface TopbarProps {
  title?: string;
}

export function Topbar({ title }: TopbarProps) {
  const session = useAuthStore((s) => s.session);
  const logout = useAuthStore((s) => s.logout);
  const toggleCollapse = useUiStore((s) => s.toggleSidebarCollapse);
  const router = useRouter();

  const handleLogout = async () => {
    await odoo.logout().catch(() => null);
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-white border-b border-border h-[60px] flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        {/* Collapse toggle */}
        <button
          onClick={toggleCollapse}
          className="w-8 h-8 flex items-center justify-center rounded-md text-text-muted hover:text-text-primary hover:bg-surface"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="6" width="18" height="2" rx="1" />
            <rect x="3" y="11" width="18" height="2" rx="1" />
            <rect x="3" y="16" width="18" height="2" rx="1" />
          </svg>
        </button>
        {title && (
          <h2 className="text-[16px] font-semibold text-text-primary">{title}</h2>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="بحث..."
            className="bg-surface border-0 rounded-md pl-4 pr-9 py-2 text-sm w-52 outline-none focus:ring-1 focus:ring-accent text-text-primary placeholder:text-text-muted"
          />
        </div>

        {/* Notifications */}
        <button className="w-8 h-8 flex items-center justify-center rounded-md text-text-muted hover:text-text-primary hover:bg-surface relative">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold">
            {session?.name?.charAt(0) ?? 'U'}
          </div>
          <div className="hidden md:block">
            <p className="text-[13px] font-medium text-text-primary leading-none">{session?.name ?? 'المستخدم'}</p>
            <p className="text-[11px] text-text-muted mt-0.5">{session?.db}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-text-muted hover:text-danger text-xs mr-1 hidden md:block"
          >
            خروج
          </button>
        </div>
      </div>
    </header>
  );
}
