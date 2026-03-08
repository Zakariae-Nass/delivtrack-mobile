import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOCK_COMMANDES_LIVREUR, MOCK_STATS_LIVREUR } from '../../config/mockData';
import DrawerMenu from '../../components/DrawerMenu';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const CORAL        = '#FF6B5B';
const DARK_CARD    = '#1C1C1E';
const WHITE        = '#FFFFFF';
const LIGHT_BG     = '#F5F5F7';
const DARK_TEXT    = '#1C1C1E';
const GRAY_LABEL   = '#8E8EA0';
const GRAY_DIV     = '#ECECF0';
const SUCCESS      = '#22C55E';
const SUCCESS_BG   = 'rgba(34,197,94,0.10)';
const SUCCESS_BORDER = 'rgba(34,197,94,0.30)';
const ERROR        = '#EF4444';
const ERROR_BG     = 'rgba(239,68,68,0.10)';
const WARNING      = '#F59E0B';

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.07,
  shadowRadius: 14,
  elevation: 5,
};

const VEHICLE_ICONS = {
  moto:        '🛵',
  voiture:     '🚗',
  camionnette: '🚐',
};

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function LivreurHomeScreen({ navigation }) {
  const [isOnline,   setIsOnline]   = useState(true);
  const [appliedIds, setAppliedIds] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
          {/* Hamburger */}
          <TouchableOpacity style={s.hamburgerBtn} onPress={() => setDrawerOpen(true)} activeOpacity={0.7}>
            <Text style={s.hamburgerIcon}>☰</Text>
          </TouchableOpacity>

          <View style={s.headerCenter}>
            <Text style={s.greeting}>Bonjour 👋</Text>
            <Text style={s.driverName}>Youssef Benali</Text>
          </View>

          <View style={s.headerRight}>
            <TouchableOpacity style={s.notifBtn}>
              <Text style={s.notifIcon}>🔔</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.avatarBtn}
              onPress={() => navigation.navigate('DriverProfile')}
              activeOpacity={0.8}
            >
              <Text style={s.avatarText}>YB</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* ── Status Toggle ── */}
        <View style={[s.statusCard, isOnline && s.statusCardOnline]}>
          <View style={s.statusLeft}>
            <View style={[s.statusDot, { backgroundColor: isOnline ? SUCCESS : GRAY_LABEL }]} />
            <View>
              <Text style={s.statusTitle}>
                {isOnline ? 'Disponible' : 'Hors ligne'}
              </Text>
              <Text style={s.statusSubtitle}>
                {isOnline
                  ? 'Vous recevez des commandes'
                  : 'Activez pour recevoir des commandes'}
              </Text>
            </View>
          </View>
          <Switch
            value={isOnline}
            onValueChange={setIsOnline}
            trackColor={{ false: GRAY_DIV, true: SUCCESS_BG }}
            thumbColor={isOnline ? SUCCESS : GRAY_LABEL}
            ios_backgroundColor={GRAY_DIV}
          />
        </View>

        {/* ── Stats Row ── */}
        <View style={s.statsRow}>
          <MiniStat icon="📦" label="Aujourd'hui"  value={`${MOCK_STATS_LIVREUR.commandesAujourdhui}`}  color={CORAL}   />
          <MiniStat icon="💰" label="Gains / jour"  value={`${MOCK_STATS_LIVREUR.gainsAujourdhui} MAD`} color={SUCCESS} />
          <MiniStat icon="⭐" label="Note"          value={`${MOCK_STATS_LIVREUR.note}/5`}              color={WARNING} />
        </View>

        {/* ── Earnings Card ── */}
        <View style={s.earningsCard}>
          <View>
            <Text style={s.earningsLabel}>Gains cette semaine</Text>
            <Text style={s.earningsValue}>{MOCK_STATS_LIVREUR.gainsSemaine} MAD</Text>
          </View>
          <View style={s.earningsDivider} />
          <View style={s.earningsRight}>
            <Text style={s.earningsLabel}>Total livraisons</Text>
            <Text style={s.totalValue}>{MOCK_STATS_LIVREUR.totalLivraisons} 🏆</Text>
          </View>
        </View>

        {/* ── Orders Section ── */}
        {isOnline ? (
          <>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Commandes disponibles</Text>
              <View style={s.liveBadge}>
                <View style={s.liveDot} />
                <Text style={s.liveText}>LIVE</Text>
              </View>
            </View>

            <View style={s.ordersList}>
              {MOCK_COMMANDES_LIVREUR.map(commande => (
                <OrderCard
                  key={commande.id}
                  commande={commande}
                  applied={appliedIds.includes(commande.id)}
                  onApply={() => setAppliedIds(prev => [...prev, commande.id])}
                />
              ))}
            </View>
          </>
        ) : (
          <View style={s.offlineBox}>
            <Text style={s.offlineEmoji}>😴</Text>
            <Text style={s.offlineTitle}>Vous êtes hors ligne</Text>
            <Text style={s.offlineSub}>
              Activez le switch ci-dessus pour commencer à recevoir des commandes.
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Drawer ── */}
      <DrawerMenu
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        navigation={navigation}
        activeScreen="LivreurHome"
        driverName="Youssef Benali"
        driverEmail="youssef@delivtrack.ma"
      />
    </View>
  );
}

// ─── Mini Stat Card ───────────────────────────────────────────────────────────
function MiniStat({ icon, label, value, color }) {
  return (
    <View style={stat.card}>
      <Text style={stat.icon}>{icon}</Text>
      <Text style={[stat.value, { color }]}>{value}</Text>
      <Text style={stat.label}>{label}</Text>
    </View>
  );
}

// ─── Order Card ───────────────────────────────────────────────────────────────
function OrderCard({ commande, applied, onApply }) {
  return (
    <View style={card.wrap}>
      {/* Header row */}
      <View style={card.header}>
        <View style={card.agenceRow}>
          <View style={card.vehicleIconWrap}>
            <Text style={card.vehicleIcon}>
              {VEHICLE_ICONS[commande.vehiculeType] || '📦'}
            </Text>
          </View>
          <View>
            <Text style={card.agenceName}>{commande.agence}</Text>
            <Text style={card.orderId}>#CMD-{commande.id.padStart(4, '0')}</Text>
          </View>
        </View>
        <View style={card.pricePill}>
          <Text style={card.price}>{commande.prix}</Text>
          <Text style={card.priceUnit}> MAD</Text>
        </View>
      </View>

      <View style={card.divider} />

      {/* Addresses */}
      <View style={card.addressSection}>
        <View style={card.addressRow}>
          <View style={[card.dot, { backgroundColor: CORAL }]} />
          <Text style={card.addressText} numberOfLines={1}>{commande.pickupAdresse}</Text>
        </View>
        <View style={card.addressLine} />
        <View style={card.addressRow}>
          <View style={[card.dot, { backgroundColor: SUCCESS }]} />
          <Text style={card.addressText} numberOfLines={1}>{commande.depotAdresse}</Text>
        </View>
      </View>

      {/* Meta badges */}
      <View style={card.metaRow}>
        <View style={card.metaBadge}>
          <Text style={card.metaText}>📍 {commande.distance} km</Text>
        </View>
        <View style={card.metaBadge}>
          <Text style={card.metaText}>⏱ {commande.tempsEstime}</Text>
        </View>
        <Text style={card.description} numberOfLines={1}>{commande.description}</Text>
      </View>

      {/* Postuler / Applied */}
      {applied ? (
        <View style={card.appliedBox}>
          <Text style={card.appliedText}>✅ Candidature envoyée — En attente de sélection...</Text>
        </View>
      ) : (
        <TouchableOpacity style={card.acceptBtn} onPress={onApply} activeOpacity={0.85}>
          <Text style={card.acceptBtnText}>Postuler →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:          { flex: 1, backgroundColor: WHITE },
  scroll:        { flex: 1, backgroundColor: LIGHT_BG },
  scrollContent: { paddingBottom: 20 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: WHITE,
    gap: 10,
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
  headerCenter:  { flex: 1 },
  greeting:      { fontSize: 12, color: GRAY_LABEL, fontWeight: '500', marginBottom: 2 },
  driverName:    { fontSize: 18, fontWeight: '800', color: DARK_TEXT },
  headerRight:   { flexDirection: 'row', alignItems: 'center', gap: 8 },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: LIGHT_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifIcon: { fontSize: 18 },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(34,197,94,0.12)',
    borderWidth: 1.5,
    borderColor: SUCCESS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: SUCCESS, fontWeight: '800', fontSize: 13 },

  // Status Card
  statusCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: WHITE,
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: GRAY_DIV,
    ...CARD_SHADOW,
  },
  statusCardOnline:  { borderColor: SUCCESS_BORDER, backgroundColor: SUCCESS_BG },
  statusLeft:        { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusDot:         { width: 10, height: 10, borderRadius: 5 },
  statusTitle:       { fontSize: 15, fontWeight: '700', color: DARK_TEXT },
  statusSubtitle:    { fontSize: 11, color: GRAY_LABEL, marginTop: 2 },

  // Stats
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 14,
  },

  // Earnings
  earningsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    marginHorizontal: 16,
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: SUCCESS,
    ...CARD_SHADOW,
  },
  earningsLabel:   { fontSize: 11, color: GRAY_LABEL, fontWeight: '500', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.4 },
  earningsValue:   { fontSize: 22, fontWeight: '800', color: SUCCESS },
  earningsDivider: { width: 1, height: 40, backgroundColor: GRAY_DIV, marginHorizontal: 20 },
  earningsRight:   { flex: 1 },
  totalValue:      { fontSize: 18, fontWeight: '800', color: DARK_TEXT },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: DARK_TEXT },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ERROR_BG,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 5,
  },
  liveDot:  { width: 6, height: 6, borderRadius: 3, backgroundColor: ERROR },
  liveText: { fontSize: 10, color: ERROR, fontWeight: '800', letterSpacing: 1 },

  ordersList: { paddingHorizontal: 16, gap: 12 },

  offlineBox:   { alignItems: 'center', paddingHorizontal: 32, paddingTop: 32 },
  offlineEmoji: { fontSize: 56, marginBottom: 16 },
  offlineTitle: { fontSize: 20, fontWeight: '700', color: DARK_TEXT, marginBottom: 8 },
  offlineSub:   { fontSize: 13, color: GRAY_LABEL, textAlign: 'center', lineHeight: 22 },
});

const stat = StyleSheet.create({
  card:  { flex: 1, backgroundColor: WHITE, borderRadius: 16, padding: 14, alignItems: 'center', ...CARD_SHADOW },
  icon:  { fontSize: 20, marginBottom: 6 },
  value: { fontSize: 15, fontWeight: '800', marginBottom: 2 },
  label: { fontSize: 10, color: GRAY_LABEL, textAlign: 'center', fontWeight: '500' },
});

const card = StyleSheet.create({
  wrap: { backgroundColor: WHITE, borderRadius: 20, padding: 16, ...CARD_SHADOW },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  agenceRow:      { flexDirection: 'row', alignItems: 'center', gap: 10 },
  vehicleIconWrap:{ width: 42, height: 42, borderRadius: 12, backgroundColor: LIGHT_BG, justifyContent: 'center', alignItems: 'center' },
  vehicleIcon:    { fontSize: 22 },
  agenceName:     { fontSize: 15, fontWeight: '700', color: DARK_TEXT },
  orderId:        { fontSize: 11, color: GRAY_LABEL, marginTop: 2 },
  pricePill: {
    backgroundColor: LIGHT_BG,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price:     { fontSize: 18, fontWeight: '800', color: CORAL },
  priceUnit: { fontSize: 11, color: GRAY_LABEL, fontWeight: '600' },
  divider:        { height: 1, backgroundColor: GRAY_DIV, marginBottom: 12 },
  addressSection: { marginBottom: 12 },
  addressRow:     { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot:            { width: 8, height: 8, borderRadius: 4 },
  addressLine:    { width: 1.5, height: 10, backgroundColor: GRAY_DIV, marginLeft: 3.5, marginVertical: 3 },
  addressText:    { flex: 1, fontSize: 13, color: DARK_TEXT, fontWeight: '500' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' },
  metaBadge:   { backgroundColor: LIGHT_BG, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  metaText:    { fontSize: 11, color: GRAY_LABEL, fontWeight: '600' },
  description: { flex: 1, fontSize: 11, color: GRAY_LABEL },
  acceptBtn: {
    backgroundColor: DARK_CARD,
    borderRadius: 999,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: DARK_CARD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  acceptBtnText: { color: WHITE, fontSize: 15, fontWeight: '700' },
  appliedBox: {
    backgroundColor: 'rgba(245,158,11,0.10)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.30)',
    alignItems: 'center',
  },
  appliedText: { color: WARNING, fontSize: 13, fontWeight: '600' },
});
