import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView,
  Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { odoo } from '../../lib/odoo';
import { useAuthStore } from '../../store/auth';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }
    setLoading(true);
    try {
      const session = await odoo.authenticate(username.trim(), password);
      setSession(session);
      router.replace('/(tabs)/');
    } catch (err) {
      Alert.alert('خطأ في الدخول', err instanceof Error ? err.message : 'بيانات غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#191c1f' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          {/* Logo */}
          <View style={{ width: 64, height: 64, backgroundColor: '#494fdf', borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <Text style={{ color: '#fff', fontSize: 28, fontWeight: '700' }}>M</Text>
          </View>
          <Text style={{ color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 4, writingDirection: 'rtl' }}>MediaOS</Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 40, textAlign: 'center' }}>نظام إدارة الإنتاج الإعلامي</Text>

          {/* Form */}
          <View style={{ width: '100%', maxWidth: 380, backgroundColor: '#fff', borderRadius: 20, padding: 28 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: '#505a63', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1, textAlign: 'right' }}>اسم المستخدم</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="admin"
              placeholderTextColor="#8d969e"
              autoCapitalize="none"
              autoCorrect={false}
              textAlign="right"
              style={{ backgroundColor: '#f4f4f4', borderRadius: 12, padding: 14, fontSize: 15, color: '#191c1f', marginBottom: 16, textAlign: 'right' }}
            />

            <Text style={{ fontSize: 11, fontWeight: '600', color: '#505a63', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1, textAlign: 'right' }}>كلمة المرور</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#8d969e"
              secureTextEntry
              textAlign="right"
              style={{ backgroundColor: '#f4f4f4', borderRadius: 12, padding: 14, fontSize: 15, color: '#191c1f', marginBottom: 24, textAlign: 'right' }}
            />

            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              style={{ backgroundColor: '#191c1f', borderRadius: 9999, padding: 16, alignItems: 'center', opacity: loading ? 0.6 : 1 }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>تسجيل الدخول</Text>
              )}
            </TouchableOpacity>
          </View>

          <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: 32 }}>MediaOS v1.0 · Odoo 19</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
