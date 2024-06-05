import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {mapNavigations} from '@/constants';
import MapHomeScreen from '@/screens/map/MapHomeScreen';
import AddPostScreen from '@/screens/map/AddPostScreen';
import { LatLng } from 'react-native-maps';

export type MapStackParamList = {
  // 스크린명 : param
  // 상세페이지 같이 id 값을 쓰는 스크린에 param을 타이핑한다.
  // 스크린 명을 자주 사용하기 떄문에 상수화
  [mapNavigations.MAP_HOME]: undefined;
  [mapNavigations.ADD_POST]: {location: LatLng};
};

const Stack = createStackNavigator<MapStackParamList>();

function MapStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: {
          backgroundColor: 'white',
        },
        headerStyle: {
          backgroundColor: 'white',
          shadowColor: 'gray',
        },
        headerTitleStyle: {
          fontSize: 15,
        },
        headerTintColor: 'black',
      }}>
      <Stack.Screen
        name={mapNavigations.MAP_HOME}
        component={MapHomeScreen}
        options={{
          headerTitle: '',
          headerShown: false,
        }}
      />
            <Stack.Screen
        name={mapNavigations.ADD_POST}
        component={AddPostScreen}
        options={{
          headerTitle: '장소 추가',
        }}
      />
    </Stack.Navigator>
  );
}

export default MapStackNavigator;
