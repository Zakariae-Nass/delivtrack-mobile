import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const CORAL     = '#FF6B5B';
const DARK_CARD = '#1C1C1E';
const WHITE     = '#FFFFFF';
const LIGHT_BG  = '#F5F5F7';
const DARK_TEXT = '#1C1C1E';
const GRAY_LABEL= '#8E8EA0';
const GRAY_DIV  = '#ECECF0';

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.07,
  shadowRadius: 14,
  elevation: 5,
};

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function LoginScreen({ navigation }) {
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [focused,      setFocused]      = useState(null);

  const handleLogin = () => {
    if (!email || !password) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email.includes('livreur')) {
        navigation.replace('LivreurHome');
      } else {
        navigation.replace('AgenceDashboard');
      }
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SafeAreaView edges={['top']} />

        {/* ── Logo / Brand ── */}
        <View style={s.brand}>
          <View style={s.logoWrap}>
            <Text style={s.logoEmoji}>🚚</Text>
          </View>
          <Text style={s.appName}>DelivTrack</Text>
          <Text style={s.tagline}>La livraison intelligente au Maroc</Text>
        </View>

        {/* ── Form Card ── */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Connexion</Text>
          <Text style={s.cardSubtitle}>Bienvenue ! Connectez-vous à votre compte</Text>

          {/* Email */}
          <View style={s.fieldGroup}>
            <Text style={s.fieldLabel}>Email</Text>
            <View style={[s.inputWrap, focused === 'email' && s.inputWrapFocused]}>
              <Text style={s.inputIcon}>✉️</Text>
              <TextInput
                style={s.input}
                placeholder="votre@email.com"
                placeholderTextColor={GRAY_LABEL}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
              />
            </View>
          </View>

          {/* Password */}
          <View style={s.fieldGroup}>
            <Text style={s.fieldLabel}>Mot de passe</Text>
            <View style={[s.inputWrap, focused === 'password' && s.inputWrapFocused]}>
              <Text style={s.inputIcon}>🔒</Text>
              <TextInput
                style={s.input}
                placeholder="••••••••"
                placeholderTextColor={GRAY_LABEL}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
              />
              <TouchableOpacity onPress={() => setShowPassword(v => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={s.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot password */}
          <TouchableOpacity style={s.forgotRow} activeOpacity={0.7}>
            <Text style={s.forgotText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          {/* Submit */}
          <TouchableOpacity
            style={[s.submitBtn, (!email || !password) && s.submitBtnDisabled]}
            onPress={handleLogin}
            disabled={loading || !email || !password}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color={WHITE} size="small" />
              : <Text style={s.submitText}>Se connecter</Text>
            }
          </TouchableOpacity>

          {/* Hint */}
          <View style={s.hintBox}>
            <Text style={s.hintText}>
              💡 Tapez "livreur" dans l'email pour accéder à l'espace livreur
            </Text>
          </View>
        </View>

        {/* ── Footer ── */}
        <View style={s.footer}>
          <Text style={s.footerText}>Pas encore de compte ?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')} activeOpacity={0.7}>
            <Text style={s.footerLink}> S'inscrire</Text>
          </TouchableOpacity>
        </View>

        <SafeAreaView edges={['bottom']} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:  { flex: 1, backgroundColor: LIGHT_BG },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  // Brand
  brand: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 32,
  },
  logoWrap: {
    width: 80,
    height: 80,
    borderRadius: 22,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255,107,91,0.20)',
    ...CARD_SHADOW,
  },
  logoEmoji: { fontSize: 36 },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: DARK_TEXT,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 13,
    color: GRAY_LABEL,
    fontWeight: '500',
  },

  // Card
  card: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    ...CARD_SHADOW,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: DARK_TEXT,
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 13,
    color: GRAY_LABEL,
    marginBottom: 24,
    lineHeight: 20,
  },

  // Fields
  fieldGroup: { marginBottom: 16 },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: GRAY_LABEL,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LIGHT_BG,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: GRAY_DIV,
    paddingHorizontal: 14,
    height: 52,
    gap: 8,
  },
  inputWrapFocused: {
    borderColor: CORAL,
    backgroundColor: 'rgba(255,107,91,0.04)',
    shadowColor: CORAL,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 2,
  },
  inputIcon: { fontSize: 16 },
  input: {
    flex: 1,
    fontSize: 15,
    color: DARK_TEXT,
  },
  eyeIcon: { fontSize: 16 },

  // Forgot
  forgotRow: { alignSelf: 'flex-end', marginBottom: 20, marginTop: -4 },
  forgotText: { fontSize: 13, color: CORAL, fontWeight: '600' },

  // Submit
  submitBtn: {
    backgroundColor: DARK_CARD,
    borderRadius: 999,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: DARK_CARD,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.20,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 16,
  },
  submitBtnDisabled: { opacity: 0.45 },
  submitText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.4,
  },

  // Hint
  hintBox: {
    backgroundColor: LIGHT_BG,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: GRAY_DIV,
  },
  hintText: {
    fontSize: 12,
    color: GRAY_LABEL,
    lineHeight: 18,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: { fontSize: 14, color: GRAY_LABEL },
  footerLink: { fontSize: 14, color: CORAL, fontWeight: '800' },
});
