// /app/(auth)/login.tsx
import { loginSchema, LoginSchemaType } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Alert, Button, Text, TextInput, View, TouchableOpacity } from "react-native";
import { useAuthStore } from "../../store/authStore";

export default function LoginScreen() {
  const router = useRouter();

  const login = useAuthStore((s) => s.login);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      await login(data.email, data.password);
      router.replace("/");
    } catch (err: any) {
      Alert.alert(
        "Login failed",
        err?.response?.data?.message || "Unknow error"
      );
    }
  };

  return (
    <View className="flex-1 bg-background justify-center p-8">
      <View className="mb-10">
        <Text className="text-4xl font-black text-primary italic mb-2">
          WELCOME BACK
        </Text>
        <Text className="text-muted text-lg">Login to your CineHall account</Text>
      </View>

      <View className="gap-6">
        <View>
          <Text className="text-white font-bold mb-2 uppercase tracking-widest text-xs">
            Email Address
          </Text>
          <TextInput
            autoCapitalize="none"
            placeholder="example@mail.com"
            placeholderTextColor="#737373"
            onChangeText={(text) => setValue("email", text)}
            className="bg-card border border-border rounded-2xl px-5 py-4 text-white font-medium"
          />
          {errors.email && (
            <Text className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</Text>
          )}
        </View>

        <View>
          <Text className="text-white font-bold mb-2 uppercase tracking-widest text-xs">
            Password
          </Text>
          <TextInput
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor="#737373"
            onChangeText={(text) => setValue("password", text)}
            className="bg-card border border-border rounded-2xl px-5 py-4 text-white font-medium"
          />
          {errors.password && (
            <Text className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</Text>
          )}
        </View>

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="bg-primary rounded-2xl py-5 mt-4 shadow-xl shadow-primary/30"
        >
          <Text className="text-black text-center font-black uppercase text-lg tracking-widest">
            Sign In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text className="text-muted text-center mt-4">
            Don't have an account? <Text className="text-primary font-bold">Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
