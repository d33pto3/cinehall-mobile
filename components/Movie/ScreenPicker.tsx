import { getScreensByHallMovieAndDate } from "@/api/screen";
import { useBookingStore } from "@/store/bookingStore";
import { Screen } from "@/types/screen";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Select from "../ui/custom/select";

const ScreenPicker = ({
  movieId,
  hallId,
  date,
}: {
  movieId: string;
  hallId: string | null;
  date: Date;
}) => {
  const [screenName, setScreenName] = useState<string | null>(null);

  const { setScreen, screenId: currentScreenId } = useBookingStore();

  const {
    data: screens,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["screens", movieId, date],
    queryFn: () =>
      hallId
        ? getScreensByHallMovieAndDate(movieId, hallId, date)
        : Promise.resolve([]),
    retry: 2,
  });

  const handleSelect = (id: string) => {
    setScreen(id);
  };

  useEffect(() => {
    if (currentScreenId && screens) {
      const selectedScreen = screens.find(
        (screen: Screen) => screen._id === currentScreenId
      );
      setScreenName(selectedScreen?.name || "");
    } else {
      setScreenName("");
    }
  }, [currentScreenId, screens]);

  return (
    <View className="mt-2">
      {screens && screens.length > 0 && (
        <>
          <View
            className="w-[50%] flex flex-row items-center gap-2 relative"
            style={{ zIndex: 10 }}
          >
            <Text>Screens:</Text>
            <View className="flex-1" style={{ zIndex: 20 }}>
              <Select
                options={screens.map((screen: Screen) => ({
                  key: screen._id,
                  text: screen.name,
                }))}
                onSelect={handleSelect}
              />
            </View>
          </View>

          <View className="mt-2 py-1">
            <Text>Selected Screen: {screenName || "None"}</Text>
          </View>
        </>
      )}
    </View>
  );
};

export default ScreenPicker;
