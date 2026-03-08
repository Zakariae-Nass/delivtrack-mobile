import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  Animated,
  TextInput,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DrawerMenu from '../../components/DrawerMenu';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─── Design Tokens ───────────────────────────────────────────────────────────
const CORAL      = '#FF6B5B';
const DARK_CARD  = '#1C1C1E';
const WHITE      = '#FFFFFF';
const LIGHT_BG   = '#F5F5F7';
const GRAY_LABEL = '#8E8EA0';
const GRAY_DIV   = '#ECECF0';
const DARK_TEXT  = '#1C1C1E';

const AMBER      = '#F59E0B';
const AMBER_BG   = 'rgba(245,158,11,0.12)';
const ORANGE     = '#EA580C';
const ORANGE_BG  = 'rgba(234,88,12,0.10)';
const GREEN      = '#16A34A';
const GREEN_BG   = 'rgba(22,163,74,0.10)';

// KYC badge config
const KYC_BADGE = {
  not_verified: { label: 'Not Verified', color: ORANGE,    bg: ORANGE_BG,  tappable: true  },
  pending:      { label: 'Pending',      color: AMBER,     bg: AMBER_BG,   tappable: false },
  approved:     { label: 'Approved',     color: DARK_CARD, bg: DARK_CARD,  tappable: false, textColor: WHITE },
};

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.07,
  shadowRadius: 14,
  elevation: 5,
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const INITIAL_DRIVER = {
  firstName:   'Hiroshima',
  lastName:    'Tanaka',
  email:       'hiroshima@gmail.com',
  cin:         'AB123456',
  licence:     'MAR-2023-001',
  vehicleType: 'Moto',
  phone:       '0600000000',
  location:    'Casablanca, Maroc',
};

const VIEW_FIELDS = (d) => [
  { label: 'First Name',    value: d.firstName },
  { label: 'Last Name',     value: d.lastName },
  { label: 'Email',         value: d.email },
  { label: 'Password',      value: '••••••••••••', isPassword: true },
  { label: 'CIN',           value: d.cin },
  { label: 'Licence',       value: d.licence },
  { label: 'Vehicle Type',  value: d.vehicleType },
  { label: 'Phone Number',  value: d.phone },
  { label: 'Location',      value: d.location },
];

const EDIT_FIELDS = [
  { key: 'firstName', label: 'First Name',   secure: false },
  { key: 'lastName',  label: 'Last Name',    secure: false },
  { key: 'email',     label: 'Email',        secure: false, keyboard: 'email-address' },
  { key: 'password',  label: 'Password',     secure: true },
  { key: 'phone',     label: 'Phone Number', secure: false, keyboard: 'phone-pad' },
  { key: 'location',  label: 'Location',     secure: false },
];

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function DriverProfileScreen({ navigation, route }) {
  const [driver, setDriver]         = useState(INITIAL_DRIVER);
  const [editData, setEditData]     = useState({});
  const [sheetOpen, setSheetOpen]   = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [avatar, setAvatar]         = useState(null);
  const [focused, setFocused]       = useState(null);
  const [kycStatus, setKycStatus]   = useState('not_verified'); // 'not_verified' | 'pending' | 'approved'
  const [kycConfirm, setKycConfirm] = useState(false);

  // Pick up kycStatus sent back from KycScreen
  useEffect(() => {
    if (route?.params?.kycStatus) {
      setKycStatus(route.params.kycStatus);
      navigation.setParams({ kycStatus: undefined });
    }
  }, [route?.params?.kycStatus]);

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // ── Sheet open / close ────────────────────────────────────────────────────
  const openSheet = () => {
    setEditData({
      firstName: driver.firstName,
      lastName:  driver.lastName,
      email:     driver.email,
      password:  '',
      phone:     driver.phone,
      location:  driver.location,
    });
    setSheetOpen(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 65,
      friction: 11,
      useNativeDriver: true,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 280,
      useNativeDriver: true,
    }).start(() => setSheetOpen(false));
  };

  // ── Confirm edits ─────────────────────────────────────────────────────────
  const handleConfirm = () => {
    setDriver(prev => ({
      ...prev,
      firstName: editData.firstName || prev.firstName,
      lastName:  editData.lastName  || prev.lastName,
      email:     editData.email     || prev.email,
      phone:     editData.phone     || prev.phone,
      location:  editData.location  || prev.location,
    }));
    closeSheet();
  };

  // ── Image picker ──────────────────────────────────────────────────────────
  // Run: expo install expo-image-picker  (then this will work automatically)
  const handlePickImage = async () => {
    try {
      const ImagePicker = require('expo-image-picker');
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) return;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });
      if (!result.canceled && result.assets?.length) {
        setAvatar(result.assets[0].uri);
      }
    } catch {
      // expo-image-picker not yet installed — run: expo install expo-image-picker
    }
  };

  const fields = VIEW_FIELDS(driver);

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <SafeAreaView edges={['top']} style={s.header}>
          <TouchableOpacity style={s.hamburgerBtn} onPress={() => setDrawerOpen(true)} activeOpacity={0.7}>
            <Text style={s.hamburgerIcon}>☰</Text>
          </TouchableOpacity>
          <StatusBadge status={kycStatus} onPress={() => kycStatus === 'not_verified' && setKycConfirm(true)} />
        </SafeAreaView>

        {/* ── Avatar ── */}
        <View style={s.avatarSection}>
          <View style={s.avatarWrap}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={s.avatarImg} />
            ) : (
              <View style={s.avatarPlaceholder}>
                <Text style={s.avatarLabel}>PHOTO</Text>
              </View>
            )}
            <TouchableOpacity style={s.cameraBtn} onPress={handlePickImage} activeOpacity={0.8}>
              <Text style={s.cameraIcon}>📷</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Info Card ── */}
        <View style={s.infoCard}>
          {/* Pen icon */}
          <TouchableOpacity style={s.editIconBtn} onPress={openSheet} activeOpacity={0.75}>
            <Text style={s.editIcon}>✏️</Text>
          </TouchableOpacity>

          {fields.map((field, i) => (
            <View key={field.label}>
              <View style={s.fieldRow}>
                <Text style={s.fieldLabel}>{field.label}</Text>
                <Text style={[s.fieldValue, field.isPassword && s.fieldDots]}>
                  {field.value}
                </Text>
              </View>
              {i < fields.length - 1 && <View style={s.divider} />}
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── KYC Confirmation Modal ── */}
      <Modal
        visible={kycConfirm}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setKycConfirm(false)}
      >
        <View style={s.kycOverlay}>
          <View style={s.kycPopup}>
            {/* Icon */}
            <View style={s.kycIconWrap}>
              <Text style={s.kycIcon}>🪪</Text>
            </View>
            <Text style={s.kycPopupTitle}>Verify Your Identity</Text>
            <Text style={s.kycPopupMsg}>
              Complete KYC verification to get approved as a delivery driver.
            </Text>
            <View style={s.kycBtnRow}>
              <TouchableOpacity
                style={s.kycCancelBtn}
                onPress={() => setKycConfirm(false)}
                activeOpacity={0.75}
              >
                <Text style={s.kycCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.kycContinueBtn}
                onPress={() => {
                  setKycConfirm(false);
                  navigation.navigate('KycVerification');
                }}
                activeOpacity={0.85}
              >
                <Text style={s.kycContinueText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Drawer ── */}
      <DrawerMenu
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        navigation={navigation}
        activeScreen="DriverProfile"
        avatar={avatar}
        driverName={`${driver.firstName} ${driver.lastName}`}
        driverEmail={driver.email}
      />

      {/* ── Edit Bottom Sheet (Modal) ── */}
      <Modal
        visible={sheetOpen}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={closeSheet}
      >
        <View style={s.overlay}>
          {/* Backdrop */}
          <TouchableOpacity style={s.overlayBg} activeOpacity={1} onPress={closeSheet} />

          {/* Sheet */}
          <Animated.View style={[s.sheet, { transform: [{ translateY: slideAnim }] }]}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
              <View style={s.sheetHandle} />
              <Text style={s.sheetTitle}>Edit Profile</Text>

              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 40 }}
              >
                {EDIT_FIELDS.map(field => (
                  <View key={field.key} style={s.inputWrap}>
                    <Text style={[s.floatLabel, focused === field.key && s.floatLabelActive]}>
                      {field.label}
                    </Text>
                    <TextInput
                      style={[s.input, focused === field.key && s.inputFocused]}
                      value={editData[field.key] || ''}
                      onChangeText={text =>
                        setEditData(prev => ({ ...prev, [field.key]: text }))
                      }
                      secureTextEntry={field.secure}
                      keyboardType={field.keyboard || 'default'}
                      autoCapitalize="none"
                      onFocus={() => setFocused(field.key)}
                      onBlur={() => setFocused(null)}
                      placeholderTextColor="#C4C4CE"
                      placeholder={field.label}
                    />
                  </View>
                ))}

                <TouchableOpacity style={s.confirmBtn} onPress={handleConfirm} activeOpacity={0.85}>
                  <Text style={s.confirmText}>Confirm</Text>
                </TouchableOpacity>
              </ScrollView>
            </KeyboardAvoidingView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status, onPress }) {
  const cfg = KYC_BADGE[status] || KYC_BADGE.not_verified;
  const badge = (
    <View style={[
      bdg.pill,
      { backgroundColor: cfg.bg, borderColor: cfg.color },
      status === 'approved' && bdg.pillDark,
    ]}>
      <View style={[bdg.dot, { backgroundColor: cfg.color }]} />
      <Text style={[bdg.text, { color: cfg.textColor || cfg.color }]}>
        {cfg.label}
      </Text>
    </View>
  );

  if (cfg.tappable) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {badge}
      </TouchableOpacity>
    );
  }
  return badge;
}

const bdg = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1.5,
    gap: 6,
  },
  pillDark: { borderWidth: 0 },
  dot:  { width: 6, height: 6, borderRadius: 3 },
  text: { fontSize: 12, fontWeight: '700', letterSpacing: 0.3 },
});

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:          { flex: 1, backgroundColor: WHITE },
  scroll:        { flex: 1, backgroundColor: LIGHT_BG },
  scrollContent: { paddingBottom: 20 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: WHITE,
  },
  hamburgerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: LIGHT_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hamburgerIcon: { fontSize: 20, color: DARK_TEXT, lineHeight: 24 },
  // KYC Confirmation popup
  kycOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.52)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  kycPopup: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  kycIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(124,58,237,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  kycIcon:       { fontSize: 32 },
  kycPopupTitle: { fontSize: 20, fontWeight: '800', color: DARK_TEXT, marginBottom: 10, textAlign: 'center' },
  kycPopupMsg:   { fontSize: 14, color: GRAY_LABEL, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  kycBtnRow:     { flexDirection: 'row', gap: 12, width: '100%' },
  kycCancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: GRAY_DIV,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kycCancelText:   { fontSize: 15, fontWeight: '700', color: GRAY_LABEL },
  kycContinueBtn: {
    flex: 1,
    height: 50,
    borderRadius: 999,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  kycContinueText: { fontSize: 15, fontWeight: '800', color: WHITE },

  // Avatar
  avatarSection: {
    alignItems: 'center',
    backgroundColor: WHITE,
    paddingTop: 20,
    paddingBottom: 28,
  },
  avatarWrap: { position: 'relative' },
  avatarImg: {
    width: 112,
    height: 112,
    borderRadius: 18,
    ...CARD_SHADOW,
  },
  avatarPlaceholder: {
    width: 112,
    height: 112,
    borderRadius: 18,
    backgroundColor: '#E6E5EC',
    justifyContent: 'center',
    alignItems: 'center',
    ...CARD_SHADOW,
  },
  avatarLabel: { color: '#9B9BB0', fontSize: 12, fontWeight: '700', letterSpacing: 1.5 },
  cameraBtn: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#DDD',
    ...CARD_SHADOW,
  },
  cameraIcon: { fontSize: 15 },

  // Info Card
  infoCard: {
    backgroundColor: WHITE,
    marginHorizontal: 16,
    marginTop: 6,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 6,
    ...CARD_SHADOW,
  },
  editIconBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: LIGHT_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: { fontSize: 16 },
  fieldRow: { paddingVertical: 13, paddingRight: 44 },
  fieldLabel: {
    fontSize: 10,
    color: GRAY_LABEL,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  fieldValue:  { fontSize: 15, color: DARK_TEXT, fontWeight: '700' },
  fieldDots:   { letterSpacing: 2.5, fontSize: 12, color: GRAY_LABEL },
  divider:     { height: 1, backgroundColor: GRAY_DIV },

  // Overlay + Sheet
  overlay: { flex: 1, justifyContent: 'flex-end' },
  overlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.48)',
  },
  sheet: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    maxHeight: SCREEN_HEIGHT * 0.88,
  },
  sheetHandle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DCDCE2',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 2,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: DARK_TEXT,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 22,
  },

  // Inputs
  inputWrap:       { marginBottom: 14 },
  floatLabel:      { fontSize: 12, color: GRAY_LABEL, fontWeight: '600', marginBottom: 7, letterSpacing: 0.2 },
  floatLabelActive:{ color: CORAL },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: '#E4E3EC',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: DARK_TEXT,
    backgroundColor: WHITE,
  },
  inputFocused: {
    borderColor: CORAL,
    shadowColor: CORAL,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 2,
  },

  // Confirm
  confirmBtn: {
    backgroundColor: DARK_CARD,
    height: 56,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  confirmText: { color: WHITE, fontSize: 16, fontWeight: '800', letterSpacing: 0.4 },
});
