import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/auth';
import { odoo } from '../../lib/odoo';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';

function KpiCard({ icon, label, value, color = '#191c1f' }: { icon: string; label: string; value: number | string; color?: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 16, margin: 4, borderWidth: 1, borderColor: '#e4e4e8' }}>
      <Text style={{ fontSize: 24, marginBottom: 8 }}>{icon}</Text>
      <Text style={{ fontSize: 24, fontWeight: '700', color, marginBottom: 2 }}>{value}</Text>
      <Text style={{ fontSize: 11, color: '#8d969e', textAlign: 'right' }}>{label}</Text>
    </View>
  );
}

export default function HomeTab() {
  const session = useAuthStore((s) => s.session);
  const today = format(new Date(), 'yyyy-MM-dd');

  const { data, isLoading } = useQuery({
    queryKey: ['mobile-dashboard'],
    queryFn: async () => {
      const [productions, crew, scheduleToday] = await Promise.all([
        odoo.searchCount('media.production', [['state', 'not in', ['cancelled', 'delivered']]]),
        odoo.searchCount('media.crew', [['state', '=', 'active']]),
        odoo.searchRead('media.schedule.line', [['date', '=', today]], ['id', 'name', 'call_time', 'location_id'], { limit: 5 }),
      ]);
      return { productions, crew, scheduleToday };
    },
    staleTime: 60_000,
  });

  const { data: recentProductions } = useQuery({
    queryKey: ['mobile-recent-productions'],
    queryFn: () => odoo.searchRead<{ id: number; name: string; state: string }>(
      'media.production', [], ['id', 'name', 'state'], { limit: 5 }
    ),
  });

  const stateColors: Record<string, string> = { production: '#00a87e', pre_production: '#007bc2', draft: '#8d969e', delivered: '#494fdf', cancelled: '#e23b4a' };
  const stateLabels: Record<string, string> = { production: 'إنتاج', pre_production: 'ما قبل', draft: 'مسودة', delivered: 'مسلّم', post_production: 'ما بعد', cancelled: 'ملغي' };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f8fa' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ padding: 20, paddingBottom: 0 }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#191c1f', textAlign: 'right' }}>
            مرحباً، {session?.name?.split(' ')[0]} 👋
          </Text>
          <Text style={{ color: '#8d969e', fontSize: 13, marginTop: 2, textAlign: 'right' }}>
            {format(new Date(), 'EEEE، d MMMM yyyy', { locale: arSA })}
          </Text>
        </View>

        {isLoading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator color="#494fdf" size="large" />
          </View>
        ) : (
          <>
            {/* KPI Grid */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 16, paddingTop: 12 }}>
              <KpiCard icon="🎬" label="مشاريع نشطة" value={data?.productions ?? 0} />
              <KpiCard icon="👷" label="طاقم فعال" value={data?.crew ?? 0} />
              <KpiCard icon="📅" label="مشاهد اليوم" value={data?.scheduleToday?.length ?? 0} color="#494fdf" />
            </View>

            {/* Today's Schedule */}
            {(data?.scheduleToday?.length ?? 0) > 0 && (
              <View style={{ marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e4e4e8' }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#191c1f', marginBottom: 12, textAlign: 'right' }}>📅 جدول اليوم</Text>
                {data?.scheduleToday?.map((scene: { id: number; name?: string; call_time?: string; location_id?: [number, string] | false }) => (
                  <View key={scene.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#e4e4e8' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: '#191c1f', textAlign: 'right' }}>{scene.name ?? `مشهد ${scene.id}`}</Text>
                      {scene.location_id && typeof scene.location_id !== 'boolean' && (
                        <Text style={{ fontSize: 11, color: '#8d969e', textAlign: 'right' }}>{(scene.location_id as [number, string])[1]}</Text>
                      )}
                    </View>
                    {scene.call_time && (
                      <View style={{ backgroundColor: 'rgba(73,79,223,0.1)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, marginLeft: 8 }}>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: '#494fdf' }}>{scene.call_time.slice(0, 5)}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Recent Projects */}
            <View style={{ marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e4e4e8', marginBottom: 20 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#191c1f', marginBottom: 12, textAlign: 'right' }}>🎬 آخر المشاريع</Text>
              {(recentProductions?.length ?? 0) === 0 ? (
                <Text style={{ color: '#8d969e', textAlign: 'center', fontSize: 13 }}>لا توجد مشاريع</Text>
              ) : (
                recentProductions?.map((p) => (
                  <View key={p.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#e4e4e8' }}>
                    <View style={{ backgroundColor: `${stateColors[p.state] ?? '#8d969e'}15`, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 9999 }}>
                      <Text style={{ fontSize: 11, fontWeight: '600', color: stateColors[p.state] ?? '#8d969e' }}>{stateLabels[p.state] ?? p.state}</Text>
                    </View>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#191c1f', flex: 1, textAlign: 'right', marginLeft: 8 }}>{p.name}</Text>
                  </View>
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
