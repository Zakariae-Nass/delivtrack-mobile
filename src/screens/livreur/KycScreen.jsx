import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SW } = Dimensions.get('window');

// ─── Design Tokens ────────────────────────────────────────────────────────────
const VIOLET       = '#7C3AED';
const VIOLET_BG    = '#EDE8FF';
const VIOLET_MID   = '#DDD6FE';
const VIOLET_LIGHT = '#EDE9FE';
const WHITE        = '#FFFFFF';
const DARK_TEXT    = '#1C1C1E';
const GRAY         = '#8E8EA0';
const GRAY_DIV     = '#ECECF0';
const LIGHT_BG     = '#F5F5F7';
const SKIN         = '#F5CBA7';
const SKIN_DARK    = '#E8A87C';

const CARD_SHADOW = {
  shadowColor: '#5B21B6',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.12,
  shadowRadius: 20,
  elevation: 8,
};

// ─── Step validation ──────────────────────────────────────────────────────────
const isValid = (step, cinNum, licNum) =>
  step === 1 ? cinNum.trim().length >= 2 : licNum.trim().length >= 2;

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function KycScreen({ navigation }) {
  const [step,          setStep]          = useState(1);
  const [cinNumber,     setCinNumber]     = useState('');
  const [cinImage,      setCinImage]      = useState(null);
  const [licenceNumber, setLicenceNumber] = useState('');
  const [licenceImage,  setLicenceImage]  = useState(null);

  const pickImage = async (setter) => {
    try {
      const IP   = require('expo-image-picker');
      const perm = await IP.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) return;
      const res  = await IP.launchImageLibraryAsync({
        mediaTypes: IP.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.85,
      });
      if (!res.canceled && res.assets?.length) setter(res.assets[0].uri);
    } catch {}
  };

  const handleBack = () => (step === 1 ? navigation.goBack() : setStep(1));

  const handleCta = () => {
    if (step === 1) {
      setStep(2);
    } else {
      navigation.navigate('DriverProfile', {
        kycStatus: 'pending',
        kycData: { cinNumber, cinImage, licenceNumber, licenceImage },
      });
    }
  };

  const valid = isValid(step, cinNumber, licenceNumber);

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={VIOLET_BG} />

      {/* ── Top bar (safe area + header + progress) ── */}
      <SafeAreaView edges={['top']} style={s.topArea}>
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={handleBack} activeOpacity={0.7}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>KYC Verification</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Progress bar */}
        <StepProgress step={step} />
      </SafeAreaView>

      {/* ── Scrollable body ── */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Illustration */}
        <View style={s.illustrationArea}>
          {step === 1 ? <PhoneIllustration type="cin" /> : <PhoneIllustration type="licence" />}
        </View>

        {/* Title + subtitle */}
        <Text style={s.title}>
          {step === 1 ? 'Upload your CIN' : 'Upload your Licence'}
        </Text>
        <Text style={s.subtitle}>
          {step === 1
            ? 'Enter your CIN number and upload a photo of your national identity card.'
            : 'Enter your licence number and upload a photo of your driving licence.'}
        </Text>

        {/* Form card */}
        <View style={s.formCard}>
          {step === 1 ? (
            <>
              <FormInput
                label="CIN Number"
                value={cinNumber}
                onChange={setCinNumber}
                placeholder="e.g. AB123456"
                autoCapitalize="characters"
              />
              <UploadField
                label="Upload CIN Image"
                uri={cinImage}
                onPress={() => pickImage(setCinImage)}
              />
            </>
          ) : (
            <>
              <FormInput
                label="Licence Number"
                value={licenceNumber}
                onChange={setLicenceNumber}
                placeholder="e.g. MAR-2023-001"
                autoCapitalize="characters"
              />
              <UploadField
                label="Upload Licence Image"
                uri={licenceImage}
                onPress={() => pickImage(setLicenceImage)}
              />
            </>
          )}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ── Fixed CTA button ── */}
      <SafeAreaView edges={['bottom']} style={s.ctaContainer}>
        <TouchableOpacity
          style={[s.ctaBtn, !valid && s.ctaBtnDisabled]}
          onPress={handleCta}
          activeOpacity={0.85}
          disabled={!valid}
        >
          <Text style={s.ctaBtnText}>
            {step === 1 ? 'Continue →' : 'Submit for Approval'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

// ─── Step Progress Bar ────────────────────────────────────────────────────────
function StepProgress({ step }) {
  const steps = ['CIN', 'Licence', 'Confirm'];
  return (
    <View style={pb.row}>
      {steps.map((label, i) => {
        const num      = i + 1;
        const isActive = step >= num;
        const isDone   = step > num;
        return (
          <View key={label} style={pb.stepWrap}>
            {/* Connecting line (not for first step) */}
            {i > 0 && (
              <View style={[pb.line, isActive && pb.lineActive]} />
            )}
            <View style={{ alignItems: 'center' }}>
              <View style={[pb.dot, isActive && pb.dotActive]}>
                <Text style={[pb.dotText, isActive && pb.dotTextActive]}>
                  {isDone ? '✓' : num}
                </Text>
              </View>
              <Text style={[pb.label, isActive && pb.labelActive]}>{label}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

// ─── Phone Illustration ───────────────────────────────────────────────────────
function PhoneIllustration({ type }) {
  return (
    <View style={ill.scene}>
      {/* Hand / palm */}
      <View style={ill.palm}>
        {/* Fingers */}
        <View style={ill.fingers}>
          {[0, 1, 2, 3].map(i => (
            <View key={i} style={[ill.finger, { marginLeft: i === 0 ? 0 : 6 }]} />
          ))}
        </View>

        {/* Phone body */}
        <View style={ill.phone}>
          {/* Top notch */}
          <View style={ill.notch} />
          {/* Screen */}
          <View style={ill.screen}>
            {type === 'cin' ? <CINCard /> : <LicenceCard />}
          </View>
          {/* Home indicator */}
          <View style={ill.homeBar} />
        </View>

        {/* Thumb */}
        <View style={ill.thumb} />
      </View>
    </View>
  );
}

function CINCard() {
  return (
    <View style={ill.card}>
      <View style={ill.cardHeader}>
        <View style={ill.cardFlag} />
        <View style={ill.cardTitleLine} />
      </View>
      <View style={ill.cardBody}>
        <View style={ill.cardPhoto} />
        <View style={ill.cardLines}>
          <View style={ill.cardLine} />
          <View style={[ill.cardLine, { width: '70%' }]} />
          <View style={[ill.cardLine, { width: '55%' }]} />
        </View>
      </View>
      <View style={[ill.cardLine, { width: '80%', alignSelf: 'center', marginTop: 4 }]} />
    </View>
  );
}

function LicenceCard() {
  return (
    <View style={ill.card}>
      <View style={[ill.cardHeader, { backgroundColor: VIOLET }]}>
        <View style={[ill.cardFlag, { backgroundColor: WHITE, opacity: 0.4 }]} />
        <View style={[ill.cardTitleLine, { backgroundColor: WHITE, opacity: 0.6 }]} />
      </View>
      <View style={ill.cardBody}>
        <View style={[ill.cardPhoto, { borderRadius: 4 }]} />
        <View style={ill.cardLines}>
          <View style={ill.cardLine} />
          <View style={[ill.cardLine, { width: '60%' }]} />
          <View style={[ill.cardLine, { width: '45%' }]} />
        </View>
      </View>
      <View style={[ill.cardLine, { width: '75%', alignSelf: 'center', marginTop: 4 }]} />
    </View>
  );
}

// ─── Form Input ───────────────────────────────────────────────────────────────
function FormInput({ label, value, onChange, placeholder, autoCapitalize }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={fi.wrap}>
      <Text style={fi.label}>{label}</Text>
      <TextInput
        style={[fi.input, focused && fi.inputFocused]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={GRAY}
        autoCapitalize={autoCapitalize || 'none'}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
}

// ─── Upload Field ─────────────────────────────────────────────────────────────
function UploadField({ label, uri, onPress }) {
  return (
    <View style={uf.wrap}>
      <Text style={uf.label}>{label}</Text>
      <TouchableOpacity
        style={[uf.area, uri && uf.areaFilled]}
        onPress={onPress}
        activeOpacity={0.75}
      >
        {uri ? (
          <View style={uf.previewWrap}>
            <Image source={{ uri }} style={uf.preview} />
            <View style={uf.changeOverlay}>
              <Text style={uf.changeText}>Change</Text>
            </View>
          </View>
        ) : (
          <>
            <View style={uf.iconCircle}>
              <Text style={uf.icon}>📎</Text>
            </View>
            <Text style={uf.uploadText}>Tap to upload a photo</Text>
            <Text style={uf.uploadHint}>JPG, PNG supported</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:  { flex: 1, backgroundColor: VIOLET_BG },
  topArea: { backgroundColor: VIOLET_BG },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40, height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow:   { fontSize: 22, color: DARK_TEXT, fontWeight: '700', lineHeight: 26 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: DARK_TEXT },

  scroll:        { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20 },

  illustrationArea: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: DARK_TEXT,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14,
    color: GRAY,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 12,
  },

  formCard: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 20,
    ...CARD_SHADOW,
  },

  ctaContainer: {
    backgroundColor: VIOLET_BG,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: VIOLET_MID,
  },
  ctaBtn: {
    backgroundColor: VIOLET,
    borderRadius: 999,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: VIOLET,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  ctaBtnDisabled: { opacity: 0.45 },
  ctaBtnText: {
    color: WHITE,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});

// Progress bar
const pb = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 4,
  },
  stepWrap: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  line: {
    width: (SW - 240) / 2,
    height: 2,
    backgroundColor: VIOLET_MID,
    marginBottom: 16,
  },
  lineActive: { backgroundColor: VIOLET },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: WHITE,
    borderWidth: 2,
    borderColor: VIOLET_MID,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotActive: {
    backgroundColor: VIOLET,
    borderColor: VIOLET,
  },
  dotText: {
    fontSize: 11,
    fontWeight: '800',
    color: GRAY,
  },
  dotTextActive: { color: WHITE },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: GRAY,
    marginTop: 4,
    textAlign: 'center',
  },
  labelActive: { color: VIOLET, fontWeight: '700' },
});

// Phone illustration
const ILL_PHONE_W = 110;
const ILL_PHONE_H = 180;

const ill = StyleSheet.create({
  scene:   { alignItems: 'center', justifyContent: 'center', height: 220 },
  palm: {
    width: ILL_PHONE_W + 40,
    alignItems: 'center',
    position: 'relative',
  },
  fingers: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: -12,
    zIndex: 0,
  },
  finger: {
    width: 18,
    height: 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: SKIN_DARK,
    marginLeft: 6,
  },
  phone: {
    width: ILL_PHONE_W,
    height: ILL_PHONE_H,
    borderRadius: 18,
    backgroundColor: WHITE,
    borderWidth: 2.5,
    borderColor: VIOLET_MID,
    overflow: 'hidden',
    zIndex: 1,
    shadowColor: VIOLET,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  notch: {
    width: 36,
    height: 8,
    backgroundColor: VIOLET_MID,
    borderRadius: 4,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 6,
  },
  screen: {
    flex: 1,
    backgroundColor: VIOLET_LIGHT,
    marginHorizontal: 6,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },
  homeBar: {
    width: 36,
    height: 4,
    backgroundColor: VIOLET_MID,
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 7,
  },
  thumb: {
    width: 22,
    height: 60,
    borderRadius: 11,
    backgroundColor: SKIN,
    position: 'absolute',
    right: -8,
    bottom: 20,
    zIndex: 2,
  },

  // ID Card inside screen
  card: {
    width: '100%',
    backgroundColor: WHITE,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: VIOLET,
    padding: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: VIOLET_LIGHT,
    borderRadius: 3,
    padding: 3,
    marginBottom: 5,
    gap: 4,
  },
  cardFlag:      { width: 10, height: 8, backgroundColor: VIOLET, borderRadius: 1 },
  cardTitleLine: { flex: 1, height: 4, backgroundColor: VIOLET_MID, borderRadius: 2 },
  cardBody:      { flexDirection: 'row', gap: 4, marginBottom: 2 },
  cardPhoto:     { width: 18, height: 22, backgroundColor: VIOLET_MID, borderRadius: 3 },
  cardLines:     { flex: 1, justifyContent: 'space-between' },
  cardLine:      { height: 4, backgroundColor: VIOLET_MID, borderRadius: 2, marginBottom: 3, width: '100%' },
});

// Form input
const fi = StyleSheet.create({
  wrap:  { marginBottom: 16 },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: GRAY,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: GRAY_DIV,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: DARK_TEXT,
    backgroundColor: LIGHT_BG,
  },
  inputFocused: {
    borderColor: VIOLET,
    backgroundColor: WHITE,
    shadowColor: VIOLET,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 2,
  },
});

// Upload field
const uf = StyleSheet.create({
  wrap:  { marginBottom: 4 },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: GRAY,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  area: {
    height: 120,
    borderWidth: 2,
    borderColor: VIOLET_MID,
    borderStyle: 'dashed',
    borderRadius: 16,
    backgroundColor: VIOLET_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  areaFilled: {
    borderStyle: 'solid',
    borderColor: VIOLET,
    backgroundColor: LIGHT_BG,
    padding: 0,
    overflow: 'hidden',
  },
  previewWrap:   { width: '100%', height: '100%' },
  preview:       { width: '100%', height: '100%', borderRadius: 14 },
  changeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(124,58,237,0.7)',
    paddingVertical: 6,
    alignItems: 'center',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  changeText:  { color: WHITE, fontSize: 12, fontWeight: '700' },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(124,58,237,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon:       { fontSize: 20 },
  uploadText: { fontSize: 13, fontWeight: '700', color: VIOLET },
  uploadHint: { fontSize: 11, color: GRAY },
});
