import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

const HelpSupportScreen = ({ navigation }) => {
  const HelpSection = ({ icon, title, description, onPress }) => (
    <TouchableOpacity style={styles.helpCard} onPress={onPress}>
      <View style={[styles.iconCircle, { backgroundColor: '#007AFF20' }]}>
        <Ionicons name={icon} size={28} color="#007AFF" />
      </View>
      <View style={styles.helpContent}>
        <Text style={styles.helpTitle}>{title}</Text>
        <Text style={styles.helpDescription}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <View style={styles.backButtonCircle}>
            <Ionicons name="chevron-back" size={24} color="#007AFF" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.welcomeCard}>
          <Ionicons name="help-circle" size={48} color="#FFFFFF" />
          <Text style={styles.welcomeTitle}>How can we help?</Text>
          <Text style={styles.welcomeText}>
            Find answers to common questions or contact our support team.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Help</Text>
          
          <HelpSection
            icon="book"
            title="Getting Started"
            description="Learn the basics of using Fitness Tracker"
            onPress={() => {}}
          />

          <HelpSection
            icon="bluetooth"
            title="Connecting Devices"
            description="How to pair your fitness devices"
            onPress={() => {}}
          />

          <HelpSection
            icon="fitness"
            title="Tracking Workouts"
            description="Tips for accurate workout tracking"
            onPress={() => {}}
          />

          <HelpSection
            icon="stats-chart"
            title="Understanding Stats"
            description="Make sense of your fitness data"
            onPress={() => {}}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          
          <TouchableOpacity style={styles.contactCard}>
            <Ionicons name="mail" size={24} color="#007AFF" />
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Email Support</Text>
              <Text style={styles.contactText}>support@fitnesstracker.com</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard}>
            <Ionicons name="chatbubbles" size={24} color="#30D158" />
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Live Chat</Text>
              <Text style={styles.contactText}>Available 9 AM - 5 PM EST</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard}>
            <Ionicons name="call" size={24} color="#FF9F0A" />
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Phone Support</Text>
              <Text style={styles.contactText}>1-800-FITNESS</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>
          
          <TouchableOpacity style={styles.resourceRow}>
            <Text style={styles.resourceText}>FAQs</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceRow}>
            <Text style={styles.resourceText}>Video Tutorials</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceRow}>
            <Text style={styles.resourceText}>Community Forum</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceRow}>
            <Text style={styles.resourceText}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 12,
    paddingTop: Platform.OS === 'ios' ? 12 : 3,
    paddingBottom: 3,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    minHeight: Platform.OS === 'ios' ? 100 : 70,
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSpacer: {
    width: 36,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  content: {
    flex: 1,
  },
  welcomeCard: {
    backgroundColor: '#007AFF',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpContent: {
    flex: 1,
    marginLeft: 16,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  helpDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  contactContent: {
    flex: 1,
    marginLeft: 16,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  contactText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  resourceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  resourceText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
});

export default HelpSupportScreen;
