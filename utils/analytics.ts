interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

interface UserProperties {
  userId?: string;
  username?: string;
  email?: string;
  [key: string]: any;
}

class AnalyticsManager {
  private isEnabled: boolean = true;
  private userId?: string;
  private userProperties: UserProperties = {};

  // Initialize analytics
  init(config: { enabled?: boolean } = {}) {
    this.isEnabled = config.enabled ?? true;
    console.log('Analytics initialized:', { enabled: this.isEnabled });
  }

  // Set user identity
  identify(userId: string, properties: UserProperties = {}) {
    if (!this.isEnabled) return;
    
    this.userId = userId;
    this.userProperties = { ...properties, userId };
    
    console.log('User identified:', { userId, properties });
    // In production, send to analytics service
  }

  // Track events
  track(eventName: string, properties: Record<string, any> = {}) {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      name: eventName,
      properties: {
        ...properties,
        userId: this.userId,
        timestamp: Date.now(),
      },
      timestamp: Date.now(),
    };

    console.log('Event tracked:', event);
    // In production, send to analytics service
  }

  // Screen tracking
  screen(screenName: string, properties: Record<string, any> = {}) {
    this.track('Screen Viewed', {
      screen: screenName,
      ...properties,
    });
  }

  // User actions
  userAction(action: string, properties: Record<string, any> = {}) {
    this.track('User Action', {
      action,
      ...properties,
    });
  }

  // App lifecycle events
  appLaunched() {
    this.track('App Launched');
  }

  appBackgrounded() {
    this.track('App Backgrounded');
  }

  appForegrounded() {
    this.track('App Foregrounded');
  }

  // Social actions
  postCreated(postType: string, properties: Record<string, any> = {}) {
    this.track('Post Created', {
      postType,
      ...properties,
    });
  }

  postLiked(postId: string, postType: string) {
    this.track('Post Liked', {
      postId,
      postType,
    });
  }

  postShared(postId: string, shareMethod: string) {
    this.track('Post Shared', {
      postId,
      shareMethod,
    });
  }

  commentAdded(postId: string, commentLength: number) {
    this.track('Comment Added', {
      postId,
      commentLength,
    });
  }

  userFollowed(followedUserId: string) {
    this.track('User Followed', {
      followedUserId,
    });
  }

  messagesSent(messageType: string, recipientId: string) {
    this.track('Message Sent', {
      messageType,
      recipientId,
    });
  }

  liveStreamStarted(category: string) {
    this.track('Live Stream Started', {
      category,
    });
  }

  liveStreamJoined(streamId: string, streamerUserId: string) {
    this.track('Live Stream Joined', {
      streamId,
      streamerUserId,
    });
  }

  // Error tracking
  error(error: Error, context: Record<string, any> = {}) {
    this.track('Error Occurred', {
      error: error.message,
      stack: error.stack,
      ...context,
    });
  }

  // Performance tracking
  performance(metric: string, value: number, unit: string = 'ms') {
    this.track('Performance Metric', {
      metric,
      value,
      unit,
    });
  }

  // Reset user data (on logout)
  reset() {
    this.userId = undefined;
    this.userProperties = {};
    console.log('Analytics reset');
  }

  // Enable/disable analytics
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    console.log('Analytics enabled:', enabled);
  }
}

export const Analytics = new AnalyticsManager();

// Event names constants
export const ANALYTICS_EVENTS = {
  // App lifecycle
  APP_LAUNCHED: 'App Launched',
  APP_BACKGROUNDED: 'App Backgrounded',
  APP_FOREGROUNDED: 'App Foregrounded',
  
  // Authentication
  LOGIN_ATTEMPTED: 'Login Attempted',
  LOGIN_SUCCESS: 'Login Success',
  LOGIN_FAILED: 'Login Failed',
  LOGOUT: 'Logout',
  SIGNUP_ATTEMPTED: 'Signup Attempted',
  SIGNUP_SUCCESS: 'Signup Success',
  
  // Content
  POST_CREATED: 'Post Created',
  POST_VIEWED: 'Post Viewed',
  POST_LIKED: 'Post Liked',
  POST_SHARED: 'Post Shared',
  COMMENT_ADDED: 'Comment Added',
  
  // Social
  USER_FOLLOWED: 'User Followed',
  USER_UNFOLLOWED: 'User Unfollowed',
  PROFILE_VIEWED: 'Profile Viewed',
  
  // Messaging
  MESSAGE_SENT: 'Message Sent',
  VOICE_MESSAGE_SENT: 'Voice Message Sent',
  CHAT_OPENED: 'Chat Opened',
  
  // Live streaming
  LIVE_STREAM_STARTED: 'Live Stream Started',
  LIVE_STREAM_JOINED: 'Live Stream Joined',
  LIVE_STREAM_ENDED: 'Live Stream Ended',
  
  // Monetization
  COINS_PURCHASED: 'Coins Purchased',
  GIFT_SENT: 'Gift Sent',
  CREATOR_SUPPORTED: 'Creator Supported',
  
  // Errors
  ERROR_OCCURRED: 'Error Occurred',
  CRASH: 'Crash',
} as const;