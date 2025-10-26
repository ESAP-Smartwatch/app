import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import COLORS from '../theme/colors';

const Button = ({ title, onPress, style, textStyle, disabled = false }) => {
  return (
    <TouchableOpacity
      style={[styles.button, style, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  text: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  disabled: {
    backgroundColor: COLORS.textTertiary,
    opacity: 0.6,
  },
});

export default Button;
