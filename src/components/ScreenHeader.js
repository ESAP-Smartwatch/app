import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CONTENT_PADDING, getResponsiveFontSize } from '../utils/responsive';
import COLORS from '../theme/colors';

/**
 * Standardized Screen Header Component
 * 
 * Use this component for consistent header styling across all screens.
 * This ensures proper padding, typography, and responsive design.
 * 
 * @param {string} title - Main header title (required)
 * @param {string} subtitle - Optional subtitle text
 * @param {function} onBack - Optional back button handler (if not using navigation header)
 * @param {React.ReactNode} rightComponent - Optional right-side component (e.g., button, icon)
 * @param {object} style - Additional styles to apply to container
 */
const ScreenHeader = ({ 
  title, 
  subtitle, 
  onBack, 
  rightComponent,
  style 
}) => {
  return (
    <View style={[styles.container, style]}>
      {onBack && (
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      )}
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
      </View>

      {rightComponent && (
        <View style={styles.rightContainer}>
          {rightComponent}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: CONTENT_PADDING.horizontal,
    paddingTop: CONTENT_PADDING.top,
    paddingBottom: CONTENT_PADDING.vertical,
    backgroundColor: COLORS.surface,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: getResponsiveFontSize(28),
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: getResponsiveFontSize(16),
    color: COLORS.textSecondary,
  },
  rightContainer: {
    position: 'absolute',
    right: CONTENT_PADDING.horizontal,
    top: CONTENT_PADDING.top,
  },
});

export default ScreenHeader;
