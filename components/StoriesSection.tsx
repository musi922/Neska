import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import ProfileSummary from './ProfileSummary';

interface StoriesSectionProps {
  stories: any[];
  onStoryPress: (story: any) => void;
}

const StoriesSection: React.FC<StoriesSectionProps> = ({
  stories,
  onStoryPress,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      >
        {stories.map((story) => (
          <View key={story.id} style={styles.storyItem}>
            <ProfileSummary
              avatar={story.avatar}
              username={story.username}
              isLive={story.isLive}
              onPress={() => onStoryPress(story)}
              orientation="horizontal"
              showStats={true}
              timestamp="2h ago"
              likes={24}
              comments={12}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  storyItem: {
    marginBottom: 8,
    width: '100%',
    paddingVertical: 4,
  },
});

export default StoriesSection;