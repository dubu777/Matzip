import {alerts, colors, mapNavigations} from '@/constants';
import {MainDrawerParamList} from '@/navigations/drawer/MainDrawerNavigator';
import {MapStackParamList} from '@/navigations/stack/MapStackNavigator';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useRef, useState} from 'react';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import MapView, {
  Callout,
  LatLng,
  LongPressEvent,
  Marker,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useUserLocation from '@/hooks/useUserLocation';
import usePermission from '@/hooks/usePermission';
import Ioniccons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import mapStyle from '@/style/mapStyle';
import CustomMarker from '@/components/CustomMarker';
import { useGetMarkers } from '@/hooks/queries/useGetMarkers';
import useModal from '@/hooks/useModal';
import MarkerModal from '@/components/MarkerModal';
import Config from 'react-native-config';

console.log(Config.GOOGLE_API_KEY, 'config');
console.log(Config.TEST, 'config test');

type Navigation = CompositeNavigationProp<
  StackNavigationProp<MapStackParamList>,
  DrawerNavigationProp<MainDrawerParamList>
>;

// 현재 위치로 이동
// 1. 나의 위치를 구하고
// 2. 그 위치로 이동

function MapHomeScreen() {
  const inset = useSafeAreaInsets(); // 아이폰은 헤더가 없어서 노치를 계산
  const navigation = useNavigation<Navigation>();
  const mapRef = useRef<MapView | null>(null);
  const {userLocation, isUserLocationError} = useUserLocation();
  const {data: markers=[]} = useGetMarkers();
  const [selectLocation, setSelectLocation] = useState<LatLng | null>();
  const [markerId, setMarkerId] = useState<number | null>(null);
  const markerModal = useModal();
  usePermission('LOCATION');

  const moveMapView = (coordinate:LatLng) => {
    mapRef.current?.animateToRegion({
      ...coordinate,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  }

  const handleLongPressMapView = ({nativeEvent}: LongPressEvent) => {
    setSelectLocation(nativeEvent.coordinate);
  };

  const handlePressMarker = (id: number, coordinate:LatLng) => {
    moveMapView(coordinate)
    setMarkerId(id)
    markerModal.show();
  }
  const handlePressAddPost = () => {
    if(!selectLocation) {
      return Alert.alert(
        alerts.NOT_SELECTED_LOCATION.TITLE,
        alerts.NOT_SELECTED_LOCATION.DESCRIPTION
      )
    }

    navigation.navigate(mapNavigations.ADD_POST, {
      location: selectLocation
    })
    // 장소 추가 화면 갔다가 돌아왔을때는 마커 위치 초기화
    setSelectLocation(null) 
  }
  const handlePressUserLocation = () => {
    if (isUserLocationError) {
      // 에러메세지 표시
      return;
    }

    // ref를 이용해서 해당 위치로 이동
    moveMapView(userLocation)
  };

  return (
    <>
      <MapView
        ref={mapRef}
        style={styles.container}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        followsUserLocation
        showsMyLocationButton
        customMapStyle={mapStyle}
        onLongPress={handleLongPressMapView}
        region={{
          ...userLocation,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        {markers.map(({id, color, score, ...coordinate}) => (
          <CustomMarker
            key={id}
            color={color}
            score={score}
            coordinate={coordinate}
            onPress={() => handlePressMarker(id, coordinate)}
          />
        ))}
        {selectLocation && (
          <Callout>
            <Marker coordinate={selectLocation} />
          </Callout>
        )}
      </MapView>
      <Pressable
        style={[styles.drawerButton, {top: inset.top || 20}]}
        onPress={() => navigation.openDrawer()}>
        <Ioniccons name="menu" color={colors.WHITE} size={25} />
      </Pressable>
      <View style={styles.buttonList}>
        <Pressable style={styles.mapButton} onPress={handlePressAddPost}>
          <MaterialIcons name="add" color={colors.WHITE} size={25} />
        </Pressable>
        <Pressable style={styles.mapButton} onPress={handlePressUserLocation}>
          <MaterialIcons name="my-location" color={colors.WHITE} size={25} />
        </Pressable>
      </View>
      <MarkerModal markerId={markerId} isVisible={markerModal.isVisible} hide={markerModal.hide}/>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerButton: {
    position: 'absolute',
    left: 0,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.PINK_700,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    shadowColor: colors.BLACK,
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.5,
    elevation: 4,
  },
  buttonList: {
    position: 'absolute',
    bottom: 30,
    right: 15,
  },
  mapButton: {
    backgroundColor: colors.PINK_700,
    marginVertical: 5,
    height: 48,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    shadowColor: colors.BLACK,
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.5,
    elevation: 2,
  },
});

export default MapHomeScreen;
