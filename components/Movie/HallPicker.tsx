import { getHallsByMovieAndDate } from "@/api/hall";
import { useBookingStore } from "@/store/bookingStore";
import { Hall } from "@/types/hall";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Select from "../ui/custom/select";

const HallPicker = ({ movieId, date }: { movieId: string; date: Date }) => {
  const [hallName, setSelectedHallName] = useState<string | null>(null);

  const { setHall, hallId: currentHallId } = useBookingStore();

  const {
    data: halls,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["halls", movieId, date],
    queryFn: () => getHallsByMovieAndDate(movieId, date),
    retry: 2,
  });

  const handleSelect = (id: string) => {
    setHall(id);
  };

  console.log(currentHallId);

  useEffect(() => {
    if (currentHallId)
      setSelectedHallName(
        halls.find((hall: Hall) => hall._id === currentHallId).name
      );
    else setSelectedHallName("");
  }, [currentHallId, halls, setHall]);

  return (
    <View className="mt-2">
      {halls && halls.length > 0 ? (
        <>
          <View
            className="w-[50%] flex flex-row items-center gap-2 relative"
            style={{ zIndex: 10 }}
          >
            <Text>Halls:</Text>
            <View className="flex-1" style={{ zIndex: 20 }}>
              <Select
                options={halls.map((hall: Hall) => ({
                  key: hall._id,
                  text: hall.name,
                }))}
                onSelect={handleSelect}
              />
            </View>
          </View>

          <View className="mt-2 py-1">
            <Text>Selected Hall: {hallName || "None"}</Text>
          </View>
        </>
      ) : (
        <Text>No shows</Text>
      )}
    </View>
  );
};

export default HallPicker;
