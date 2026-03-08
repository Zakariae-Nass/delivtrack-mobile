import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.78, 300);

// ─── Design Tokens ────────────────────────────────────────────────────────────
const CORAL     = '#FF6B5B';
const DARK_CARD = '#1C1C1E';
const WHITE     = '#FFFFFF';
const LIGHT_BG  = '#F5F5F7';
const DARK_TEXT = '#1C1C1E';
const GRAY_LABEL= '#8E8EA0';
const GRAY_DIV  = '#ECECF0';
const RED       = '#EF4444';
const RED_BG    = 'rgba(239,68,68,0.08)';

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 4, height: 0 },
  shadowOpacity: 0.12,
  shadowRadius: 16,
  elevation: 16,
};

const MENU_ITEMS = [
  { key: 'LivreurHome',     label: 'Dashboard',        icon: '🏠' },
  { key: 'MesCandidatures', label: 'Mes Candidatures', icon: '📋' },
  { key: 'Wallet',          label: 'Mon Wallet',       icon: '💰' },
  { key: 'Screen3',         label: 'Screen 3',         icon: '🗂️' },
  { key: 'Screen4',         label: 'Screen 4',         icon: '⚙️' },
];

// ─── DrawerMenu ───────────────────────────────────────────────────────────────
export default function DrawerMenu({
  visible,
  onClose,
  navigation,
  activeScreen = 'LivreurHome',
  avatar       = null,
  driverName   = 'Youssef Benali',
  driverEmail  = 'youssef@delivtrack.ma',
}) {
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleNavigate = (screen) => {
    onClose();
    setTimeout(() => navigation.navigate(screen), 60);
  };

  const handleLogout = () => {
    onClose();
    setTimeout(() => navigation.replace('Login'), 60);
  };

  const initials = driverName
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={d.root}>
        {/* Dark overlay */}
        <Animated.View style={[d.overlay, { opacity: fadeAnim }]}>
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        </Animated.View>

        {/* Drawer panel */}
        <Animated.View style={[d.drawer, { transform: [{ translateX: slideAnim }] }]}>
          <SafeAreaView edges={['top', 'bottom']} style={d.drawerInner}>

            {/* ── Drawer Header ── */}
            <View style={d.drawerHeader}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={d.avatar} />
              ) : (
                <View style={d.avatarPlaceholder}>
                  <Text style={d.avatarInitials}>{initials}</Text>
                </View>
              )}
              <View style={d.userInfo}>
                <Text style={d.userName} numberOfLines={1}>{driverName}</Text>
                <Text style={d.userEmail} numberOfLines={1}>{driverEmail}</Text>
                <TouchableOpacity
                  style={d.profilePill}
                  onPress={() => handleNavigate('DriverProfile')}
                  activeOpacity={0.8}
                >
                  <Text style={d.profilePillText}>Profile</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Divider */}
            <View style={d.headerDivider} />

            {/* ── Menu Items ── */}
            <ScrollView style={d.menuScroll} showsVerticalScrollIndicator={false}>
              {MENU_ITEMS.map((item, i) => {
                const isActive = activeScreen === item.key;
                return (
                  <View key={item.key}>
                    <TouchableOpacity
                      style={[d.menuItem, isActive && d.menuItemActive]}
                      onPress={() => handleNavigate(item.key)}
                      activeOpacity={0.7}
                    >
                      <View style={[d.menuIconWrap, isActive && d.menuIconWrapActive]}>
                        <Text style={d.menuIcon}>{item.icon}</Text>
                      </View>
                      <Text style={[d.menuLabel, isActive && d.menuLabelActive]}>
                        {item.label}
                      </Text>
                      {isActive && <View style={d.activeBar} />}
                    </TouchableOpacity>
                    {i < MENU_ITEMS.length - 1 && <View style={d.itemDivider} />}
                  </View>
                );
              })}
            </ScrollView>

            {/* ── Log Out ── */}
            <View style={d.logoutSection}>
              <View style={d.headerDivider} />
              <TouchableOpacity style={d.logoutItem} onPress={handleLogout} activeOpacity={0.7}>
                <View style={d.logoutIconWrap}>
                  <Text style={d.menuIcon}>🚪</Text>
                </View>
                <Text style={d.logoutLabel}>Log Out</Text>
              </TouchableOpacity>
            </View>

          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const d = StyleSheet.create({
  root:    { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: DRAWER_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: WHITE,
    ...CARD_SHADOW,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  drawerInner: { flex: 1 },

  // Header
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
    paddingTop: 24,
    gap: 14,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 16,
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 16,
    backgroundColor: '#E6E5EC',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: '800',
    color: GRAY_LABEL,
  },
  userInfo:  { flex: 1, paddingTop: 4 },
  userName:  { fontSize: 16, fontWeight: '800', color: DARK_TEXT, marginBottom: 3 },
  userEmail: { fontSize: 12, color: GRAY_LABEL, marginBottom: 12 },
  profilePill: {
    alignSelf: 'flex-start',
    backgroundColor: LIGHT_BG,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: GRAY_DIV,
  },
  profilePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: DARK_TEXT,
  },

  headerDivider: { height: 1, backgroundColor: GRAY_DIV, marginHorizontal: 0 },

  // Menu
  menuScroll: { flex: 1 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 14,
    position: 'relative',
  },
  menuItemActive: {
    backgroundColor: 'rgba(255,107,91,0.06)',
  },
  menuIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: LIGHT_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconWrapActive: {
    backgroundColor: 'rgba(255,107,91,0.12)',
  },
  menuIcon:  { fontSize: 17 },
  menuLabel: { fontSize: 15, fontWeight: '600', color: DARK_TEXT, flex: 1 },
  menuLabelActive: { color: CORAL, fontWeight: '700' },
  activeBar: {
    position: 'absolute',
    right: 0,
    top: 8,
    bottom: 8,
    width: 3,
    borderRadius: 3,
    backgroundColor: CORAL,
  },
  itemDivider: { height: 1, backgroundColor: GRAY_DIV, marginLeft: 72 },

  // Logout
  logoutSection: { paddingBottom: 8 },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 14,
  },
  logoutIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: RED_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutLabel: { fontSize: 15, fontWeight: '700', color: RED },
});
