import { Colors } from "@/constants/theme";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [location, setLocation] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          if (isMounted) {
            setLocationError("Permission to access location was denied");
            setLoadingLocation(false);
          }
          return;
        }

        const position = await Location.getCurrentPositionAsync({});
        if (isMounted) {
          setLocation(
            `${position.coords.latitude}, ${position.coords.longitude}`
          );
          setLoadingLocation(false);
        }
      } catch (error) {
        if (isMounted) {
          const message =
            error instanceof Error ? error.message : "Failed to get location";
          setLocationError(message);
          setLoadingLocation(false);
        }
      }
    }

    fetchLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleTakePhoto() {
    console.log("paein");
  }

  const locationText = loadingLocation
    ? "Loading..."
    : locationError
      ? locationError
      : location ?? "Unknown";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Almanac</Text>
        <Text style={styles.subtitle}>Sign in</Text>
      </View>

      <View style={styles.mapSection}>
        <View style={styles.mapPlaceholder} />
        <Text style={styles.locationText}>Location: {locationText}</Text>
      </View>

      <View style={styles.bottomBar}>
          <Pressable
            key={"camera"}
            style={({ pressed }) => [styles.circleButton, pressed && styles.circleButtonPressed]}
            onPress={handleTakePhoto}
            accessibilityLabel={"Take a photo!"}
            accessibilityRole="button"
          >
            <Text style={styles.circleButtonText}></Text>
          </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: "center",
    paddingTop: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 0,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: Colors.text,
    textAlign: "center",
  },
  mapSection: {
    alignItems: "center",
    alignSelf: "center",
    height: "50%",
    width: "60%",
    marginTop: 24,
  },
  mapPlaceholder: {
    backgroundColor: "black",
    width: "100%",
    height: "100%",
    alignSelf: "center",
    marginTop: 8,
    borderRadius: 8,
  },
  locationText: {
    fontSize: 16,
    color: Colors.text,
    textAlign: "center",
    marginTop: 12,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    marginTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 24,
    alignSelf: "stretch",
  },
  circleButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.backgroundElement,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  circleButtonPressed: {
    backgroundColor: Colors.backgroundSelected,
    opacity: 0.9,
    transform: [{ scale: 0.96 }],
  },
  circleButtonText: {
    fontSize: 28,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 32,
  },
});

