import { View, Text, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { odoo } from '../../lib/odoo';

const deptLabels: Record<string, string> = { direction: 'إخراج', camera: 'كاميرا', lighting: 'إضاءة', sound: 'صوت', art: 'فن', production: 'إنتاج', post: 'بوست', vfx: 'VFX', other: 'أخرى' };
const deptColors: Record<string, string> = { direction: '#494fdf', camera: '#191c1f', lighting: '#ec7e00', sound: '#00a87e', art: '#e23b4a', production: '#007bc2', post: '#505a63', vfx: '#8d969e', other: '#8d969e' };

export default function CrewTab() {
  const [search, setSearch] = useState('');

  const { data: crew, isLoading } = useQuery({
    queryKey: ['mobile-crew', search],
    queryFn: () => odoo.searchRead<{ id: number; name: string; department: string; role: string; state: string; employee_id?: [number, string] | false }>(
      'media.crew',
      search ? [['name', 'ilike', search]] : [['state', '=', 'active']],
      ['id', 'name', 'department', 'role', 'state', 'employee_id'],
      { limit: 50 }
    ),
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f8fa' }}>
      <View style={{ padding: 16, paddingBottom: 8 }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#191c1f', textAlign: 'right', marginBottom: 12 }}>👷 الطاقم</Text>
        <View style={{ backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e4e4e8', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 }}>
          <Text style={{ color: '#8d969e', marginRight: 8 }}>🔍</Text>
          <TextInput value={search} onChangeText={setSearch} placeholder="بحث..." placeholderTextColor="#8d969e" textAlign="right"
            style={{ flex: 1, padding: 10, fontSize: 14, color: '#191c1f' }} />
        </View>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color="#494fdf" size="large" /></View>
      ) : (
        <FlatList
          data={crew}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 16, paddingTop: 4 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<View style={{ alignItems: 'center', paddingTop: 60 }}><Text style={{ fontSize: 40, marginBottom: 12 }}>👷</Text><Text style={{ color: '#8d969e', fontSize: 14 }}>لا يوجد طاقم</Text></View>}
          renderItem={({ item }) => {
            const color = deptColors[item.department] ?? '#8d969e';
            return (
              <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#e4e4e8', flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: `${color}20`, alignItems: 'center', justifyContent: 'center', marginLeft: 12 }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color }}>{item.name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#191c1f', textAlign: 'right' }}>{item.name}</Text>
                  <Text style={{ fontSize: 12, color: '#8d969e', textAlign: 'right', marginTop: 2 }}>{item.role}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4 }}>
                    <View style={{ backgroundColor: `${color}15`, borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 2 }}>
                      <Text style={{ fontSize: 10, fontWeight: '600', color }}>{deptLabels[item.department] ?? item.department}</Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
