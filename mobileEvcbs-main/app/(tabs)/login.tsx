import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";

export default function Login({ navigation }: { navigation: any }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);

    // Validate input
    if (!username || !password) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    try {
      // Make API call to backend login endpoint
      const response = await axios.post(
        "http://192.168.8.153:8800/api/auth/login",
        { username, password },
        {
          withCredentials: true, // Important for handling cookies
          headers: { "Content-Type": "application/json" },
        }
      );

      // If login is successful
      if (response.status === 200) {
        setError("");
        Alert.alert("Login Successful", "Welcome back!");
        // Uncomment when Home screen is ready
        // navigation.navigate("Home");
      }
    } catch (error: unknown) {
      // Narrow down the type of error
      if (axios.isAxiosError(error)) {
        // Axios-specific error
        setError(error.response?.data?.message || "Login failed.");
      } else {
        // Non-Axios error
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.login}>
      <View style={styles.formContainer}>
        <Text style={styles.heading}>Welcome back</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor="#9ca3af"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#9ca3af"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>Don't have an account?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imgContainer}>
        <Image
          source={require("../../public/login-bg.png")}
          style={styles.image}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  login: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 25,
  },
  input: {
    width: "85%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#ffffff",
    fontSize: 16,
    color: "#111827",
  },
  button: {
    width: "85%",
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#3bc449",
    alignItems: "center",
    marginTop: 10,
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
  link: {
    color: "#2563eb",
    marginTop: 15,
    fontSize: 14,
  },
  imgContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 280,
    height: 180,
    resizeMode: "contain",
  },
});
