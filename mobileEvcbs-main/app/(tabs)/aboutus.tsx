import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AboutUs = () => {
  return (
    <View style={styles.container}>
      <View style={styles.mainSection}>
        <Text style={styles.title}>About Us</Text>
        <Text style={styles.heroDescription}>
          Leaders in EV charging solutions, partnering globally to provide innovative energy services.
        </Text>
        <View style={styles.heroIntro} />
      </View>

      <View style={styles.coreValues}>
        <Text style={styles.subtitle}>Our Core Values</Text>
        <View style={styles.valuesList}>
          <Text style={styles.valueItem}>
            <Text style={styles.valueTitle}>🌟 Innovation</Text> - Cutting-edge technology to lead the way
          </Text>
          <Text style={styles.valueItem}>
            <Text style={styles.valueTitle}>🤝 Honesty</Text> - Transparent solutions to build trust
          </Text>
          <Text style={styles.valueItem}>
            <Text style={styles.valueTitle}>💼 Service</Text> - Customer service is at the heart of everything we do
          </Text>
          <Text style={styles.valueItem}>
            <Text style={styles.valueTitle}>📈 Development</Text> - We strive for continuous growth and improvement
          </Text>
        </View>
      </View>

      <View style={styles.globalReach}>
        <Text style={styles.subtitle}>Global Reach</Text>
        <Text style={styles.description}>
          Our services span multiple countries, working with top companies to deliver premium EV solutions globally.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f9fc",
  },
  mainSection: {
    marginBottom: 30,
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
    color: "#1e3a8a",
  },
  heroDescription: {
    fontSize: 16,
    textAlign: "center",
    color: "#4b5563",
    marginBottom: 15,
  },
  heroIntro: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginTop: 10,
    marginBottom: 20,
  },
  coreValues: {
    marginBottom: 30,
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
    color: "#1e3a8a",
  },
  valuesList: {
    paddingHorizontal: 15,
  },
  valueItem: {
    fontSize: 16,
    color: "#4b5563",
    marginBottom: 15,
    lineHeight: 24,
  },
  valueTitle: {
    fontWeight: "600",
    color: "#1e3a8a",
  },
  globalReach: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    color: "#4b5563",
    textAlign: "center",
    lineHeight: 24,
  },
});

export default AboutUs;
