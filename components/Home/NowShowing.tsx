import React from "react";
import { Text, View } from "react-native";
import Filters from "./Filters";

export default function NowShowing() {
  return (
    <View style={{ padding: 12 }}>
      <Text style={{ fontSize: 16, fontWeight: "500" }}>Now Showing</Text>
      <Filters />
    </View>
  );
}
