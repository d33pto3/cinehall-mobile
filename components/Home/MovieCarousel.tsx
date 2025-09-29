import React, { useEffect, useRef } from "react";
import { ActivityIndicator, Dimensions, Image, Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { Toast } from "toastify-react-native";

const { width } = Dimensions.get("window");
const CAROUSEL_HEIGHT = width / 2; // maintain aspect ratio 2:1

export default function MovieCarousel({
  urls,
  isError,
  isLoading,
  error,
}: {
  urls: string[];
  isError: boolean;
  isLoading: boolean;
  error: any;
}) {
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

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
        // borderBottomColor: "#000",
      }}
    >
      {/* Loading State */}
      {isLoading && <ActivityIndicator size="large" color="#000" />}

      {/* Error State */}
      {isError && (
        <Text style={{ color: "red", fontSize: 16, textAlign: "center" }}>
          Failed to load movies.
        </Text>
      )}

      {/* Carousel */}
      {!isLoading && !isError && urls.length > 0 && (
        <Carousel
          ref={ref}
          width={width}
          height={CAROUSEL_HEIGHT}
          data={urls}
          onProgressChange={progress}
          loop
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
                style={{ width: "100%", height: "100%", borderRadius: 10 }}
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
