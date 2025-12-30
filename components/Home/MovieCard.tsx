import { Movie } from "@/schemas/movieSchema";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface MovieCardProps {
  movie: Movie;
  onPress: (id: string) => void;
}

export default function MovieCard({ movie, onPress }: MovieCardProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress(movie._id)}
      className="w-[48%] mb-4"
    >
      <View className="bg-card border border-border rounded-xl overflow-hidden shadow-lg shadow-black/50">
        <Image
          source={{ uri: movie.imageUrl }}
          className="w-full h-60"
          resizeMode="cover"
        />
        <View className="p-2 gap-1">
          <Text className="text-base font-bold text-white" numberOfLines={1}>
            {movie.title}
          </Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-xs text-muted font-medium">{movie.genre}</Text>
            <View className="w-1 h-1 rounded-full bg-muted" />
            <Text className="text-xs text-muted font-medium">
              {new Date(movie.releaseDate).getFullYear()}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
