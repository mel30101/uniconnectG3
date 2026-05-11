// Stub component for NotificationCenter
// The real implementation uses web-only dependencies (lucide-react, framer-motion)
// This stub prevents TypeScript errors during mobile builds

import React from 'react';
import { View, Text } from 'react-native';

const NotificationCenter = () => {
  return (
    <View>
      <Text>NotificationCenter is web-only</Text>
    </View>
  );
};

export default NotificationCenter;
