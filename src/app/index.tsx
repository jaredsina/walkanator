import { Colors } from "@/constants/theme";
import { Button, Host } from "@expo/ui";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
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

      <View style={styles.cornerStuff}>
        <Host matchContents>
          <Button label="Take photo!" onPress={handleTakePhoto} />
        </Host>
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
    marginTop: 24,
  },
  mapPlaceholder: {
    backgroundColor: "black",
    width: "80%",
    height: 200,
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
  cornerStuff: {
    position: "absolute",
    bottom: 16,
    left: 16,
  },
});
