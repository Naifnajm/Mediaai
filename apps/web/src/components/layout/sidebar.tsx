'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: 'الإنتاج',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: '📊' },
      { label: 'المشاريع', href: '/projects', icon: '🎬' },
      { label: 'جدول التصوير', href: '/schedule', icon: '📅' },
    ],
  },
  {
    label: 'ما قبل الإنتاج',
    items: [
      { label: 'الإبداع والسيناريو', href: '/creative', icon: '✍️' },
      { label: 'AI Breakdown', href: '/ai-breakdown', icon: '🤖' },
      { label: 'الكاستينج', href: '/casting', icon: '🎭' },
      { label: 'المواقع', href: '/locations', icon: '📍' },
    ],
  },
  {
    label: 'التشغيل',
    items: [
      { label: 'الطاقم', href: '/crew', icon: '👷' },
      { label: 'المعدات', href: '/equipment', icon: '🎥' },
      { label: 'السلامة', href: '/safety', icon: '🛡️' },
    ],
  },
  {
    label: 'المالية',
    items: [
      { label: 'الميزانية', href: '/budget', icon: '💰' },
      { label: 'الصندوق', href: '/petty-cash', icon: '💵' },
    ],
  },
  {
    label: 'القانوني',
    items: [
      { label: 'العقود', href: '/contracts', icon: '📄' },
      { label: 'التصاريح', href: '/clearances', icon: '✅' },
      { label: 'حقوق الموسيقى', href: '/music-rights', icon: '🎵' },
      { label: 'التأمين', href: '/insurance', icon: '☂️' },
    ],
  },
  {
    label: 'ما بعد الإنتاج',
    items: [
      { label: 'VFX والبوست', href: '/vfx', icon: '⚡' },
      { label: 'المكتبة الرقمية', href: '/dam', icon: '🗄️' },
      { label: 'التوزيع', href: '/distribution', icon: '📡' },
    ],
  },
  {
    label: 'الإدارة',
    items: [
      { label: 'التحليلات', href: '/analytics', icon: '📈' },
      { label: 'CRM', href: '/crm', icon: '💼' },
      { label: 'الموارد البشرية', href: '/hr', icon: '👤' },
      { label: 'الرواتب', href: '/payroll', icon: '💳' },
      { label: 'الإنهاء', href: '/wrap', icon: '🎁' },
      { label: 'الإعدادات', href: '/settings', icon: '⚙️' },
    ],
  },
];

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={clsx(
        'sidebar-scroll bg-dark fixed top-0 right-0 h-screen overflow-y-auto z-[100] transition-all duration-200 flex flex-col',
        collapsed ? 'w-[60px]' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div className={clsx('border-b border-white/10 mb-2', collapsed ? 'p-4' : 'px-5 py-6')}>
        {collapsed ? (
          <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-sm font-display">M</span>
          </div>
        ) : (
          <>
            <h1 className="text-white font-bold text-xl tracking-tight font-display">MediaOS</h1>
            <p className="text-white/40 text-xs mt-0.5">إدارة الإنتاج الإعلامي</p>
          </>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2">
        {navGroups.map((group) => (
          <div key={group.label} className={clsx('mb-1', collapsed ? 'px-2' : 'px-3')}>
            {!collapsed && (
              <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-2 py-2">
                {group.label}
              </p>
            )}
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 rounded-md mb-0.5 transition-all duration-150',
                  collapsed ? 'p-2 justify-center' : 'px-3 py-2.5',
                  isActive(item.href)
                    ? 'bg-white/12 text-white'
                    : 'text-white/60 hover:bg-white/8 hover:text-white/90'
                )}
                title={collapsed ? item.label : undefined}
              >
                <span className="text-base leading-none flex-shrink-0">{item.icon}</span>
                {!collapsed && (
                  <span className="text-[13.5px] font-medium truncate">{item.label}</span>
                )}
                {!collapsed && isActive(item.href) && (
                  <span className="mr-auto w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                )}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      {!collapsed && (
        <div className="border-t border-white/10 p-4">
          <p className="text-white/20 text-[11px] text-center">v1.0 · Odoo 19</p>
        </div>
      )}
    </aside>
  );
}
