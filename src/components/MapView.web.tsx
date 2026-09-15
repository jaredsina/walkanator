import React, { useEffect, useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

export type WebRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
};

type WebMapViewProps = {
  style?: StyleProp<ViewStyle>;
  initialRegion?: WebRegion;
  region?: WebRegion;
  showsUserLocation?: boolean;
  // Accepted for API compatibility with react-native-maps; ignored on web
  // (native <Marker> elements can't render inside Leaflet).
  children?: React.ReactNode;
};

const DEFAULT_CENTER: [number, number] = [37.78825, -122.4324];
const LEAFLET_CSS_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_IMG = (file: string) =>
  `https://unpkg.com/leaflet@1.9.4/dist/images/${file}`;

function deltasToZoom(region?: WebRegion): number {
  const delta = region?.longitudeDelta ?? region?.latitudeDelta ?? 0.05;
  if (!delta || delta <= 0) return 13;
  const zoom = Math.round(Math.log(360 / delta) / Math.LN2);
  return Math.max(2, Math.min(18, zoom));
}

// NOTE: Leaflet touches `window` at import time, and Expo Router prerenders
// web routes in Node during `expo export`. A static `import "react-leaflet"`
// therefore crashes the export with "window is not defined". Everything
// Leaflet-related is loaded lazily after mount so the server render only
// ever sees a plain <View>.
export default function WebMapView({
  style,
  initialRegion,
  region,
  showsUserLocation,
}: WebMapViewProps) {
  const [libs, setLibs] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;

    // Leaflet CSS via CDN link (avoids bundler CSS-in-Node issues entirely).
    const link = document.querySelector<HTMLLinkElement>(
      `link[href="${LEAFLET_CSS_URL}"]`
    );
    let ownedLink = false;
    if (!link) {
      const el = document.createElement("link");
      el.rel = "stylesheet";
      el.href = LEAFLET_CSS_URL;
      document.head.appendChild(el);
      ownedLink = true;
    }

    (async () => {
      const [reactLeaflet, L] = await Promise.all([
        import("react-leaflet"),
        import("leaflet"),
      ]);
      if (cancelled) return;
      // Fix broken default marker icons under Metro (point at CDN assets).
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: LEAFLET_IMG("marker-icon-2x.png"),
        iconUrl: LEAFLET_IMG("marker-icon.png"),
        shadowUrl: LEAFLET_IMG("marker-shadow.png"),
      });
      setLibs({ ...reactLeaflet, L });
    })().catch((e) => console.warn("[MapView.web] failed to load Leaflet", e));

    return () => {
      cancelled = true;
      if (ownedLink) {
        document.querySelector(`link[href="${LEAFLET_CSS_URL}"]`)?.remove();
      }
    };
  }, []);

  const activeRegion = region ?? initialRegion;
  const center: [number, number] = activeRegion
    ? [activeRegion.latitude, activeRegion.longitude]
    : DEFAULT_CENTER;

  // Server render + first client paint: plain View with the same style so
  // layout matches and no DOM APIs are touched.
  if (!libs) {
    return <View style={style} />;
  }

  const { MapContainer, TileLayer, CircleMarker, useMap } = libs;

  const Recenter = ({ at }: { at: [number, number] }) => {
    const map = useMap();
    const key = `${at[0]},${at[1]}`;
    useEffect(() => {
      map.setView(at, map.getZoom());
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);
    return null;
  };

  return (
    <View style={style}>
      <MapContainer
        center={center}
        zoom={deltasToZoom(activeRegion)}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter at={center} />
        {showsUserLocation && activeRegion ? (
          <CircleMarker center={center} radius={8} />
        ) : null}
      </MapContainer>
    </View>
  );
}
