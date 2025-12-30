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
  ScrollView,
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
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
      <View className="flex-1 justify-center p-8">
        <View className="mb-8">
          <Text className="text-4xl font-black text-primary italic mb-2">
            JOIN THE CLUB
          </Text>
          <Text className="text-muted text-lg">Create your CineHall account</Text>
        </View>

        <View className="gap-5">
          {/* Username */}
          <View>
            <Text className="text-white font-bold mb-2 uppercase tracking-widest text-xs">
              Username
            </Text>
            <TextInput
              value={username || ""}
              onChangeText={(text) => setValue("username", text)}
              placeholder="Enter your username"
              placeholderTextColor="#737373"
              autoCapitalize="words"
              className="bg-card border border-border rounded-2xl px-5 py-4 text-white font-medium"
            />
            {errors.username && (
              <Text className="text-red-500 text-xs mt-1 ml-1">{errors.username.message}</Text>
            )}
          </View>

          {/* Email */}
          <View>
            <Text className="text-white font-bold mb-2 uppercase tracking-widest text-xs">
              Email Address
            </Text>
            <TextInput
              value={email || ""}
              onChangeText={(text) => setValue("email", text)}
              placeholder="Enter your email"
              placeholderTextColor="#737373"
              autoCapitalize="none"
              keyboardType="email-address"
              className="bg-card border border-border rounded-2xl px-5 py-4 text-white font-medium"
            />
            {errors.email && (
              <Text className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</Text>
            )}
          </View>

          {/* Password */}
          <View>
            <Text className="text-white font-bold mb-2 uppercase tracking-widest text-xs">
              Password
            </Text>
            <TextInput
              value={password || ""}
              onChangeText={(text) => setValue("password", text)}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor="#737373"
              className="bg-card border border-border rounded-2xl px-5 py-4 text-white font-medium"
            />
            {errors.password && (
              <Text className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</Text>
            )}
          </View>

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="bg-primary rounded-2xl py-5 mt-4 shadow-xl shadow-primary/30"
          >
            <Text className="text-black text-center font-black uppercase text-lg tracking-widest">
              {isSubmitting ? "Creating..." : "Register"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text className="text-muted text-center mt-4">
              Already have an account? <Text className="text-primary font-bold">Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
