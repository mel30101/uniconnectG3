import { ThemedText } from './ThemedText';
import { IconSymbol } from '../ui/IconSymbol';
import { useColorScheme } from 'react-native';
import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export function Collapsible({ children, title, disabled = false }: PropsWithChildren & { title: string; disabled?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? 'light';

  return (
    <View style={{ backgroundColor: 'transparent', opacity: disabled ? 0.6 : 1 }}>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => !disabled && setIsOpen((value) => !value)}
        activeOpacity={disabled ? 1 : 0.8}>

        <ThemedText type="defaultSemiBold" style={{ color: '#111827' }}>
          {title}
        </ThemedText>

        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color="#374151"
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />
      </TouchableOpacity>

      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  content: {
    marginTop: 6,
    paddingHorizontal: 8,
  },
});