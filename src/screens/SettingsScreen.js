import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, useColorScheme, Appearance } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CONTENT_PADDING, CARD_MARGIN, getContainerStyle, getResponsiveFontSize } from '../utils/responsive';

const SettingsScreen = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(colorScheme === 'dark');
  const [autoSyncEnabled, setAutoSyncEnabled] = React.useState(true);

  const handleNotificationToggle = (value) => {
    setNotificationsEnabled(value);
    // Just toggle, no popup
  };

  const handleDarkModeToggle = (value) => {
    setDarkModeEnabled(value);
    // Toggle appearance
    Appearance.setColorScheme(value ? 'dark' : 'light');
  };

  const handleAutoSyncToggle = (value) => {
    setAutoSyncEnabled(value);
    // Just toggle, no popup
  };

  const SettingRow = ({ icon, title, subtitle, rightComponent }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color="#007AFF" style={styles.settingIcon} />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Customize your experience</Text>
      </View>

      {/* General Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        
        <SettingRow
          icon="notifications"
          title="Notifications"
          subtitle="Workout reminders and achievements"
          rightComponent={
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: '#E5E5EA', true: '#34C759' }}
              thumbColor="#FFFFFF"
            />
          }
        />

        <SettingRow
          icon="moon"
          title="Dark Mode"
          subtitle="Use dark theme"
          rightComponent={
            <Switch
              value={darkModeEnabled}
              onValueChange={handleDarkModeToggle}
              trackColor={{ false: '#E5E5EA', true: '#34C759' }}
              thumbColor="#FFFFFF"
            />
          }
        />

        <SettingRow
          icon="sync"
          title="Auto Sync"
          subtitle="Automatically sync with devices"
          rightComponent={
            <Switch
              value={autoSyncEnabled}
              onValueChange={handleAutoSyncToggle}
              trackColor={{ false: '#E5E5EA', true: '#34C759' }}
              thumbColor="#FFFFFF"
            />
          }
        />
      </View>

      {/* Health Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Data</Text>
        
        <TouchableOpacity 
          style={styles.settingRow}
          onPress={() => navigation.navigate('UserProfile')}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="person" size={24} color="#007AFF" style={styles.settingIcon} />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>User Profile</Text>
              <Text style={styles.settingSubtitle}>Age, weight, gender, VO2 max</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingRow}
          onPress={() => navigation.navigate('Units')}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="body" size={24} color="#FF2D55" style={styles.settingIcon} />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Units</Text>
              <Text style={styles.settingSubtitle}>Metric (kg, cm)</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingRow}
          onPress={() => navigation.navigate('HeartRateZones')}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="heart" size={24} color="#FF2D55" style={styles.settingIcon} />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Heart Rate Zones</Text>
              <Text style={styles.settingSubtitle}>Customize your zones</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingRow}
          onPress={() => navigation.navigate('GoalSettings')}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="fitness" size={24} color="#5856D6" style={styles.settingIcon} />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Goal Settings</Text>
              <Text style={styles.settingSubtitle}>Set daily goals</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>
      </View>

      {/* Privacy & Security */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy & Security</Text>
        
        <TouchableOpacity 
          style={styles.settingRow}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="lock-closed" size={24} color="#FF9500" style={styles.settingIcon} />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Privacy</Text>
              <Text style={styles.settingSubtitle}>Control your data</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingRow}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="shield-checkmark" size={24} color="#34C759" style={styles.settingIcon} />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Security</Text>
              <Text style={styles.settingSubtitle}>App lock and permissions</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <TouchableOpacity 
          style={styles.settingRow}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="information-circle" size={24} color="#007AFF" style={styles.settingIcon} />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Version</Text>
              <Text style={styles.settingSubtitle}>1.0.0</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingRow}
          onPress={() => navigation.navigate('HelpSupport')}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="help-circle" size={24} color="#5856D6" style={styles.settingIcon} />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Help & Support</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    paddingHorizontal: CONTENT_PADDING.horizontal,
    paddingTop: 60,
    paddingBottom: CONTENT_PADDING.vertical,
    backgroundColor: '#FFFFFF',
    ...getContainerStyle(),
  },
  headerTitle: {
    fontSize: getResponsiveFontSize(34),
    fontWeight: '700',
    color: '#1D1D1F',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: getResponsiveFontSize(16),
    color: '#86868B',
    marginTop: 4,
  },
  section: {
    marginTop: CARD_MARGIN,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: CARD_MARGIN,
    overflow: 'hidden',
    ...getContainerStyle(),
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#86868B',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 17,
    fontWeight: '400',
    color: '#1D1D1F',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#86868B',
    marginTop: 2,
  },
});

export default SettingsScreen;
