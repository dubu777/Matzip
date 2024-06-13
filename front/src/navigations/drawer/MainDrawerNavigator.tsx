import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';
import CalendarHomeScreen from '@/screens/calendar/CalendarHomeScreen';
import MapStackNavigator, {MapStackParamList} from '../stack/MapStackNavigator';
import {colors, mainNavigations} from '@/constants';
import {NavigatorScreenParams, RouteProp} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Dimensions } from 'react-native';
import CustomDrawerContent from './CustomDrawerContent';
import FeedStackNavigator, { FeedStackParamList } from '../stack/FeedStackNavigator';
import FeedTabNavigator, { FeedTabParamList } from '../tab/FeedTabNavigator';

export type MainDrawerParamList = {
  [mainNavigations.HOME]: NavigatorScreenParams<MapStackParamList>;
  [mainNavigations.FEED]: NavigatorScreenParams<FeedTabParamList>;
  [mainNavigations.CALENDAR]: undefined;
};

const Drawer = createDrawerNavigator<MainDrawerParamList>();

function DrawerIcons(route: RouteProp<MainDrawerParamList>, focused: boolean) {
  let iconName = '';
  switch (route.name) {
    case mainNavigations.HOME: {
      iconName = 'location-on';
      break;
    }
    case mainNavigations.FEED: {
      iconName = 'book';
      break;
    }
    case mainNavigations.CALENDAR: {
      iconName = 'event-note';
      break;
    }
  }
  return (
    <MaterialIcons
      name={iconName}
      color={focused ? colors.BLACK : colors.GRAY_500}
      size={18}
    />
  );
}

function MainDrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent} // 드로워 커스텀
      screenOptions={({route}) => ({
        headerShown: false, // 지도화면에서 헤더 없애기
        drawerType: 'front', // 드로워가 나올때 map 스크린이 밀리지 않게 설정
        drawerStyle: {
          width: Dimensions.get('screen').width * 0.6,
          backgroundColor: colors.WHITE,
        },
        drawerActiveTintColor: colors.BLACK, // 액티브된 폰트 색상
        drawerInactiveTintColor: colors.GRAY_500, // 액티브안된 폰트 색상
        drawerActiveBackgroundColor: colors.PINK_200,
        drawerInactiveBackgroundColor: colors.GRAY_100,
        drawerLabelStyle: {
          fontWeight: '600',
        },
        drawerIcon: ({focused}) => DrawerIcons(route, focused),
      })}>
      <Drawer.Screen
        name={mainNavigations.HOME}
        component={MapStackNavigator}
        options={{
          title: '홈',
          swipeEnabled: false, // 스와이프로 Drawer 열리지 않게
        }}
      />
      <Drawer.Screen
        name={mainNavigations.FEED}
        component={FeedTabNavigator}
        options={{
          title: '피드',
        }}
      />
      <Drawer.Screen
        name={mainNavigations.CALENDAR}
        component={CalendarHomeScreen}
        options={{
          title: '캘린더',
        }}
      />
    </Drawer.Navigator>
  );
}

export default MainDrawerNavigator;
