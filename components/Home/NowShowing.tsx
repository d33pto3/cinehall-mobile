import api from "@/services/api";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Filters from "./Filters";

export default function NowShowing() {
  const [nowShowingMovies, setNowShowingMovies] = useState([]);

  useEffect(() => {
    const fetchNowShowingMovies = async () => {
      try {
        const response = await api.get("/movie/now-showing");

        setNowShowingMovies(response.data.movies);
      } catch (error) {
        console.log(error);
      }
    };

    fetchNowShowingMovies();
  }, []);

  console.log("movies", nowShowingMovies);

  return (
    <View style={{ padding: 12 }}>
      <Text style={{ fontSize: 16, fontWeight: "500" }}>Now Showing</Text>
      <Filters />
    </View>
  );
}
