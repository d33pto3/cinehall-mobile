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
      <Image
        source={{ uri: movie.imageUrl }}
        className="w-full h-60 rounded-tl-xl rounded-tr-xl"
        resizeMode="cover"
      />
      <View className="border border-gray-300 rounded-bl-xl rounded-br-xl p-2">
        <Text className="text-base font-semibold">{movie.title}</Text>
        <View className="flex-row items-center gap-1">
          <Text>{movie.genre}</Text>
          <Text>|</Text>
          <Text>{new Date(movie.releaseDate).getFullYear()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
