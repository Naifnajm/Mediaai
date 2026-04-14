import { Tabs, Redirect } from 'expo-router';
import { useAuthStore } from '../../store/auth';

const TABS = [
  { name: 'index', title: 'الرئيسية', icon: '📊' },
  { name: 'projects', title: 'المشاريع', icon: '🎬' },
  { name: 'schedule', title: 'الجدول', icon: '📅' },
  { name: 'crew', title: 'الطاقم', icon: '👷' },
  { name: 'more', title: 'المزيد', icon: '☰' },
];

export default function TabsLayout() {
  const session = useAuthStore((s) => s.session);

  if (!session) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#494fdf',
        tabBarInactiveTintColor: '#8d969e',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e4e4e8',
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 16,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          const tab = TABS.find((t) => t.name === route.name);
          return (
            <span style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>
              {tab?.icon}
            </span>
          );
        },
      })}
    >
      {TABS.map((tab) => (
        <Tabs.Screen key={tab.name} name={tab.name} options={{ title: tab.title }} />
      ))}
    </Tabs>
  );
}
