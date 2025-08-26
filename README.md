# GEN Z - Social Media Platform

A modern, feature-rich social media platform built with React Native and Expo, designed for the Gen Z audience.

## Features

### 🎯 Core Features
- **Multi-format Content**: Photos, videos, live streams, and stories
- **Real-time Chat**: Text, voice messages, and video calls
- **Live Streaming**: Interactive live broadcasts with viewer engagement
- **Social Features**: Follow, like, comment, share, and discover content
- **Monetization**: Virtual coins, gifts, and creator support
- **Advanced Camera**: Filters, effects, and professional editing tools

### 🚀 Technical Features
- **Cross-platform**: iOS, Android, and Web support
- **Real-time Communication**: WebSocket-based chat and notifications
- **Offline Support**: Cached content and offline-first approach
- **Performance Optimized**: Lazy loading, image optimization, and smooth animations
- **Accessibility**: Full accessibility support with screen readers
- **Analytics**: Comprehensive user behavior tracking

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **State Management**: React Context + Hooks
- **Styling**: StyleSheet with custom design system
- **Icons**: Lucide React Native
- **Fonts**: Google Fonts (Poppins, Montserrat)
- **Storage**: AsyncStorage
- **Media**: Expo Camera, AV, Media Library
- **Real-time**: WebSocket
- **Analytics**: Custom analytics system

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/genz-platform.git
cd genz-platform
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Run on your preferred platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web browser

### Environment Setup

Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_API_URL=https://api.genz.app
EXPO_PUBLIC_WEBSOCKET_URL=wss://ws.genz.app
EXPO_PUBLIC_ANALYTICS_KEY=your_analytics_key
```

## Project Structure

```
├── app/                    # App screens and navigation
│   ├── (tabs)/            # Tab-based screens
│   ├── _layout.tsx        # Root layout
│   └── +not-found.tsx     # 404 screen
├── components/            # Reusable UI components
├── constants/             # App constants (colors, theme, etc.)
├── contexts/              # React contexts
├── hooks/                 # Custom hooks
├── utils/                 # Utility functions
└── assets/               # Static assets
```

## Key Components

### Authentication
- JWT-based authentication
- Secure token storage
- Auto-refresh tokens
- Social login support

### Content Management
- Multi-format post creation
- Image/video processing
- Content moderation
- Draft saving

### Real-time Features
- WebSocket connections
- Live chat
- Push notifications
- Live streaming

### Monetization
- Virtual currency system
- Gift sending
- Creator monetization
- Payment processing

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React Native best practices
- Implement proper error handling
- Write comprehensive tests

### Performance
- Optimize images and media
- Implement lazy loading
- Use React.memo for expensive components
- Monitor bundle size

### Accessibility
- Add proper accessibility labels
- Support screen readers
- Ensure proper color contrast
- Test with accessibility tools

## Building for Production

### iOS
```bash
eas build --platform ios --profile production
```

### Android
```bash
eas build --platform android --profile production
```

### Web
```bash
npm run build:web
```

## Deployment

The app can be deployed to:
- **App Store** (iOS)
- **Google Play Store** (Android)
- **Web hosting** (Vercel, Netlify, etc.)
- **Expo Application Services** (EAS)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Email: support@genz.app
- Discord: [Join our community](https://discord.gg/genz)
- Documentation: [docs.genz.app](https://docs.genz.app)

## Roadmap

- [ ] AI-powered content recommendations
- [ ] Advanced video editing tools
- [ ] AR filters and effects
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Creator studio
- [ ] API for third-party integrations

---

Built with ❤️ for the Gen Z community