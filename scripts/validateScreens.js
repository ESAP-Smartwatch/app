/**
 * Screen Standards Validation Script
 * 
 * This script checks if all screens in the app follow the standardization guidelines.
 * Run this during development to ensure consistency.
 * 
 * Usage: node scripts/validateScreens.js
 */

const fs = require('fs');
const path = require('path');

const SCREENS_DIR = path.join(__dirname, '../src/screens');
const APP_FILE = path.join(__dirname, '../App.js');

const issues = [];

// Check if screen files use ScreenContainer
function checkScreenFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  
  const checks = {
    hasScreenContainer: content.includes('ScreenContainer'),
    hasResponsiveImport: content.includes('from \'../utils/responsive\''),
    hasHardcodedPadding: /paddingTop:\s*\d+/.test(content) && !content.includes('Platform.OS'),
    hasHardcodedFontSize: /fontSize:\s*\d+/.test(content) && !content.includes('getResponsiveFontSize'),
  };
  
  if (!checks.hasScreenContainer && !fileName.includes('Screen.js')) {
    issues.push(`⚠️  ${fileName}: Not using ScreenContainer component`);
  }
  
  if (!checks.hasResponsiveImport && fileName.includes('Screen.js')) {
    issues.push(`📱 ${fileName}: Not importing responsive utilities`);
  }
  
  if (checks.hasHardcodedPadding) {
    issues.push(`📏 ${fileName}: Has hardcoded padding values (use CONTENT_PADDING)`);
  }
  
  if (checks.hasHardcodedFontSize) {
    issues.push(`🔤 ${fileName}: Has hardcoded font sizes (use getResponsiveFontSize())`);
  }
}

// Check App.js navigation configuration
function checkAppNavigation() {
  const content = fs.readFileSync(APP_FILE, 'utf8');
  
  if (!content.includes('getDefaultScreenOptions')) {
    issues.push(`🚨 App.js: Not using getDefaultScreenOptions() for Stack.Navigator`);
  }
  
  if (!content.includes('noHeaderOptions')) {
    issues.push(`📋 App.js: Consider using noHeaderOptions constant`);
  }
  
  // Check for inconsistent header configurations
  const screenOptionMatches = content.match(/options=\{\{[^}]+\}\}/g) || [];
  screenOptionMatches.forEach(match => {
    if (match.includes('headerShown: false') && !match.includes('noHeaderOptions')) {
      issues.push(`🔧 App.js: Found hardcoded headerShown: false (use noHeaderOptions)`);
    }
  });
}

// Main validation
console.log('🔍 Validating screen standards...\n');

// Check all screen files
const screenFiles = fs.readdirSync(SCREENS_DIR).filter(f => f.endsWith('.js'));
screenFiles.forEach(file => {
  checkScreenFile(path.join(SCREENS_DIR, file));
});

// Check App.js
checkAppNavigation();

// Report results
if (issues.length === 0) {
  console.log('✅ All screens follow the standardization guidelines!\n');
  console.log('📊 Summary:');
  console.log(`   - ${screenFiles.length} screens validated`);
  console.log('   - 0 issues found');
  console.log('\n🎉 Great job maintaining consistency!');
} else {
  console.log('❌ Found some issues that should be addressed:\n');
  issues.forEach(issue => console.log(`   ${issue}`));
  console.log(`\n📊 Summary:`);
  console.log(`   - ${screenFiles.length} screens validated`);
  console.log(`   - ${issues.length} issues found`);
  console.log('\n📖 See HEADER_STANDARDS.md for guidance on fixes.');
  process.exit(1);
}
