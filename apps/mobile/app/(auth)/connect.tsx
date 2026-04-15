import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useConnectionStore } from '../../store/connection';
import { resetOdooClient } from '../../lib/odoo';

export default function ConnectScreen() {
  const router = useRouter();
  const { setConnection } = useConnectionStore();

  const [serverUrl, setServerUrl] = useState('https://albait.jtcgov.com/odoo');
  const [databases, setDatabases] = useState<string[]>([]);
  const [selectedDb, setSelectedDb] = useState('');
  const [manualDb, setManualDb] = useState('MediaAi');
  const [manualMode, setManualMode] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [detected, setDetected] = useState(false);
  const [detectError, setDetectError] = useState<string | null>(null);

  const handleDetect = async () => {
    const clean = serverUrl.trim().replace(/\/$/, '');
    if (!clean) return;

    setDetecting(true);
    setDetectError(null);
    setDetected(false);
    setDatabases([]);
    setSelectedDb('');
    setManualMode(false);

    try {
      const res = await fetch(`${clean}/web/database/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', method: 'call', id: 1, params: {} }),
        signal: AbortSignal.timeout(8000),
      });

      const data = (await res.json()) as { result?: string[]; error?: { data?: { message?: string } } };

      if (data.error) {
        setDetectError('تعذّر الاكتشاف التلقائي — أدخل اسم قاعدة البيانات يدوياً');
        setManualMode(true);
        return;
      }

      const dbs = data.result ?? [];
      setDatabases(dbs);
      setDetected(true);

      if (dbs.length === 1) {
        setSelectedDb(dbs[0]!);
      }
      const mediaAi = dbs.find((d) => d.toLowerCase() === 'mediaai');
      if (mediaAi) setSelectedDb(mediaAi);
    } catch (err) {
      setDetectError('تعذّر الاكتشاف التلقائي — أدخل اسم قاعدة البيانات يدوياً');
      setManualMode(true);
    } finally {
      setDetecting(false);
    }
  };

  const handleConnect = () => {
    const db = manualMode ? manualDb.trim() : selectedDb;
    if (!serverUrl || !db) return;
    resetOdooClient();
    setConnection(serverUrl.trim().replace(/\/$/, ''), db);
    router.replace('/(auth)/login');
  };

  const effectiveDb = manualMode ? manualDb.trim() : selectedDb;
  const canConnect = !!effectiveDb && !detecting;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Logo */}
      <View style={styles.logoWrap}>
        <View style={styles.logoBox}>
          <Text style={styles.logoLetter}>M</Text>
        </View>
        <Text style={styles.appName}>MediaOS</Text>
        <Text style={styles.appSub}>إعداد الاتصال بالخادم</Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
        {/* URL Input */}
        <Text style={styles.label}>رابط الخادم</Text>
        <View style={styles.urlRow}>
          <TextInput
            style={[styles.input, styles.urlInput]}
            value={serverUrl}
            onChangeText={(v) => {
              setServerUrl(v);
              setDetected(false);
              setDatabases([]);
              setSelectedDb('');
              setDetectError(null);
            }}
            placeholder="https://your-odoo.com"
            placeholderTextColor="#9ca3af"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            textDirection="ltr"
            onSubmitEditing={handleDetect}
          />
          <TouchableOpacity
            style={[styles.detectBtn, (!serverUrl.trim() || detecting) && styles.btnDisabled]}
            onPress={handleDetect}
            disabled={!serverUrl.trim() || detecting}
            activeOpacity={0.8}
          >
            {detecting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.detectBtnText}>كشف</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Error */}
        {detectError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{detectError}</Text>
          </View>
        )}

        {/* DB List */}
        {detected && databases.length > 0 && (
          <View style={styles.dbSection}>
            <Text style={styles.label}>قاعدة البيانات</Text>
            {databases.map((db) => (
              <TouchableOpacity
                key={db}
                style={[styles.dbItem, selectedDb === db && styles.dbItemSelected]}
                onPress={() => setSelectedDb(db)}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.dbItemText, selectedDb === db && styles.dbItemTextSelected]}
                >
                  {db}
                </Text>
                {selectedDb === db && (
                  <View style={styles.dbCheck}>
                    <Text style={styles.dbCheckIcon}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {detected && databases.length === 0 && (
          <View style={styles.warnBox}>
            <Text style={styles.warnText}>لا توجد قواعد بيانات على هذا الخادم</Text>
          </View>
        )}

        {/* Connect Button */}
        <TouchableOpacity
          style={[styles.connectBtn, !canConnect && styles.btnDisabled]}
          onPress={handleConnect}
          disabled={!canConnect}
          activeOpacity={0.8}
        >
          <Text style={styles.connectBtnText}>
            {selectedDb ? `اتصال بـ ${selectedDb}` : 'اتصال'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>MediaOS v1.0 · Odoo 19 Community</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#191c1f',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBox: {
    width: 56,
    height: 56,
    backgroundColor: '#fff',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoLetter: {
    color: '#191c1f',
    fontSize: 26,
    fontWeight: '700',
  },
  appName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  appSub: {
    color: '#9ca3af',
    fontSize: 13,
    marginTop: 4,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    textAlign: 'right',
  },
  urlRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    color: '#111827',
  },
  urlInput: {
    flex: 1,
    textAlign: 'left',
  },
  detectBtn: {
    backgroundColor: '#191c1f',
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
  },
  detectBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  btnDisabled: {
    opacity: 0.35,
  },
  errorBox: {
    backgroundColor: 'rgba(226,59,74,0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(226,59,74,0.2)',
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    color: '#e23b4a',
    fontSize: 13,
    textAlign: 'right',
  },
  warnBox: {
    backgroundColor: 'rgba(236,126,0,0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(236,126,0,0.2)',
    padding: 12,
    marginBottom: 12,
  },
  warnText: {
    color: '#ec7e00',
    fontSize: 13,
    textAlign: 'right',
  },
  dbSection: {
    marginBottom: 12,
  },
  dbItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 6,
  },
  dbItemSelected: {
    backgroundColor: 'rgba(73,79,223,0.06)',
    borderColor: '#494fdf',
  },
  dbItemText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  dbItemTextSelected: {
    color: '#494fdf',
  },
  dbCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#494fdf',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dbCheckIcon: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  connectBtn: {
    backgroundColor: '#494fdf',
    borderRadius: 9999,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  connectBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  footer: {
    color: '#6b7280',
    fontSize: 11,
    marginTop: 24,
    textAlign: 'center',
  },
});
