import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

export const getOrCreateGuestId = async () => {
  let guestId = await AsyncStorage.getItem("guestId");

  if (!guestId) {
    guestId = `guest_${uuid.v4()}`; // clear prefix to differentiate
    await AsyncStorage.setItem("guestId", guestId);
  }

  return guestId;
};
