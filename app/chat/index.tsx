import React from 'react';
import { View } from 'react-native';
import ChatScreen from '@/components/ChatScreen';
import { Stack } from 'expo-router';

export default function ChatIndex() {
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Chats',
        }}
      />
      <View style={{ flex: 1 }}>{/* Add your chat list here */}</View>
    </>
  );
}
