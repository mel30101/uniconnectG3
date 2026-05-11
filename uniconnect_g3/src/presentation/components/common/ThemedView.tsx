import { View, type ViewProps, useColorScheme } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = theme === 'light' ? lightColor : darkColor;
  const backgroundColor = colorFromProps ?? (theme === 'light' ? '#ffffff' : '#151718');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
