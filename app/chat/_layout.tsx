import { Stack } from 'expo-router';

export default function ChatLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: 'Chats',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          headerTitle: 'Chat',
          headerBackTitle: 'Back',
        }}
      />
    </Stack>
  );
}
