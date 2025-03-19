import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

// Interface for station data
interface Station {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
}

// Duration options
const durationOptions = [
  { label: "30 minutes", value: "30" },
  { label: "60 minutes", value: "60" },
  { label: "90 minutes", value: "90" },
  { label: "120 minutes", value: "120" }
];

export default function BookingScreen() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Form state
  const [selectedStation, setSelectedStation] = useState("");
  const [selectedStationName, setSelectedStationName] = useState("Select a station...");
  const [date, setDate] = useState(new Date());
  const [timeHour, setTimeHour] = useState("12");
  const [timeMinute, setTimeMinute] = useState("00");
  const [timeAMPM, setTimeAMPM] = useState("PM");
  const [duration, setDuration] = useState("30");
  const [durationLabel, setDurationLabel] = useState("30 minutes");
  const [vehicleModel, setVehicleModel] = useState("");
  
  // Modal states
  const [showStationModal, setShowStationModal] = useState(false);
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // API configuration based on platform
  const API_BASE_URL = __DEV__
    ? Platform.select({
        android: "http://192.168.166.216:8800",
        ios: "http://localhost:8800",
        default: "http://192.168.166.216:8800"
      })
    : "http://192.168.166.216:8800";

  // Check authentication status and fetch stations on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStations();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const checkAuthStatus = async () => {
    try {
      // Check for auth token in AsyncStorage
      const token = await AsyncStorage.getItem('authToken');
      const loggedInUser = await AsyncStorage.getItem('username');
      
      if (token) {
        console.log('User authenticated:', loggedInUser);
        setIsAuthenticated(true);
      } else {
        console.log('User not authenticated');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
    }
  };

  const handleSignIn = () => {
    // Navigate to sign-in screen
    router.push("/(tabs)/login");
  };

  const fetchStations = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/stations`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      setStations(response.data);
      setError("");
    } catch (error: any) {
      console.error('Error fetching stations:', error);
      
      if (error?.response?.status === 404) {
        setError('No charging stations found');
      } else if (error?.message?.includes('Network Error')) {
        setError('Unable to connect to server. Please check your connection.');
      } else {
        setError('Error loading charging stations');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Format the date as a string
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time from hours, minutes, and AM/PM
  const formatTime = () => {
    return `${timeHour}:${timeMinute} ${timeAMPM}`;
  };

  // Handle date changes
  const changeDate = (days: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    
    // Don't allow dates in the past
    if (newDate >= new Date()) {
      setDate(newDate);
    }
  };

  // Select station
  const selectStation = (id: string, name: string) => {
    setSelectedStation(id);
    setSelectedStationName(name);
    setShowStationModal(false);
  };
  
  // Select duration
  const selectDuration = (value: string, label: string) => {
    setDuration(value);
    setDurationLabel(label);
    setShowDurationModal(false);
  };

  // Handle booking submission
  const handleBooking = async () => {
    if (!selectedStation || !vehicleModel) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    // Create time string from components
    const timeString = `${timeHour}:${timeMinute} ${timeAMPM}`;
    
    try {
      // Get auth token
      const token = await AsyncStorage.getItem('authToken');
      
      // Simulating API call for now
      setTimeout(() => {
        setSuccess("Booking confirmed! Check your email for details.");
        setIsLoading(false);
        // Reset form
        setSelectedStation("");
        setSelectedStationName("Select a station...");
        setDate(new Date());
        setTimeHour("12");
        setTimeMinute("00");
        setTimeAMPM("PM");
        setDuration("30");
        setDurationLabel("30 minutes");
        setVehicleModel("");
      }, 1500);

      /* Real API implementation would be something like:
      const response = await axios.post(`${API_BASE_URL}/api/bookings`, {
        stationId: selectedStation,
        date: date.toISOString(),
        time: timeString,
        duration: parseInt(duration),
        vehicleModel
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 201) {
        setSuccess("Booking confirmed! Check your email for details.");
      }
      */
    } catch (error: any) {
      setError(error?.response?.data?.message || "Failed to create booking");
    } finally {
      setIsLoading(false);
    }
  };

  // Render authentication message if not authenticated
  const renderAuthMessage = () => {
    return (
      <View style={styles.authContainer}>
        <Image source={require("../../assets/logo.png")} style={styles.logoImage} />
        <Text style={styles.authTitle}>Book a Charging Session</Text>
        <View style={styles.authMessageContainer}>
          <Text style={styles.authMessage}>
            Please sign in to continue and book your charging session.
          </Text>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={handleSignIn}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
          <Text style={styles.registerText}>
            Don't have an account?{" "}
            <Text 
              style={styles.registerLink}
              onPress={() => router.push("/register")}
            >
              Register
            </Text>
          </Text>
        </View>
      </View>
    );
  };

  // Show loading indicator while checking auth status
  if (isLoading && !error) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3bc449" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Return auth message if not authenticated
  if (!isAuthenticated) {
    return renderAuthMessage();
  }

  // Return booking form if authenticated
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={require("../../assets/logo.png")} style={styles.logoImage} />
        <Text style={styles.headerTitle}>Book a Charging Session</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Station Selection */}
        <Text style={styles.label}>Select Charging Station *</Text>
        <TouchableOpacity 
          style={styles.pickerButton}
          onPress={() => setShowStationModal(true)}
        >
          <Text style={styles.pickerButtonText}>{selectedStationName}</Text>
        </TouchableOpacity>

        {/* Date Selection */}
        <Text style={styles.label}>Select Date *</Text>
        <View style={styles.dateSelector}>
          <TouchableOpacity 
            style={styles.dateArrow}
            onPress={() => changeDate(-1)}
          >
            <Text style={styles.dateArrowText}>◀</Text>
          </TouchableOpacity>
          <View style={styles.dateDisplay}>
            <Text style={styles.dateText}>{formatDate(date)}</Text>
          </View>
          <TouchableOpacity 
            style={styles.dateArrow}
            onPress={() => changeDate(1)}
          >
            <Text style={styles.dateArrowText}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* Time Selection */}
        <Text style={styles.label}>Select Time *</Text>
        <View style={styles.timeSelector}>
          <View style={styles.timeInputGroup}>
            <TextInput
              style={styles.timeInput}
              value={timeHour}
              onChangeText={(text) => {
                const num = parseInt(text);
                if (timeAMPM === "AM" || timeAMPM === "PM") {
                  if (!isNaN(num) && num >= 1 && num <= 12) {
                    setTimeHour(text);
                  } else if (text === "") {
                    setTimeHour("");
                  }
                } else {
                  if (!isNaN(num) && num >= 0 && num <= 23) {
                    setTimeHour(text);
                  } else if (text === "") {
                    setTimeHour("");
                  }
                }
              }}
              keyboardType="numeric"
              maxLength={2}
              placeholder="HH"
            />
            <Text style={styles.timeColon}>:</Text>
            <TextInput
              style={styles.timeInput}
              value={timeMinute}
              onChangeText={(text) => {
                const num = parseInt(text);
                if (!isNaN(num) && num >= 0 && num <= 59 || text === "") {
                  setTimeMinute(text.padStart(2, '0'));
                }
              }}
              keyboardType="numeric"
              maxLength={2}
              placeholder="MM"
            />
            <TouchableOpacity 
              style={styles.ampmButton}
              onPress={() => setTimeAMPM(timeAMPM === "AM" ? "PM" : "AM")}
            >
              <Text style={styles.ampmButtonText}>{timeAMPM}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Duration Selection */}
        <Text style={styles.label}>Charging Duration (minutes) *</Text>
        <TouchableOpacity 
          style={styles.pickerButton}
          onPress={() => setShowDurationModal(true)}
        >
          <Text style={styles.pickerButtonText}>{durationLabel}</Text>
        </TouchableOpacity>

        {/* Vehicle Model Input */}
        <Text style={styles.label}>Vehicle Model *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Tesla Model 3"
          value={vehicleModel}
          onChangeText={setVehicleModel}
          placeholderTextColor="#9ca3af"
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleBooking}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Book Now</Text>
          )}
        </TouchableOpacity>

        {/* Error and Success Messages */}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success ? <Text style={styles.success}>{success}</Text> : null}
      </View>

      {/* Additional Information */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Booking Information</Text>
        <Text style={styles.infoText}>
          • Bookings can be made up to 30 days in advance
        </Text>
        <Text style={styles.infoText}>
          • Cancellations are free up to 2 hours before your booking
        </Text>
        <Text style={styles.infoText}>
          • Arrive 10 minutes before your scheduled time
        </Text>
        <Text style={styles.infoText}>
          • Payment will be processed when you start charging
        </Text>
      </View>

      {/* Station Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showStationModal}
        onRequestClose={() => setShowStationModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Charging Station</Text>
            <ScrollView style={styles.modalScrollView}>
              {stations.map((station) => (
                <TouchableOpacity
                  key={station.id}
                  style={styles.modalItem}
                  onPress={() => selectStation(station.id, station.name)}
                >
                  <Text style={styles.modalItemText}>{station.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowStationModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Duration Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDurationModal}
        onRequestClose={() => setShowDurationModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Duration</Text>
            <ScrollView style={styles.modalScrollView}>
              {durationOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.modalItem}
                  onPress={() => selectDuration(option.value, option.label)}
                >
                  <Text style={styles.modalItemText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowDurationModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#1e3a8a",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  logoImage: {
    width: 100,
    height: 60,
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginTop: 10,
  },
  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#3bc449",
  },
  // Auth message styles
  authContainer: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingVertical: 40,
    paddingHorizontal: 25,
    alignItems: "center",
  },
  authTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginTop: 15,
    marginBottom: 30,
  },
  authMessageContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3bc449",
  },
  authMessage: {
    fontSize: 16,
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 24,
  },
  signInButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#3bc449",
    alignItems: "center",
    marginBottom: 20,
  },
  signInButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  registerText: {
    fontSize: 14,
    color: "#4b5563",
  },
  registerLink: {
    color: "#3bc449",
    fontWeight: "500",
  },
  // Form styles
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    fontSize: 16,
    color: "#111827",
  },
  pickerButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    marginBottom: 15,
  },
  pickerButtonText: {
    fontSize: 16,
    color: "#111827",
  },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  dateArrow: {
    padding: 10,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
  },
  dateArrowText: {
    fontSize: 16,
    color: "#1f2937",
  },
  dateDisplay: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    marginHorizontal: 10,
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#111827",
  },
  timeSelector: {
    marginBottom: 15,
  },
  timeInputGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeInput: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    fontSize: 16,
    color: "#111827",
    width: 60,
    textAlign: "center",
  },
  timeColon: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 8,
    color: "#1f2937",
  },
  ampmButton: {
    marginLeft: 12,
    padding: 12,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    width: 60,
    alignItems: "center",
  },
  ampmButtonText: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "600",
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#3bc449",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 15,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    color: "#ef4444",
    marginTop: 10,
    fontSize: 14,
  },
  success: {
    color: "#22c55e",
    marginTop: 10,
    fontSize: 14,
    fontWeight: "500",
  },
  infoSection: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#1e3a8a",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
    textAlign: "center",
  },
  infoText: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#1e3a8a",
  },
  modalScrollView: {
    maxHeight: 300,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalItemText: {
    fontSize: 16,
    color: "#111827",
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    alignItems: "center",
  },
  modalCloseButtonText: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "500",
  },
});