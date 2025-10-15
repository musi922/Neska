import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

interface ChatListItemProps {
  id: string;
  name: string;
  lastMessage: string;
  avatar: string;
  timestamp: string;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  id,
  name,
  lastMessage,
  avatar,
  timestamp,
}) => {
  const router = useRouter();

  const handlePress = () => {
    console.log('Chat item clicked:', { id, name });
    try {
      router.push({
        pathname: '/chat/[id]',
        params: { id: id.toString() },
      });
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image source={{ uri: avatar }} style={styles.avatar} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
});

export default ChatListItem;
