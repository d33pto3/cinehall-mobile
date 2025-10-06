import api from "@/services/api";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Filters from "./Filters";

export default function NowShowing() {
  const [nowShowingMovies, setNowShowingMovies] = useState([]);

  useEffect(() => {
    const fetchNowShowingMovies = async () => {
      const response = await api.get("/movie/now-showing");

      console.log(response);
    };

    fetchNowShowingMovies();
  }, []);

  return (
    <View style={{ padding: 12 }}>
      <Text style={{ fontSize: 16, fontWeight: "500" }}>Now Showing</Text>
      <Filters />
    </View>
  );
}
