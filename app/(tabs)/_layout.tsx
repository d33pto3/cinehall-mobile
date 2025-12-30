import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabsLayout = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FAAA47",
        tabBarInactiveTintColor: "#9BA1A6",
        tabBarStyle: {
          backgroundColor: "#1A1A1A",
          borderTopColor: "#333333",
          height: 75 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 15,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "Home Tab",
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="movies/index"
        options={{
          headerTitle: "Movies",
          title: "Movies",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="movie-open-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="theaters/index"
        options={{
          headerTitle: "Theaters",
          title: "Theaters",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="theater" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings/index"
        options={{
          headerTitle: "Bookings",
          title: "Bookings",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="ticket-confirmation-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          headerTitle: "Profiles",
          title: "Profiles",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
