'use client';
import { Card, CardHeader, CardBody } from '@/components/ui/card';
import { useAuthStore } from '@/store/auth.store';

export default function SettingsPage() {
  const session = useAuthStore((s) => s.session);
  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary font-display tracking-tight">⚙️ الإعدادات</h1>
        <p className="text-text-muted text-sm mt-0.5">إعدادات النظام والحساب</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader icon="👤" title="معلومات الحساب" />
          <CardBody>
            <div className="space-y-3">
              <div><p className="text-xs font-semibold text-text-muted mb-1">الاسم</p><p className="text-[15px] text-text-primary">{session?.name}</p></div>
              <div><p className="text-xs font-semibold text-text-muted mb-1">اسم المستخدم</p><p className="text-[15px] text-text-primary">{session?.username}</p></div>
              <div><p className="text-xs font-semibold text-text-muted mb-1">قاعدة البيانات</p><p className="text-[15px] text-text-primary font-mono">{session?.db}</p></div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader icon="🔌" title="إعدادات الاتصال" />
          <CardBody>
            <div className="space-y-3">
              <div><p className="text-xs font-semibold text-text-muted mb-1">Odoo URL</p><p className="text-[13px] text-text-primary font-mono">{process.env.NEXT_PUBLIC_ODOO_URL ?? 'غير محدد'}</p></div>
              <div><p className="text-xs font-semibold text-text-muted mb-1">الإصدار</p><p className="text-[13px] text-text-primary">Odoo 19 Community</p></div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
