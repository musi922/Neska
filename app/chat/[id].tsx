import React from 'react';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import ChatScreen from '@/components/ChatScreen';
import { Storage, STORAGE_KEYS } from '@/utils/storage';

export default function ChatDetail() {
  const { id } = useLocalSearchParams();
  const [currentUserId, setCurrentUserId] = React.useState<string>('');

  React.useEffect(() => {
    // Get real user ID from storage
    const getUserId = async () => {
      const userProfile = await Storage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (userProfile?.id) {
        setCurrentUserId(userProfile.id);
      }
    };
    getUserId();
  }, []);

  const mockUser = {
    id: id as string,
    username: 'User',
    avatar:
      'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg',
    isOnline: true,
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false, // This will hide the header
          animation: 'slide_from_right',
        }}
      />
      <ChatScreen
        user={mockUser}
        currentUserId={currentUserId}
        onBack={() => router.back()}
      />
    </>
  );
}
