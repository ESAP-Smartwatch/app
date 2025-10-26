import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AccountScreen = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showSignIn, setShowSignIn] = useState(true);

  // Sign In View
  if (!isSignedIn && showSignIn) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.authContainer}>
          <View style={styles.logoContainer}>
            <Ionicons name="fitness" size={80} color="#007AFF" />
            <Text style={styles.logoText}>Fitness Tracker</Text>
            <Text style={styles.logoSubtext}>Track your health journey</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Sign In</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={() => setIsSignedIn(true)}>
              <Text style={styles.primaryButtonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => setShowSignIn(false)}
            >
              <Text style={styles.secondaryButtonText}>Create New Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  // Create Account View
  if (!isSignedIn && !showSignIn) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.authContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setShowSignIn(true)}
          >
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
            <Text style={styles.backButtonText}>Back to Sign In</Text>
          </TouchableOpacity>

          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Create Account</Text>
            <Text style={styles.formSubtitle}>Join us and start tracking your fitness</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={() => setIsSignedIn(true)}>
              <Text style={styles.primaryButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  // Signed In View (Account Management)
  const AccountSection = ({ icon, iconColor, title, subtitle, onPress }) => (
    <TouchableOpacity style={styles.accountRow} onPress={onPress}>
      <View style={styles.accountLeft}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
          <Ionicons name={icon} size={22} color={iconColor} />
        </View>
        <View style={styles.accountText}>
          <Text style={styles.accountTitle}>{title}</Text>
          {subtitle && <Text style={styles.accountSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={50} color="#007AFF" />
          </View>
          <TouchableOpacity style={styles.editAvatarButton}>
            <Ionicons name="camera" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>William Zhang</Text>
        <Text style={styles.userEmail}>william@example.com</Text>
        
        <TouchableOpacity style={styles.editProfileButton}>
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Personal Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <AccountSection
          icon="person-outline"
          iconColor="#007AFF"
          title="Name"
          subtitle="William Zhang"
        />
        
        <AccountSection
          icon="mail-outline"
          iconColor="#FF2D55"
          title="Email"
          subtitle="william@example.com"
        />
        
        <AccountSection
          icon="call-outline"
          iconColor="#34C759"
          title="Phone"
          subtitle="+1 (555) 123-4567"
        />
        
        <AccountSection
          icon="calendar-outline"
          iconColor="#FF9500"
          title="Date of Birth"
          subtitle="January 15, 1990"
        />
      </View>

      {/* Health Profile */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Profile</Text>
        
        <AccountSection
          icon="scale-outline"
          iconColor="#5856D6"
          title="Weight"
          subtitle="75 kg"
        />
        
        <AccountSection
          icon="resize-outline"
          iconColor="#FF2D55"
          title="Height"
          subtitle="180 cm"
        />
        
        <AccountSection
          icon="fitness-outline"
          iconColor="#34C759"
          title="Activity Level"
          subtitle="Moderately Active"
        />
        
        <AccountSection
          icon="heart-outline"
          iconColor="#FF2D55"
          title="Resting Heart Rate"
          subtitle="65 BPM"
        />
      </View>

      {/* Account Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Management</Text>
        
        <AccountSection
          icon="key-outline"
          iconColor="#FF9500"
          title="Change Password"
        />
        
        <AccountSection
          icon="shield-checkmark-outline"
          iconColor="#34C759"
          title="Security Settings"
        />
        
        <AccountSection
          icon="cloud-outline"
          iconColor="#007AFF"
          title="Backup & Sync"
          subtitle="Last backup: 2 hours ago"
        />
        
        <AccountSection
          icon="trash-outline"
          iconColor="#FF3B30"
          title="Delete Account"
        />
      </View>

      {/* Sign Out */}
      <TouchableOpacity 
        style={styles.signOutButton}
        onPress={() => setIsSignedIn(false)}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  authContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1D1D1F',
    marginTop: 16,
  },
  logoSubtext: {
    fontSize: 16,
    color: '#86868B',
    marginTop: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 17,
    color: '#007AFF',
    marginLeft: 8,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 15,
    color: '#86868B',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1D1D1F',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '600',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 15,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5EA',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#86868B',
    fontSize: 14,
    fontWeight: '500',
  },
  profileHeader: {
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E5F2FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#86868B',
    marginBottom: 16,
  },
  editProfileButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: '#007AFF',
  },
  editProfileText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  section: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
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
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  accountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  accountText: {
    flex: 1,
  },
  accountTitle: {
    fontSize: 17,
    fontWeight: '400',
    color: '#1D1D1F',
  },
  accountSubtitle: {
    fontSize: 14,
    color: '#86868B',
    marginTop: 2,
  },
  signOutButton: {
    marginTop: 30,
    marginHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  signOutText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FF3B30',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default AccountScreen;
