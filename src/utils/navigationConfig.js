import { Platform } from 'react-native';
import COLORS from '../theme/colors';
import { getResponsiveFontSize } from './responsive';

/**
 * Standard Navigation Screen Options
 * 
 * These are the default options that should be applied to all screens
 * in the Stack Navigator. This ensures consistent header styling.
 * 
 * Use this in your Stack.Navigator screenOptions prop:
 * <Stack.Navigator screenOptions={getDefaultScreenOptions()}>
 */
export const getDefaultScreenOptions = () => ({
  headerStyle: {
    backgroundColor: COLORS.surface,
    height: Platform.OS === 'ios' ? 100 : 70,
  },
  headerTitleStyle: {
    fontSize: getResponsiveFontSize(17),
    fontWeight: '600',
    color: COLORS.text,
  },
  headerTintColor: COLORS.primary,
  headerBackTitleVisible: false,
  headerShadowVisible: false,
  animation: 'slide_from_right',
  headerLeftContainerStyle: {
    paddingLeft: 16,
    paddingTop: Platform.OS === 'ios' ? 12 : 3,
    paddingBottom: 3,
  },
  headerRightContainerStyle: {
    paddingRight: 16,
    paddingTop: Platform.OS === 'ios' ? 12 : 3,
    paddingBottom: 3,
  },
});

/**
 * Options for screens that should not have a header
 * Use for tab navigators or custom header screens
 */
export const noHeaderOptions = {
  headerShown: false,
};

/**
 * Options for modal presentation
 */
export const modalOptions = {
  presentation: 'modal',
  headerStyle: {
    backgroundColor: COLORS.surface,
  },
  headerTitleStyle: {
    fontSize: getResponsiveFontSize(17),
    fontWeight: '600',
    color: COLORS.text,
  },
  headerTintColor: COLORS.primary,
};

/**
 * Create screen options with a custom title
 * @param {string} title - Screen title
 * @param {object} additionalOptions - Additional options to merge
 */
export const createScreenOptions = (title, additionalOptions = {}) => ({
  title,
  ...additionalOptions,
});

/**
 * Validation helper to ensure screens follow the standard
 * Call this during development to check if a screen is properly configured
 */
export const validateScreenConfig = (screenName, options) => {
  if (__DEV__) {
    const warnings = [];
    
    if (!options.title && options.headerShown !== false) {
      warnings.push(`Screen "${screenName}" is missing a title`);
    }
    
    if (options.headerShown !== false) {
      if (!options.headerStyle || options.headerStyle.backgroundColor !== COLORS.surface) {
        warnings.push(`Screen "${screenName}" may not have standard header background`);
      }
    }
    
    if (warnings.length > 0) {
      console.warn(`Navigation Configuration Issues:\n${warnings.join('\n')}`);
    }
  }
  
  return options;
};

export default {
  getDefaultScreenOptions,
  noHeaderOptions,
  modalOptions,
  createScreenOptions,
  validateScreenConfig,
};
