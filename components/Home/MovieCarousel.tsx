import { Movie } from "@/schemas/movieSchema";
import { useMovieStore } from "@/store/movieStore";
import React, { useEffect, useRef } from "react";
import { ActivityIndicator, Dimensions, Image, Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";

const { width } = Dimensions.get("window");
const CAROUSEL_HEIGHT = width / 2; // maintain aspect ratio 2:1

export default function MovieCarousel({
  isError,
  isLoading,
  error,
}: {
  isError: boolean;
  isLoading: boolean;
  error: any;
}) {
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const insets = useSafeAreaInsets();

  const { movies } = useMovieStore();

  const urls = movies?.map((movie: Movie) => movie.imageUrl);

  useEffect(() => {
    if (isError && error instanceof Error) {
      // Toast will show only once when error occurs
      setTimeout(() => Toast.error(error.message), 100);
    }
  }, [isError, error]);

  return (
    <View
      style={{
        width,
        height: CAROUSEL_HEIGHT,
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#2E2E2E",
        backgroundColor: "#1A1A1A",
      }}
      className="grow-0"
    >
      {/* Loading State */}
      {isLoading && <ActivityIndicator size="large" color="#FAAA47" />}

      {/* Error State */}
      {isError && (
        <Text className="text-red-500 text-center font-medium">
          Failed to load movies.
        </Text>
      )}

      {/* Carousel */}
      {!isLoading && !isError && urls && urls.length > 0 && (
        <Carousel
          ref={ref}
          width={width}
          height={CAROUSEL_HEIGHT}
          data={urls}
          onProgressChange={progress}
          loop
          autoPlay={true}
          autoPlayInterval={3000}
          renderItem={({ index, item }) => (
            <View
              key={index}
              style={{
                width,
                height: CAROUSEL_HEIGHT,
                justifyContent: "center",
              }}
            >
              <Image
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
                source={{ uri: item }}
              />
            </View>
          )}
        />
      )}
    </View>
  );
}
