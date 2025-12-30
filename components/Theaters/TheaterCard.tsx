import { IconBuildingSkyscraper, IconMapPin } from "@tabler/icons-react-native";
import React from "react";
import { Image, Text, View } from "react-native";
import { Hall } from "@/api/hall/hall";

const DEFAULT_THEATER_IMAGE = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop";

export const TheaterCard = ({ hall }: { hall: Hall }) => {
  return (
    <View className="bg-card rounded-2xl overflow-hidden mb-4 border border-border shadow-lg shadow-black/50">
      <Image
        source={{ uri: hall.image || DEFAULT_THEATER_IMAGE }}
        className="w-full h-40"
        resizeMode="cover"
      />
      <View className="p-4">
        <View className="flex-row items-center gap-2 mb-1">
          <IconBuildingSkyscraper size={18} color="#FAAA47" />
          <Text className="text-white font-black text-lg uppercase italic flex-1" numberOfLines={1}>
            {hall.name}
          </Text>
        </View>
        
        <View className="flex-row items-start gap-2">
          <IconMapPin size={16} color="#CAC1C1" style={{ marginTop: 2 }} />
          <Text className="text-muted text-xs font-medium flex-1 leading-5">
            {hall.address}
          </Text>
        </View>
      </View>
    </View>
  );
};
