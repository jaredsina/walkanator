import { Colors } from "@/constants/theme";
import { CameraView } from "expo-camera";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

//eslint-disable-next-line
import c from "../../assets/images/photo.png";
export default function HomeScreen() {
  const [location, setLocation] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  const cameraRef = useRef<CameraView>(null);

  const [photo, setPhoto] = useState<string | null>(null);
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


  const takePhoto = async () => {
    if (!cameraRef.current) return;

    const result = await cameraRef.current.takePictureAsync();

    if (result) {
      setPhoto(result.uri);
    }
  };
  function handleTakePhoto() {
    console.log("test")
    takePhoto()
    console.log(photo)
    console.log("2")
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
            style={({pressed}) => [styles.circleButton, pressed && styles.circleButtonPressed]}
            onPress={handleTakePhoto}
            accessibilityLabel={"Take a photo!"}
            accessibilityRole="button"
          >
            <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing="back"
      />

            <Image source={c} style={styles.circleButtonImg}></Image>
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
    height: "60%",
    width: "80%",
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
    width: 72,
    height: 72,
    borderRadius: 64,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  circleButtonPressed: {
    borderWidth: 5,
    borderColor: "#fff",
    
  },
  circleButtonImg: {
    width: 128,
    height: 128
  }
});

