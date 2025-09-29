import MovieCarousel from "@/components/Home/MovieCarousel";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Feather from "@expo/vector-icons/Feather";
import { ScrollView, Text, View } from "react-native";

const HomePage = () => {
  return (
    <View className="flex-1">
      {/* Sticky Header */}
      <View className="absolute top-0 left-0 right-0 z-10 bg-white px-6 py-2 border-b border-neutral-300 flex-row items-center justify-between">
        <Text className="text-lg font-bold">Cinehall</Text>
        <View className="flex-row gap-4 items-center">
          <EvilIcons name="search" size={24} color="black" />
          <Feather name="bell" size={20} color="black" />
        </View>
      </View>

      {/* Scroll Content with padding to avoid overlap */}
      <ScrollView contentContainerStyle={{ paddingTop: 45 }}>
        <MovieCarousel />
      </ScrollView>
    </View>
  );
};

export default HomePage;
