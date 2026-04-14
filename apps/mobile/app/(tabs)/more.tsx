import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/auth';
import { odoo } from '../../lib/odoo';

const sections = [
  {
    title: 'ما قبل الإنتاج',
    items: [
      { icon: '✍️', label: 'الإبداع والسيناريو', model: 'media.creative' },
      { icon: '🤖', label: 'AI Breakdown', model: 'media.ai.breakdown' },
      { icon: '🎭', label: 'الكاستينج', model: 'media.casting' },
      { icon: '📍', label: 'المواقع', model: 'media.locations' },
    ],
  },
  {
    title: 'المالية والقانوني',
    items: [
      { icon: '💰', label: 'الميزانية', model: 'media.budget' },
      { icon: '📄', label: 'العقود', model: 'media.contract' },
      { icon: '✅', label: 'التصاريح', model: 'media.clearances' },
      { icon: '🎵', label: 'حقوق الموسيقى', model: 'media.music.rights' },
      { icon: '☂️', label: 'التأمين', model: 'media.insurance' },
    ],
  },
  {
    title: 'ما بعد الإنتاج',
    items: [
      { icon: '⚡', label: 'VFX', model: 'media.vfx' },
      { icon: '🗄️', label: 'المكتبة الرقمية', model: 'media.dam.asset' },
      { icon: '📡', label: 'التوزيع', model: 'media.distribution' },
    ],
  },
  {
    title: 'الإدارة',
    items: [
      { icon: '💼', label: 'CRM', model: 'media.crm' },
      { icon: '👤', label: 'الموارد البشرية', model: 'hr.employee' },
      { icon: '💳', label: 'الرواتب', model: 'media.payroll.sa' },
    ],
  },
];

export default function MoreTab() {
  const session = useAuthStore((s) => s.session);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('تسجيل الخروج', 'هل تريد الخروج من التطبيق؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'خروج',
        style: 'destructive',
        onPress: async () => {
          await odoo.logout().catch(() => null);
          logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f8fa' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ padding: 20, paddingBottom: 8 }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#191c1f', textAlign: 'right' }}>☰ المزيد</Text>
        </View>

        {/* Profile Card */}
        <View style={{ marginHorizontal: 16, backgroundColor: '#191c1f', borderRadius: 20, padding: 20, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
            <View style={{ marginLeft: 12, alignItems: 'flex-end' }}>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>{session?.name}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2 }}>{session?.db} · Odoo 19</Text>
            </View>
            <View style={{ width: 48, height: 48, backgroundColor: '#494fdf', borderRadius: 24, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>{session?.name?.charAt(0)}</Text>
            </View>
          </View>
        </View>

        {/* Module Sections */}
        {sections.map((section) => (
          <View key={section.title} style={{ marginHorizontal: 16, marginBottom: 16 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: '#8d969e', textAlign: 'right', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>{section.title}</Text>
            <View style={{ backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e4e4e8', overflow: 'hidden' }}>
              {section.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.model}
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', padding: 14, borderBottomWidth: idx < section.items.length - 1 ? 1 : 0, borderBottomColor: '#e4e4e8' }}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 14, fontWeight: '500', color: '#191c1f', marginLeft: 12 }}>{item.label}</Text>
                  <Text style={{ fontSize: 20 }}>{item.icon}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          style={{ marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e4e4e8', padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}
        >
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#e23b4a' }}>تسجيل الخروج</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
