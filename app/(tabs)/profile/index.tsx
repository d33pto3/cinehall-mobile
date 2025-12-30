import { Text, View, TouchableOpacity } from "react-native";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";

const index = () => {
  const { user, logout, isLoggedIn } = useAuthStore();
  const router = useRouter();

  if (!isLoggedIn) {
    return (
      <View className="flex-1 bg-background justify-center items-center p-8">
        <Text className="text-3xl font-black text-white italic uppercase text-center">ACCESS DENIED</Text>
        <Text className="text-muted text-center mt-2 mb-8 uppercase tracking-widest text-xs">Login to view your premium profile</Text>
        <TouchableOpacity 
          onPress={() => router.push("/login")}
          className="bg-primary px-10 py-4 rounded-2xl shadow-xl shadow-primary/30"
        >
          <Text className="text-black font-black uppercase">Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background p-8 pt-20">
      <View className="items-center mb-10">
        <View className="w-24 h-24 bg-card rounded-full border-2 border-primary justify-center items-center mb-4">
          <Text className="text-4xl text-white font-black">{user?.username?.charAt(0).toUpperCase() || "U"}</Text>
        </View>
        <Text className="text-3xl font-black text-white italic uppercase">{user?.username}</Text>
        <Text className="text-primary font-bold">{user?.email}</Text>
      </View>

      <View className="gap-4">
        <TouchableOpacity className="bg-card p-5 rounded-2xl border border-border flex-row justify-between items-center">
          <Text className="text-white font-bold uppercase tracking-widest text-xs">Booking History</Text>
          <Text className="text-primary">&gt;</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="bg-card p-5 rounded-2xl border border-border flex-row justify-between items-center">
          <Text className="text-white font-bold uppercase tracking-widest text-xs">Payment Methods</Text>
          <Text className="text-primary">&gt;</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={logout}
          className="mt-10 items-center"
        >
          <Text className="text-red-500 font-black uppercase tracking-[4px] text-xs">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default index;
