import { Tabs } from "expo-router";

const TabsLayout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="table_1/index"
        options={{
          headerTitle: "Tab 1",
          title: "Tab 1 title",
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "Home Tab",
          title: "Home Tab Title",
        }}
      />
      <Tabs.Screen
        name="tab_2/index"
        options={{
          headerTitle: "Tab 2",
          title: "Tab 2 title",
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
