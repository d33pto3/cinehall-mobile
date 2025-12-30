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
    <View className="mb-2">
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
            borderColor: "#FAAA47",
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
            color="#FAAA47"
            style={{ marginRight: 6 }}
          />
          <Text className="text-white font-medium">Filter</Text>
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
                borderColor: "#FAAA47",
                borderRadius: 20,
                paddingVertical: 6,
                paddingHorizontal: 12,
                backgroundColor: "#1E1E1E",
                marginRight: 8,
              }}
            >
              <Text style={{ marginRight: 6, color: "white" }}>{filter}</Text>
              <Pressable onPress={() => toggleFilter(filter)}>
                <FontAwesome name="close" size={14} color="#FAAA47" />
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
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
          onPress={() => setModalVisible(false)} // 👈 closes modal when tapping outside
        >
          <Pressable
            style={{
              backgroundColor: "#1A1A1A",
              padding: 24,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              maxHeight: "70%",
              borderTopWidth: 1,
              borderTopColor: "#FAAA47",
            }}
            onPress={(e) => e.stopPropagation()} // 👈 prevents modal from closing when tapping inside
          >
            <Text style={{ fontSize: 20, fontWeight: "800", marginBottom: 20, color: "#FAAA47" }}>
              Filter Movies
            </Text>

            {/* Loop through categories */}
            {Object.entries(filterCategories).map(([category, filters]) => (
              <View key={category} style={{ marginBottom: 20 }}>
                <Text
                  style={{ fontSize: 14, fontWeight: "700", marginBottom: 12, color: "#FFFFFF" }}
                >
                  {category}
                </Text>

                <View
                  style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}
                >
                  {filters.map((filter) => (
                    <TouchableOpacity
                      key={filter}
                      style={{
                        borderWidth: 1,
                        borderColor: selectedFilters.includes(filter) ? "#FAAA47" : "#2E2E2E",
                        borderRadius: 20,
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        backgroundColor: selectedFilters.includes(filter)
                          ? "#FAAA47"
                          : "#1E1E1E",
                      }}
                      onPress={() => toggleFilter(filter)}
                    >
                      <Text style={{ color: selectedFilters.includes(filter) ? "#121212" : "#CAC1C1", fontWeight: "600" }}>{filter}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}

            {/* Apply Button */}
            <TouchableOpacity
              style={{
                marginTop: 10,
                backgroundColor: "#FAAA47",
                padding: 16,
                borderRadius: 16,
                alignItems: "center",
              }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "#121212", fontWeight: "800", fontSize: 16 }}>Apply Filters</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
