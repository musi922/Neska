const tintColorLight = '#00B4D8';
const tintColorDark = '#00B4D8';

export default {
  light: {
    text: '#1F2937',
    background: '#F9FAFB',
    tint: tintColorLight,
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorLight,
    accent: '#F97316',
    secondary: '#FFF',
    tertiary: '#EF4444',
    subtle: '#F3F4F6',
    card: '#FFFFFF',
    border: '#E5E7EB',
    notification: '#EF4444',
    online: '#4ADE80',
    shadow: 'rgba(0, 0, 0, 0.05)',
    translucent: 'rgba(255, 255, 255, 0.9)',
    gradient: {
      primary: ['#00B4D8', '#8B5CF6'],
      secondary: ['#FFF', '#00B4D8'],
      accent: ['#F97316', '#FB923C'],
    }
  },
  dark: {
    text: '#F9FAFB',
    background: '#111827',
    tint: tintColorDark,
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorDark,
    accent: '#FB923C',
    secondary: '#00B4D8',
    tertiary: '#EF4444',
    subtle: '#1F2937',
    card: '#1F2937',
    border: '#374151',
    notification: '#EF4444',
    online: '#4ADE80', 
    shadow: 'rgba(0, 0, 0, 0.25)',
    translucent: 'rgba(31, 41, 55, 0.9)',
    gradient: {
      primary: ['#8B5CF6', '#A78BFA'],
      secondary: ['#00B4D8', '#2DD4BF'],
      accent: ['#FB923C', '#FD9C58'],
    }
  },
};