import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const Movie = () => {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text></Text>
    </View>
  );
};

export default Movie;
