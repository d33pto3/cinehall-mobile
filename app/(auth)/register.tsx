// /app/(auth)/register.tsx
import { registerSchema, RegisterSchemaType } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import {
  Alert,
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "../../store/authStore";

export default function RegisterScreen() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
  });

  const username = watch("username");
  const email = watch("email");
  const password = watch("password");

  const onSubmit = async (data: RegisterSchemaType) => {
    try {
      await register(data.email, data.password, data.username);
      router.replace("/");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Unknown error";
      Alert.alert("Registration failed", message);
    }
  };

  return (
    <View style={{ padding: 20, flex: 1, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Create Account
      </Text>

      {/* Username */}
      <Text style={{ marginTop: 10 }}>Username</Text>
      <TextInput
        value={username || ""}
        onChangeText={(text) => setValue("username", text)}
        style={{
          borderWidth: 1,
          marginBottom: 5,
          padding: 10,
          borderRadius: 5,
          borderColor: errors.username ? "red" : "#ccc",
        }}
        placeholder="Enter your username"
        autoCapitalize="words"
      />
      {errors.username && (
        <Text style={{ color: "red", marginBottom: 10 }}>
          {errors.username.message}
        </Text>
      )}

      {/* Email */}
      <Text style={{ marginTop: 10 }}>Email</Text>
      <TextInput
        value={email || ""}
        onChangeText={(text) => setValue("email", text)}
        style={{
          borderWidth: 1,
          marginBottom: 5,
          padding: 10,
          borderRadius: 5,
          borderColor: errors.email ? "red" : "#ccc",
        }}
        placeholder="Enter your email"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      {errors.email && (
        <Text style={{ color: "red", marginBottom: 10 }}>
          {errors.email.message}
        </Text>
      )}

      {/* Password */}
      <Text style={{ marginTop: 10 }}>Password</Text>
      <TextInput
        value={password || ""}
        onChangeText={(text) => setValue("password", text)}
        secureTextEntry
        style={{
          borderWidth: 1,
          marginBottom: 5,
          padding: 10,
          borderRadius: 5,
          borderColor: errors.password ? "red" : "#ccc",
        }}
        placeholder="Enter your password"
      />
      {errors.password && (
        <Text style={{ color: "red", marginBottom: 10 }}>
          {errors.password.message}
        </Text>
      )}

      <Button
        title={isSubmitting ? "Creating account..." : "Register"}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      />

      <TouchableOpacity
        onPress={() => router.push("/(auth)/login")}
        style={{ marginTop: 20, alignItems: "center" }}
      >
        <Text style={{ color: "#3B82F6" }}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}
