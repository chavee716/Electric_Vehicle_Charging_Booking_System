import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";

export default function Login({ setIsLoggedIn }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!username || !password) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.167.216:8800/api/auth/login",
        { username, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        setError("");
        setSuccess(`Successfully logged in as ${username}!`);
        setIsLoggedIn(true);
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Login failed.");
      } else {
        setError("");
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
        {success ? <Text style={styles.success}>{success}</Text> : null}

        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.link}>Don't have an account?</Text>
        </TouchableOpacity>
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
  success: {
    color: "#22c55e",
    marginTop: 10,
    fontSize: 14,
    fontWeight: "500",
  },
  link: {
    color: "#2563eb",
    marginTop: 15,
    fontSize: 14,
  },
});