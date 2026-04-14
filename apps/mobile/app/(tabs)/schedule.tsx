import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { odoo } from '../../lib/odoo';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';

const stateColors: Record<string, string> = { confirmed: '#00a87e', draft: '#8d969e', shot: '#191c1f', postponed: '#ec7e00' };
const stateLabels: Record<string, string> = { confirmed: 'مؤكد', draft: 'مسودة', shot: 'تم', postponed: 'مؤجل' };

export default function ScheduleTab() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const next7 = format(new Date(Date.now() + 7 * 86400000), 'yyyy-MM-dd');

  const { data: lines, isLoading } = useQuery({
    queryKey: ['mobile-schedule'],
    queryFn: () => odoo.searchRead<{ id: number; name?: string; date: string; call_time?: string; location_id?: [number, string] | false; state?: string; int_ext?: string; day_night?: string }>(
      'media.schedule.line',
      [['date', '>=', today], ['date', '<=', next7]],
      ['id', 'name', 'date', 'call_time', 'location_id', 'state', 'int_ext', 'day_night'],
      { order: 'date asc, call_time asc', limit: 100 }
    ),
    staleTime: 30_000,
  });

  // Group by date
  const byDate = new Map<string, typeof lines>();
  for (const line of lines ?? []) {
    const existing = byDate.get(line.date) ?? [];
    existing.push(line);
    byDate.set(line.date, existing);
  }
  const dates = Array.from(byDate.keys()).sort();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f8fa' }}>
      <View style={{ padding: 20, paddingBottom: 8 }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#191c1f', textAlign: 'right' }}>📅 جدول التصوير</Text>
        <Text style={{ color: '#8d969e', fontSize: 13, marginTop: 2, textAlign: 'right' }}>الأسبوع القادم</Text>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#494fdf" size="large" />
        </View>
      ) : dates.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>📅</Text>
          <Text style={{ color: '#8d969e', fontSize: 14 }}>لا يوجد تصوير مجدول</Text>
        </View>
      ) : (
        <FlatList
          data={dates}
          keyExtractor={(d) => d}
          contentContainerStyle={{ padding: 16, paddingTop: 4 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: date }) => {
            const dayLines = byDate.get(date) ?? [];
            const isToday = date === today;
            const dayStr = format(new Date(date), 'EEEE، d MMMM', { locale: arSA });
            return (
              <View style={{ marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 8 }}>
                  {isToday && (
                    <View style={{ backgroundColor: '#494fdf', borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 8 }}>
                      <Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>اليوم</Text>
                    </View>
                  )}
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#191c1f' }}>{dayStr}</Text>
                </View>
                {dayLines.map((line) => (
                  <View key={line.id} style={{ backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 6, borderWidth: 1, borderColor: '#e4e4e8', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: '#191c1f', textAlign: 'right' }}>{line.name ?? `مشهد ${line.id}`}</Text>
                      {line.location_id && typeof line.location_id !== 'boolean' && (
                        <Text style={{ fontSize: 12, color: '#8d969e', textAlign: 'right', marginTop: 2 }}>📍 {(line.location_id as [number, string])[1]}</Text>
                      )}
                      {(line.int_ext || line.day_night) && (
                        <Text style={{ fontSize: 11, color: '#8d969e', textAlign: 'right', marginTop: 2 }}>
                          {line.int_ext} · {line.day_night === 'DAY' ? '☀ نهار' : '🌙 ليل'}
                        </Text>
                      )}
                    </View>
                    <View style={{ alignItems: 'flex-end', marginLeft: 12 }}>
                      {line.call_time && (
                        <View style={{ backgroundColor: 'rgba(73,79,223,0.1)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, marginBottom: 4 }}>
                          <Text style={{ fontSize: 12, fontWeight: '700', color: '#494fdf' }}>{line.call_time.slice(0, 5)}</Text>
                        </View>
                      )}
                      {line.state && (
                        <View style={{ backgroundColor: `${stateColors[line.state] ?? '#8d969e'}15`, borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 2 }}>
                          <Text style={{ fontSize: 10, fontWeight: '600', color: stateColors[line.state] ?? '#8d969e' }}>{stateLabels[line.state] ?? line.state}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
