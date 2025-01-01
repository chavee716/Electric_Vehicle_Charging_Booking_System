import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import React from 'react';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.homePage}>
      <View style={styles.textContainer}>
        <View style={styles.wrapper}>
          <View style={styles.logoContainer}>
            <Image source={require("../../public/logo.png")} style={styles.logoImage} />
          </View>
          <Text style={styles.title}>Welcome to EV CONNECT</Text>
          <Text style={styles.description}>
            Your Ultimate EV Charging Companion
            {"\n"}The simplest way to power up your electric journey! Our mission is to make charging your EV as seamless as possible, whether you're at home, at work, or on the go!
          </Text>
        </View>
      </View>
      <View style={styles.imgContainer}>
        <Image source={require("../../public/bg.png")} style={styles.backgroundImage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  homePage: {
    flex: 1,
    backgroundColor: "#f5f6fa", // Light modern background
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  textContainer: {
    flex: 2,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    paddingVertical: 30,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  wrapper: {
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  logoImage: {
    width: 200,   // Increased width
    height: 150,  // Increased height
    resizeMode: "contain",
    borderRadius: 75,  // Keep rounded appearance with updated size
  },
  
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    color: "#1e3a8a", // Modern muted blue
    marginBottom: 10,
  },
  description: {
    fontSize: 17,
    textAlign: "center",
    color: "#4b5563", // Soft gray for readability
    lineHeight: 24,
    paddingHorizontal: 15,
  },
  imgContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  backgroundImage: {
    width: "100%",
    height: Platform.OS === "ios" ? 250 : 220, // Adjust background height based on platform
    resizeMode: "cover",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
  },
});

