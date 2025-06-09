import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Wallet,
  CreditCard,
  Smartphone,
  Gift,
  Crown,
  Zap,
  Star,
  Heart,
  Sparkles,
  Plus,
  ArrowRight,
  History,
  Settings
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { FontFamily, FontSize, Spacing } from '@/constants/Theme';

// Mock data for coins packages
const coinPackages = [
  { id: '1', coins: 100, price: 0.99, bonus: 0, popular: false },
  { id: '2', coins: 500, price: 4.99, bonus: 50, popular: false },
  { id: '3', coins: 1000, price: 9.99, bonus: 150, popular: true },
  { id: '4', coins: 2500, price: 19.99, bonus: 500, popular: false },
  { id: '5', coins: 5000, price: 39.99, bonus: 1200, popular: false },
  { id: '6', coins: 10000, price: 79.99, bonus: 3000, popular: false },
];

// Mock data for gifts
const giftCategories = [
  {
    id: '1',
    name: 'Basic',
    gifts: [
      { id: '1', name: 'Heart', icon: '❤️', cost: 1 },
      { id: '2', name: 'Thumbs Up', icon: '👍', cost: 5 },
      { id: '3', name: 'Clap', icon: '👏', cost: 10 },
      { id: '4', name: 'Fire', icon: '🔥', cost: 20 },
    ]
  },
  {
    id: '2',
    name: 'Premium',
    gifts: [
      { id: '5', name: 'Rose', icon: '🌹', cost: 50 },
      { id: '6', name: 'Diamond', icon: '💎', cost: 100 },
      { id: '7', name: 'Crown', icon: '👑', cost: 200 },
      { id: '8', name: 'Rocket', icon: '🚀', cost: 500 },
    ]
  }
];

const paymentMethods = [
  { id: '1', name: 'Credit Card', icon: CreditCard, subtitle: 'Visa, Mastercard, Amex' },
  { id: '2', name: 'Mobile Money', icon: Smartphone, subtitle: 'MTN, Airtel, Tigo' },
  { id: '3', name: 'Bank Transfer', icon: Wallet, subtitle: 'Direct bank transfer' },
];

export default function MoneyScreen() {
  const [selectedPackage, setSelectedPackage] = useState('3');
  const [selectedPayment, setSelectedPayment] = useState('1');
  const [customAmount, setCustomAmount] = useState('');
  const [activeTab, setActiveTab] = useState('buy'); // 'buy', 'gifts', 'history'
  const [userBalance, setUserBalance] = useState(1250);
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const handlePurchase = () => {
    const selectedPkg = coinPackages.find(pkg => pkg.id === selectedPackage);
    if (selectedPkg) {
      Alert.alert(
        'Confirm Purchase',
        `Purchase ${selectedPkg.coins + selectedPkg.bonus} coins for $${selectedPkg.price}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Buy Now', 
            onPress: () => {
              setUserBalance(prev => prev + selectedPkg.coins + selectedPkg.bonus);
              Alert.alert('Success!', 'Coins added to your wallet!');
            }
          }
        ]
      );
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <LinearGradient
        colors={['#00B4D8', '#0077B6']}
        style={styles.balanceCard}
      >
        <View style={styles.balanceHeader}>
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceLabel}>Your Balance</Text>
            <View style={styles.balanceAmount}>
              <Sparkles size={20} color="#FFD700" />
              <Text style={styles.balanceText}>{userBalance.toLocaleString()}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.historyButton}>
            <History size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.balanceFooter}>
          <Text style={styles.balanceSubtext}>Neska Coins</Text>
          <TouchableOpacity>
            <Text style={styles.rewardText}>🎁 Daily Reward Available</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  const renderTabBar = () => (
    <View style={[styles.tabBar, { backgroundColor: colors.card }]}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'buy' && styles.activeTab]}
        onPress={() => setActiveTab('buy')}
      >
        <Plus size={20} color={activeTab === 'buy' ? '#00B4D8' : colors.text} />
        <Text style={[
          styles.tabText,
          { color: activeTab === 'buy' ? '#00B4D8' : colors.text }
        ]}>
          Buy Coins
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'gifts' && styles.activeTab]}
        onPress={() => setActiveTab('gifts')}
      >
        <Gift size={20} color={activeTab === 'gifts' ? '#00B4D8' : colors.text} />
        <Text style={[
          styles.tabText,
          { color: activeTab === 'gifts' ? '#00B4D8' : colors.text }
        ]}>
          Gifts
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'history' && styles.activeTab]}
        onPress={() => setActiveTab('history')}
      >
        <History size={20} color={activeTab === 'history' ? '#00B4D8' : colors.text} />
        <Text style={[
          styles.tabText,
          { color: activeTab === 'history' ? '#00B4D8' : colors.text }
        ]}>
          History
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderBuyCoins = () => (
    <View style={styles.content}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Choose Package
      </Text>
      <View style={styles.packagesGrid}>
        {coinPackages.map((pkg) => (
          <TouchableOpacity
            key={pkg.id}
            style={[
              styles.packageCard,
              { 
                backgroundColor: colors.card,
                borderColor: selectedPackage === pkg.id ? '#00B4D8' : colors.border
              },
              selectedPackage === pkg.id && styles.selectedPackage,
              pkg.popular && styles.popularPackage
            ]}
            onPress={() => setSelectedPackage(pkg.id)}
          >
            {pkg.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>POPULAR</Text>
              </View>
            )}
            <View style={styles.packageHeader}>
              <Sparkles size={24} color="#FFD700" />
              <Text style={[styles.packageCoins, { color: colors.text }]}>
                {pkg.coins.toLocaleString()}
              </Text>
            </View>
            {pkg.bonus > 0 && (
              <View style={styles.bonusContainer}>
                <Text style={styles.bonusText}>+{pkg.bonus} Bonus</Text>
              </View>
            )}
            <View style={styles.packageFooter}>
              <Text style={styles.packagePrice}>${pkg.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Payment Method
      </Text>
      <View style={styles.paymentMethods}>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.paymentMethod,
              { 
                backgroundColor: colors.card,
                borderColor: selectedPayment === method.id ? '#00B4D8' : colors.border
              },
              selectedPayment === method.id && styles.selectedPayment
            ]}
            onPress={() => setSelectedPayment(method.id)}
          >
            <method.icon size={24} color={selectedPayment === method.id ? '#00B4D8' : colors.text} />
            <View style={styles.paymentInfo}>
              <Text style={[styles.paymentName, { color: colors.text }]}>
                {method.name}
              </Text>
              <Text style={[styles.paymentSubtitle, { color: colors.secondary }]}>
                {method.subtitle}
              </Text>
            </View>
            <ArrowRight size={20} color={colors.secondary} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.purchaseButton} onPress={handlePurchase}>
        <LinearGradient
          colors={['#00B4D8', '#0077B6']}
          style={styles.purchaseGradient}
        >
          <Text style={styles.purchaseText}>
            Buy {coinPackages.find(p => p.id === selectedPackage)?.coins || 0} Coins
          </Text>
          <Text style={styles.purchasePrice}>
            ${coinPackages.find(p => p.id === selectedPackage)?.price || 0}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderGifts = () => (
    <View style={styles.content}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Send Gifts to Creators
      </Text>
      {giftCategories.map((category) => (
        <View key={category.id} style={styles.giftCategory}>
          <Text style={[styles.categoryTitle, { color: colors.text }]}>
            {category.name}
          </Text>
          <View style={styles.giftsGrid}>
            {category.gifts.map((gift) => (
              <TouchableOpacity
                key={gift.id}
                style={[styles.giftCard, { backgroundColor: colors.card }]}
              >
                <Text style={styles.giftIcon}>{gift.icon}</Text>
                <Text style={[styles.giftName, { color: colors.text }]}>
                  {gift.name}
                </Text>
                <View style={styles.giftCost}>
                  <Sparkles size={12} color="#FFD700" />
                  <Text style={styles.giftCostText}>{gift.cost}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </View>
  );

  const renderHistory = () => (
    <View style={styles.content}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Transaction History
      </Text>
      <View style={[styles.historyCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.historyText, { color: colors.secondary }]}>
          No transactions yet
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 100 }
        ]}
      >
        {renderHeader()}
        {renderTabBar()}
        {activeTab === 'buy' && renderBuyCoins()}
        {activeTab === 'gifts' && renderGifts()}
        {activeTab === 'history' && renderHistory()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  balanceCard: {
    borderRadius: 20,
    padding: Spacing.lg,
    shadowColor: '#00B4D8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  balanceInfo: {
    flex: 1,
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
  },
  balanceAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  balanceText: {
    color: '#FFF',
    fontSize: FontSize.xl * 1.5,
    fontFamily: FontFamily.bold,
    marginLeft: Spacing.xs,
  },
  historyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
  },
  rewardText: {
    color: '#FFD700',
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    borderRadius: 15,
    padding: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: 'rgba(0, 180, 216, 0.1)',
  },
  tabText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    marginLeft: Spacing.xs,
  },
  content: {
    paddingHorizontal: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
    marginBottom: Spacing.md,
  },
  packagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  packageCard: {
    width: '48%',
    borderRadius: 15,
    borderWidth: 2,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    position: 'relative',
  },
  selectedPackage: {
    borderColor: '#00B4D8',
    backgroundColor: 'rgba(0, 180, 216, 0.05)',
  },
  popularPackage: {
    borderColor: '#FFD700',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: Spacing.md,
    backgroundColor: '#FFD700',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
  },
  popularText: {
    color: '#000',
    fontSize: 10,
    fontFamily: FontFamily.bold,
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  packageCoins: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    marginLeft: Spacing.xs,
  },
  bonusContainer: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: Spacing.sm,
  },
  bonusText: {
    color: '#FFF',
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
  },
  packageFooter: {
    alignItems: 'center',
  },
  packagePrice: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: '#00B4D8',
  },
  paymentMethods: {
    marginBottom: Spacing.xl,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  selectedPayment: {
    borderColor: '#00B4D8',
    backgroundColor: 'rgba(0, 180, 216, 0.05)',
  },
  paymentInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  paymentName: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
  },
  paymentSubtitle: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    marginTop: 2,
  },
  purchaseButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: Spacing.md,
  },
  purchaseGradient: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  purchaseText: {
    color: '#FFF',
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
  },
  purchasePrice: {
    color: '#FFF',
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    marginTop: 2,
  },
  giftCategory: {
    marginBottom: Spacing.xl,
  },
  categoryTitle: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    marginBottom: Spacing.md,
  },
  giftsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  giftCard: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 15,
    padding: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  giftIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  giftName: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  giftCost: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  giftCostText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    color: '#FFD700',
    marginLeft: 2,
  },
  historyCard: {
    padding: Spacing.lg,
    borderRadius: 15,
    alignItems: 'center',
  },
  historyText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
  },
});