import {colors} from '@/constants';
import {MainDrawerParamList} from '@/navigations/drawer/MainDrawerNavigator';
import {MapStackParamList} from '@/navigations/stack/MapStackNavigator';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import MapView, {LatLng, PROVIDER_GOOGLE} from 'react-native-maps';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Geolocation from '@react-native-community/geolocation';

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
  const [userLocation, setUserLocation] = useState<LatLng>();

  useEffect(() => {
    Geolocation.getCurrentPosition(info => {
      const {latitude, longitude} = info.coords
      setUserLocation({latitude, longitude})
      console.log('내 위치', latitude, longitude);
      
    })
  }, [])

  return (
    <>
      <MapView
        style={styles.container}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        followsUserLocation
        showsMyLocationButton
      />
      <Pressable
        style={[styles.drawerButton, {top: inset.top || 20}]}
        onPress={() => navigation.openDrawer()}>
        <Text>서랍</Text>
      </Pressable>
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
});

export default MapHomeScreen;
