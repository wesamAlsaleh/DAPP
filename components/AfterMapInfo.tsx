import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function AfterMapInfo() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Map Information</Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          {/* <MapPin stroke="#4a5568" width={24} height={24} /> */}
          <Text style={styles.infoText}>Current Location</Text>
        </View>
        <View style={styles.infoItem}>
          {/* <Navigation stroke="#4a5568" width={24} height={24} /> */}
          <Text style={styles.infoText}>Navigation Options</Text>
        </View>
        <View style={styles.infoItem}>
          {/* <Info stroke="#4a5568" width={24} height={24} /> */}
          <Text style={styles.infoText}>Points of Interest</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => console.log("Update map pressed")}
      >
        <Text style={styles.buttonText}>Update Map</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    backgroundColor: "#fef08a",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 12,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  infoItem: {
    alignItems: "center",
  },
  infoText: {
    marginTop: 4,
    fontSize: 12,
    color: "#4b5563",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#eab308",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
