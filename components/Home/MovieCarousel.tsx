import React, { useRef } from "react";
import { Dimensions, Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

const data = [...new Array(6).keys()];
const width = Dimensions.get("window").width;

console.log(width);

export default function MovieCarousel() {
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  // const onPressPagination = (index: number) => {
  //   ref.current?.scrollTo({
  //     count: index - progress.value,
  //     animated: true,
  //   });
  // };

  return (
    <View className="flex-1">
      <Carousel
        ref={ref}
        width={width}
        height={width / 2}
        data={data}
        onProgressChange={progress}
        renderItem={({ index }) => (
          <View
            style={{
              flex: 1,
              // borderWidth: 1,
              justifyContent: "center",
            }}
          >
            <Text style={{ textAlign: "center", fontSize: 30 }}>{index}</Text>
          </View>
        )}
      />

      {/* <Pagination.Basic
        progress={progress}
        data={data}
        dotStyle={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 50 }}
        containerStyle={{ gap: 5, marginTop: 10 }}
        onPress={onPressPagination}
      /> */}
    </View>
  );
}
