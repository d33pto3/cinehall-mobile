import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const filterCategories = {
  Genre: ["Action", "Comedy", "Drama", "Horror", "Romance"],
  Language: ["English", "Hindi", "Bangla", "Spanish"],
  Other: ["3D", "IMAX", "Subtitled"],
};

export default function Filters() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const toggleFilter = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };
  return (
    <View>
      {/* Filter Row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 8,
        }}
      >
        {/* Filter Button (fixed) */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderRadius: 20,
            paddingVertical: 6,
            paddingHorizontal: 12,
            marginRight: 8,
          }}
          onPress={() => setModalVisible(true)}
        >
          <FontAwesome
            name="filter"
            size={14}
            color="black"
            style={{ marginRight: 6 }}
          />
          <Text>Filter</Text>
        </TouchableOpacity>

        {/* Selected Filters as Pills (scrollable) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexDirection: "row", alignItems: "center" }}
        >
          {selectedFilters.map((filter) => (
            <View
              key={filter}
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderRadius: 20,
                paddingVertical: 6,
                paddingHorizontal: 12,
                backgroundColor: "#f2f2f2",
                marginRight: 8,
              }}
            >
              <Text style={{ marginRight: 6 }}>{filter}</Text>
              <Pressable onPress={() => toggleFilter(filter)}>
                <FontAwesome name="close" size={14} color="black" />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Bottom Sheet Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
          onPress={() => setModalVisible(false)} // 👈 closes modal when tapping outside
        >
          <Pressable
            style={{
              backgroundColor: "white",
              padding: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxHeight: "70%",
            }}
            onPress={(e) => e.stopPropagation()} // 👈 prevents modal from closing when tapping inside
          >
            <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}>
              Select Filters
            </Text>

            {/* Loop through categories */}
            {Object.entries(filterCategories).map(([category, filters]) => (
              <View key={category} style={{ marginBottom: 16 }}>
                <Text
                  style={{ fontSize: 14, fontWeight: "600", marginBottom: 8 }}
                >
                  {category}
                </Text>

                <View
                  style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
                >
                  {filters.map((filter) => (
                    <TouchableOpacity
                      key={filter}
                      style={{
                        borderWidth: 1,
                        borderRadius: 20,
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                        backgroundColor: selectedFilters.includes(filter)
                          ? "#ddd"
                          : "white",
                      }}
                      onPress={() => toggleFilter(filter)}
                    >
                      <Text>{filter}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}

            {/* Apply Button */}
            <TouchableOpacity
              style={{
                marginTop: 10,
                backgroundColor: "black",
                padding: 12,
                borderRadius: 10,
                alignItems: "center",
              }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>Apply</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
