import 'react-native';

declare module 'react-native' {
  interface TextStyle {
    outlineStyle?: 'none' | 'solid' | 'dotted' | 'dashed';
    includeFontPadding?: boolean;
  }
}
