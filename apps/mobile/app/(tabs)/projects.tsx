import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { odoo } from '../../lib/odoo';

const stateConfig: Record<string, { color: string; label: string }> = {
  draft: { color: '#8d969e', label: 'مسودة' },
  pre_production: { color: '#007bc2', label: 'ما قبل الإنتاج' },
  production: { color: '#00a87e', label: 'إنتاج' },
  post_production: { color: '#ec7e00', label: 'ما بعد الإنتاج' },
  delivered: { color: '#494fdf', label: 'مسلّم' },
  cancelled: { color: '#e23b4a', label: 'ملغي' },
};

const typeLabels: Record<string, string> = { film: 'فيلم', series: 'مسلسل', documentary: 'وثائقي', commercial: 'إعلان', short: 'قصير' };

export default function ProjectsTab() {
  const [search, setSearch] = useState('');

  const { data: projects, isLoading } = useQuery({
    queryKey: ['mobile-projects', search],
    queryFn: () => odoo.searchRead<{ id: number; name: string; state: string; production_type: string; date_start: string }>(
      'media.production',
      search ? [['name', 'ilike', search]] : [],
      ['id', 'name', 'state', 'production_type', 'date_start'],
      { limit: 40 }
    ),
    staleTime: 30_000,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f8fa' }}>
      <View style={{ padding: 16, paddingBottom: 8 }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#191c1f', textAlign: 'right', marginBottom: 12 }}>🎬 المشاريع</Text>
        <View style={{ backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e4e4e8', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 }}>
          <Text style={{ color: '#8d969e', marginRight: 8 }}>🔍</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="بحث..."
            placeholderTextColor="#8d969e"
            textAlign="right"
            style={{ flex: 1, padding: 10, fontSize: 14, color: '#191c1f' }}
          />
        </View>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#494fdf" size="large" />
        </View>
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 16, paddingTop: 4 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingTop: 60 }}>
              <Text style={{ fontSize: 40, marginBottom: 12 }}>📭</Text>
              <Text style={{ color: '#8d969e', fontSize: 14 }}>لا توجد مشاريع</Text>
            </View>
          }
          renderItem={({ item }) => {
            const state = stateConfig[item.state] ?? { color: '#8d969e', label: item.state };
            return (
              <TouchableOpacity
                style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#e4e4e8' }}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <View style={{ backgroundColor: `${state.color}15`, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 9999 }}>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: state.color }}>{state.label}</Text>
                  </View>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: '#191c1f', flex: 1, textAlign: 'right', marginLeft: 8 }}>{item.name}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8, gap: 8 }}>
                  {item.production_type && (
                    <Text style={{ fontSize: 11, color: '#8d969e' }}>{typeLabels[item.production_type] ?? item.production_type}</Text>
                  )}
                  {item.date_start && (
                    <Text style={{ fontSize: 11, color: '#8d969e' }}>· {item.date_start.slice(0, 10)}</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
