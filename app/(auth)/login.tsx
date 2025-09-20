// /app/(auth)/login.tsx
import { loginSchema, LoginSchemaType } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Alert, Button, Text, TextInput, View } from "react-native";
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
    <View style={{ padding: 20 }}>
      <Text>Email</Text>
      <TextInput
        autoCapitalize="none"
        onChangeText={(text) => setValue("email", text)}
        {...register("email")}
        style={{ borderWidth: 1, marginBottom: 5 }}
      />
      {errors.email && (
        <Text style={{ color: "red" }}>{errors.email.message}</Text>
      )}

      <Text>Password</Text>
      <TextInput
        secureTextEntry
        onChangeText={(text) => setValue("password", text)}
        {...register("password")}
        style={{ borderWidth: 1, marginBottom: 5 }}
      />
      {errors.password && (
        <Text style={{ color: "red" }}>{errors.password.message}</Text>
      )}

      <Button title="Login" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
