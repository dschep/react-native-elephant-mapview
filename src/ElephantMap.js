import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import MapView from "react-native-maps";
import { AppLoading } from "expo";
import * as Permissions from "expo-permissions";
import * as Localization from "expo-localization";
import Constants from "expo-constants";
import { FAB } from "react-native-paper";

import useAsyncStoragePersistedState from "./useAsyncStoragePersistedState";

export default function ElephantMap() {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState(null);
  const [initFollow, follow, setFollow] = useAsyncStoragePersistedState(
    "follow",
    true
  );
  const [initCamera, camera, setCamera] = useAsyncStoragePersistedState(
    "camera",
    {
      center: {
        latitude: 40,
        longitude: -100,
      },
      pitch: 0,
      heading: 0,
      altitude: 10,
      zoom: 1,
    }
  );
  const map = React.createRef();

  useEffect(() => {
    Permissions.askAsync(Permissions.LOCATION).then(({status}) => setStatus(status));
  }, []);

  useEffect(() => {
    if (!initCamera) return;
    map.current.animateCamera(camera);
  }, [initCamera]);

  if (!initCamera) {
    return <AppLoading />;
  }

  return (
    <View>
      <MapView
        ref={map}
        style={styles.mapStyle}
        showsUserLocation
        followsUserLocation={follow}
        showsCompass={false}
        onUserLocationChange={({ nativeEvent: { coordinate } }) =>
          setLocation(coordinate)
        }
        onPanDrag={() => setFollow(false)}
        onRegionChangeComplete={async () => {
          const newCamera = await map.current.getCamera();
          setCamera({ ...camera, ...newCamera });
        }}
        initialCamera={camera}
      />
      {status==='granted' ?<FAB
        icon="crosshairs-gps"
        onPress={() => {
          if (location) {
            map.current.animateCamera({
              ...camera,
              zoom: 16,
              center: location,
            });
          }
          setFollow(true);
        }}
        style={styles.fab}
        color={follow ? "blue" : undefined}
      />:null}
    </View>
  );
}

const styles = StyleSheet.create({
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  container: {
    flex: 1,
    backgroundColor: "#0ff",
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    backgroundColor: "white",
    position: "absolute",
    right: 10,
    bottom: 10,
  },
});
