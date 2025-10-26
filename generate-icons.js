const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// iOS App Icon sizes (2024/2025 requirements)
const iosSizes = [
  { size: 1024, name: 'AppIcon-1024.png', scale: 1 }, // App Store
  { size: 180, name: 'AppIcon-60@3x.png', scale: 3 },  // iPhone
  { size: 120, name: 'AppIcon-60@2x.png', scale: 2 },  // iPhone
  { size: 87, name: 'AppIcon-29@3x.png', scale: 3 },   // Settings
  { size: 58, name: 'AppIcon-29@2x.png', scale: 2 },   // Settings
  { size: 80, name: 'AppIcon-40@2x.png', scale: 2 },   // Spotlight
  { size: 120, name: 'AppIcon-40@3x.png', scale: 3 },  // Spotlight
  { size: 76, name: 'AppIcon-76.png', scale: 1 },      // iPad
  { size: 152, name: 'AppIcon-76@2x.png', scale: 2 },  // iPad
  { size: 167, name: 'AppIcon-83.5@2x.png', scale: 2 }, // iPad Pro
];

async function generateIcons() {
  const inputPath = path.join(__dirname, 'assets', 'appicon.png');
  const outputDir = path.join(__dirname, 'ios', 'FitnessTracker', 'Images.xcassets', 'AppIcon.appiconset');

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Generating iOS app icons...');

  for (const icon of iosSizes) {
    const outputPath = path.join(outputDir, icon.name);
    try {
      await sharp(inputPath)
        .resize(icon.size, icon.size, {
          fit: 'cover',
          position: 'center'
        })
        .png()
        .toFile(outputPath);
      console.log(`✓ Generated ${icon.name} (${icon.size}x${icon.size})`);
    } catch (error) {
      console.error(`✗ Failed to generate ${icon.name}:`, error.message);
    }
  }

  // Generate Contents.json for iOS
  const contentsJson = {
    images: [
      { size: '20x20', idiom: 'iphone', filename: 'AppIcon-40@2x.png', scale: '2x' },
      { size: '20x20', idiom: 'iphone', filename: 'AppIcon-40@3x.png', scale: '3x' },
      { size: '29x29', idiom: 'iphone', filename: 'AppIcon-29@2x.png', scale: '2x' },
      { size: '29x29', idiom: 'iphone', filename: 'AppIcon-29@3x.png', scale: '3x' },
      { size: '40x40', idiom: 'iphone', filename: 'AppIcon-40@2x.png', scale: '2x' },
      { size: '40x40', idiom: 'iphone', filename: 'AppIcon-40@3x.png', scale: '3x' },
      { size: '60x60', idiom: 'iphone', filename: 'AppIcon-60@2x.png', scale: '2x' },
      { size: '60x60', idiom: 'iphone', filename: 'AppIcon-60@3x.png', scale: '3x' },
      { size: '20x20', idiom: 'ipad', filename: 'AppIcon-40@2x.png', scale: '2x' },
      { size: '29x29', idiom: 'ipad', filename: 'AppIcon-29@2x.png', scale: '2x' },
      { size: '40x40', idiom: 'ipad', filename: 'AppIcon-40@2x.png', scale: '2x' },
      { size: '76x76', idiom: 'ipad', filename: 'AppIcon-76.png', scale: '1x' },
      { size: '76x76', idiom: 'ipad', filename: 'AppIcon-76@2x.png', scale: '2x' },
      { size: '83.5x83.5', idiom: 'ipad', filename: 'AppIcon-83.5@2x.png', scale: '2x' },
      { size: '1024x1024', idiom: 'ios-marketing', filename: 'AppIcon-1024.png', scale: '1x' }
    ],
    info: {
      version: 1,
      author: 'xcode'
    }
  };

  const contentsPath = path.join(outputDir, 'Contents.json');
  fs.writeFileSync(contentsPath, JSON.stringify(contentsJson, null, 2));
  console.log('✓ Generated Contents.json');

  console.log('\n✅ All icons generated successfully!');
}

generateIcons().catch(console.error);
