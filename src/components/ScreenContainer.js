import React from 'react';
import { ScrollView, View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { CONTENT_PADDING, getContainerStyle } from '../utils/responsive';
import COLORS from '../theme/colors';

/**
 * Standardized Screen Container Component
 * 
 * Use this as the root component for all screens to ensure:
 * - Consistent padding across all device sizes
 * - Proper keyboard handling
 * - Responsive design on tablets
 * - Uniform background colors
 * 
 * @param {React.ReactNode} children - Screen content
 * @param {boolean} scrollable - Whether content should be scrollable (default: true)
 * @param {boolean} keyboardAware - Whether to handle keyboard (default: true)
 * @param {object} contentContainerStyle - Additional styles for content container
 * @param {object} style - Additional styles for outer container
 * @param {string} backgroundColor - Background color (default: COLORS.background)
 * @param {boolean} noPadding - Remove default padding (default: false)
 */
const ScreenContainer = ({ 
  children, 
  scrollable = true,
  keyboardAware = true,
  contentContainerStyle,
  style,
  backgroundColor = COLORS.background,
  noPadding = false,
}) => {
  const containerStyles = [
    styles.container,
    { backgroundColor },
    !noPadding && styles.padding,
    getContainerStyle(), // Responsive tablet centering
    style,
  ];

  const content = scrollable ? (
    <ScrollView
      style={containerStyles}
      contentContainerStyle={[
        styles.scrollContent,
        contentContainerStyle
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={containerStyles}>
      {children}
    </View>
  );

  if (keyboardAware && Platform.OS === 'ios') {
    return (
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        {content}
      </KeyboardAvoidingView>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  padding: {
    paddingTop: CONTENT_PADDING.top,
  },
  scrollContent: {
    flexGrow: 1,
  },
  keyboardView: {
    flex: 1,
  },
});

export default ScreenContainer;
