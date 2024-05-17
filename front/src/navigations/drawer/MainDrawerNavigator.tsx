import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';
import FeedHomeScreen from '@/screens/feed/FeedHomeScreen';
import CalendarHomeScreen from '@/screens/calendar/CalendarHomeScreen';
import MapStackNavigator, { MapStackParamList } from '../stack/MapStackNavigator';
import { mainNavigations } from '@/constants';
import { NavigatorScreenParams } from '@react-navigation/native';

export type MainDrawerParamList = {
  [mainNavigations.HOME]: NavigatorScreenParams<MapStackParamList>;
  [mainNavigations.FEED]: undefined;
  [mainNavigations.CALENDAR]: undefined;
};

const Drawer = createDrawerNavigator();

function MainDrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,  // 지도화면에서 헤더 없애기
        drawerType: 'front', // 드로워가 나올때 map 스크린이 밀리지 않게 설정
      }}>
      <Drawer.Screen
        name="MapHome"
        component={MapStackNavigator}
        options={{
          title: '홈',
        }}
      />
      <Drawer.Screen
        name="FeedHome"
        component={FeedHomeScreen}
        options={{
          title: '피드',
        }}
      />
      <Drawer.Screen
        name="CalendarHome"
        component={CalendarHomeScreen}
        options={{
          title: '캘린더',
        }}
      />
    </Drawer.Navigator>
  );
}

export default MainDrawerNavigator;
