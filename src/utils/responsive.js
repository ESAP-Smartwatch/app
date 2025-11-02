import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// iPhone models reference
// iPhone SE: 375 x 667
// iPhone 8: 375 x 667
// iPhone X/11 Pro: 375 x 812
// iPhone 11/XR: 414 x 896
// iPhone 12/13 Pro: 390 x 844
// iPhone 12/13 Pro Max: 428 x 926
// iPhone 14/15 Pro: 393 x 852
// iPhone 14/15 Pro Max: 430 x 932
// iPad Mini: 768 x 1024
// iPad Air/Pro: 820 x 1180

export const isSmallDevice = SCREEN_WIDTH < 375;
export const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
export const isLargeDevice = SCREEN_WIDTH >= 414;
export const isTablet = SCREEN_WIDTH >= 768;

// Responsive padding based on device size
export const getResponsivePadding = (base = 20) => {
  if (isTablet) return base * 1.5;
  if (isSmallDevice) return base * 0.85;
  return base;
};

// Responsive font size
export const getResponsiveFontSize = (size) => {
  if (isTablet) return size * 1.2;
  if (isSmallDevice) return size * 0.9;
  return size;
};

// Safe area padding for headers
export const getHeaderPadding = () => {
  if (Platform.OS === 'ios') {
    // Account for notch/dynamic island on newer iPhones
    if (SCREEN_HEIGHT >= 812) {
      return 20; // Has notch/dynamic island
    }
    return 20; // Older iPhones
  }
  return 16; // Android
};

// Content padding that works well on all devices
export const CONTENT_PADDING = {
  horizontal: getResponsivePadding(20),
  vertical: getResponsivePadding(16),
  top: getHeaderPadding(),
};

// Card spacing
export const CARD_MARGIN = getResponsivePadding(16);
export const CARD_PADDING = getResponsivePadding(16);

// Maximum content width for tablets
export const MAX_CONTENT_WIDTH = 600;

// Get container style for centered content on tablets
export const getContainerStyle = () => {
  if (isTablet) {
    return {
      alignSelf: 'center',
      width: '100%',
      maxWidth: MAX_CONTENT_WIDTH,
    };
  }
  return {};
};

export default {
  isSmallDevice,
  isMediumDevice,
  isLargeDevice,
  isTablet,
  getResponsivePadding,
  getResponsiveFontSize,
  getHeaderPadding,
  CONTENT_PADDING,
  CARD_MARGIN,
  CARD_PADDING,
  MAX_CONTENT_WIDTH,
  getContainerStyle,
};
