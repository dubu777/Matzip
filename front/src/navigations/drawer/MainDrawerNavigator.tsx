import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';
import CalendarHomeScreen from '@/screens/calendar/CalendarHomeScreen';
import MapStackNavigator, {MapStackParamList} from '../stack/MapStackNavigator';
import {colors, mainNavigations} from '@/constants';
import {NavigatorScreenParams, RouteProp} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Dimensions} from 'react-native';
import CustomDrawerContent from './CustomDrawerContent';
import FeedStackNavigator, {
  FeedStackParamList,
} from '../stack/FeedStackNavigator';
import FeedTabNavigator, {FeedTabParamList} from '../tab/FeedTabNavigator';
import FeedHomeHeaderLeft from '@/components/feed/FeedHomeHeaderLeft';
import SettingStackNavigator, { SettingStackParamList } from '../stack/SettingStackNavigator';
import useThemeStore from '@/store/useThemeStore';


// NavigatorScreenParams은 중첩된 네비게이터에 매개변수를 전달할 때 사용한다.
// 중첩된 네비게이터는 드로어 네비게이터 안에 스택 네비게이터를 포함하는것
// 아래는 드로워 네이게이터에 스택, 탭 네비게이터의 매개변수를 전달한다.
export type MainDrawerParamList = {
  [mainNavigations.HOME]: NavigatorScreenParams<MapStackParamList>;
  [mainNavigations.FEED]: NavigatorScreenParams<FeedTabParamList>;
  [mainNavigations.CALENDAR]: undefined;
  [mainNavigations.SETTING]: NavigatorScreenParams<SettingStackParamList>;
};

const Drawer = createDrawerNavigator<MainDrawerParamList>();

function DrawerIcons(route: RouteProp<MainDrawerParamList>, focused: boolean) {
  const {theme} = useThemeStore();
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
    case mainNavigations.SETTING: {
      iconName = 'settings';
      break;
    }
  }
  return (
    <MaterialIcons
      name={iconName}
      color={focused ? colors[theme].BLACK : colors[theme].GRAY_500}
      size={18}
    />
  );
}

function MainDrawerNavigator() {
  const {theme} = useThemeStore();
  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent} // 드로워 커스텀
      screenOptions={({route}) => ({
        headerShown: false, // 지도화면에서 헤더 없애기
        drawerType: 'front', // 드로워가 나올때 map 스크린이 밀리지 않게 설정
        drawerStyle: {
          width: Dimensions.get('screen').width * 0.6,
          backgroundColor: colors[theme].WHITE,
        },
        drawerActiveTintColor: colors[theme].BLACK, // 액티브된 폰트 색상
        drawerInactiveTintColor: colors[theme].GRAY_500, // 액티브안된 폰트 색상
        drawerActiveBackgroundColor: colors[theme].PINK_200,
        drawerInactiveBackgroundColor: colors[theme].GRAY_100,
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
        options={({navigation}) => ({
          title: '캘린더',
          headerShown: true,
          headerLeft: () => FeedHomeHeaderLeft(navigation),
        })}
      />
      <Drawer.Screen
        name={mainNavigations.SETTING}
        component={SettingStackNavigator}
        options={{
          title: '설정',
          // 드로워 네비게이터에서 안보이게 설정(커스텀 드로워에 표시하려고)
          drawerItemStyle: {
            height: 0
          }
        }}
      />
    </Drawer.Navigator>
  );
}

export default MainDrawerNavigator;
