import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Compass, Plus, Play, LayoutGrid, DollarSign ,Search} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { BlurView } from 'expo-blur';
import { Spacing } from '@/constants/Theme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const tabBarHeight = 68 + (Platform.OS === 'ios' ? insets.bottom : 0);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarShowLabel: true,
        tabBarStyle: {
          ...styles.tabBar,
          height: tabBarHeight,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : Spacing.md,
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.card,
          borderTopColor: Platform.OS === 'ios' ? 'transparent' : colors.border,
        },
        tabBarBackground: () => 
          Platform.OS === 'ios' ? (
            <BlurView 
              tint={colorScheme === 'dark' ? 'dark' : 'light'}
              intensity={80} 
              style={StyleSheet.absoluteFill}
            />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stream"
        options={{
          title: 'Stream',
          tabBarIcon: ({ color, size }) => (
            <Play size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          title: 'Post',
          tabBarIcon: ({ color }) => (
            <View style={styles.postButton}>
              <Plus size={26} color="#FFF" />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Search size={size} color={color}/>
          ),
        }}
      />
      <Tabs.Screen
        name="reels"
        options={{
          title: 'Reels',
          tabBarIcon: ({ color, size }) => (
            <LayoutGrid size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="money"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color, size }) => (
            <DollarSign size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 16,
  },
  postButton: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginTop: 20,
    backgroundColor: '#00B4D8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00B4D8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});