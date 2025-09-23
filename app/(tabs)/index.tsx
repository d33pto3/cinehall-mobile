import { Link, router } from "expo-router";
import { Pressable, Text, View } from "react-native";

const HomePage = () => {
  return (
    <View>
      <Text>Home Page</Text>
      <Link href="/tab_1">Go to tab 1</Link>
      <Pressable onPress={() => router.push("/tab_2")}>
        <Text>Go to tab 2</Text>
      </Pressable>
    </View>
  );
};

export default HomePage;
