import React, { useRef } from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

// Coordinates for Knoxville
const STARTING_COORDINATES = {
  latitude: 36.0,
  longitude: -83.92,
  latitudeDelta: 0.85,
  longitudeDelta: 0.65,
};

const LEGEND = [
  { label: "1-9", color: "yellow" },
  { label: "10-49", color: "blue" },
  { label: "50-199", color: "green" },
  { label: "200-499", color: "purple" },
  { label: "500+", color: "orange" },
];

const PLACEHOLDER_OUTAGES = [
  {
    id: 1,
    latitude: 35.93,
    longitude: -83.85,
    range: "10-49",
    color: "blue",
  },
  {
    id: 2,
    latitude: 36.08,
    longitude: -83.95,
    range: "1-9",
    color: "yellow",
  },
  {
    id: 3,
    latitude: 35.98,
    longitude: -84.1,
    range: "10-49",
    color: "blue",
  },
  {
    id: 4,
    latitude: 35.91,
    longitude: -84.05,
    range: "1-9",
    color: "yellow",
  },
  {
    id: 5,
    latitude: 36.15,
    longitude: -84.08,
    range: "10-49",
    color: "blue",
  },
];

export default function OutagesScreen() {
  const mapRef = useRef<MapView>(null);
  const { height } = useWindowDimensions();

  const checkOutageButton = () => {
    Linking.openURL("https://www.kub.org/outage/map");
  };

  return (
    <SafeAreaView style={styles.safe}  edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text allowFontScaling={false} style={styles.headerTitle}>Outages</Text>
      </View>
      {/* Map is 45% height of the screen to allow room for buttons under it*/}
      <MapView
        ref={mapRef}
        style={{ height: height * 0.45 }}
        initialRegion={STARTING_COORDINATES}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
      >
        {PLACEHOLDER_OUTAGES.map((outage) => (
          <Marker
            key={outage.id}
            coordinate={{
              latitude: outage.latitude,
              longitude: outage.longitude,
            }}
            title={`Outage: ${outage.range} customers`}
            pinColor={outage.color}
          />
        ))}
      </MapView>

      {/* Bottom info panel */}
      <View style={styles.panel}>
        <Text allowFontScaling={false} style={styles.panelTitle}>Customers without Power:</Text>

        {/* Legend row */}
        <View style={styles.legendRow}>
          {LEGEND.map((item) => (
            <View key={item.label} style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: item.color }]}
              />
              <Text allowFontScaling={false} style={styles.legendLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* CTA button */}
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={checkOutageButton}
          activeOpacity={0.8}
        >
          <Text allowFontScaling={false} style={styles.ctaBtnText}>CHECK OUTAGE STATUS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#091C3C",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 18,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 30,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  panel: {
    backgroundColor: "#091C3C",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },
  panelTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 14,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flexShrink: 1
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    color: "#A0B3D3",
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    flexShrink: 1
  },
  ctaBtn: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#2e4a6a",
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
  },
  ctaBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1.4,
  },
});
