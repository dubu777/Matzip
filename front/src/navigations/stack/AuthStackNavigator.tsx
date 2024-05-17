import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet} from 'react-native';
import LoginScreen from '@/screens/auth/LoginScreen';
import AuthHomeScreen from '@/screens/auth/AuthHomeScreen';
import {authNavigations} from '@/constants';
import SignupScreen from '@/screens/auth/SignupScreen';

export type AuthStackParamList = {
  // 스크린명 : param
  // 상세페이지 같이 id 값을 쓰는 스크린에 param을 타이핑한다.
  // 스크린 명을 자주 사용하기 떄문에 상수화
  [authNavigations.AUTH_HOME]: undefined;
  [authNavigations.LOGIN]: undefined;
  [authNavigations.SIGNUP]: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

function AuthStackNavigator() {
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
        name={authNavigations.AUTH_HOME}
        component={AuthHomeScreen}
        options={{
          headerTitle: '',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={authNavigations.LOGIN}
        component={LoginScreen}
        options={{
          headerTitle: '로그인',
        }}
      />
      <Stack.Screen
        name={authNavigations.SIGNUP}
        component={SignupScreen}
        options={{
          headerTitle: '회원가입',
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

export default AuthStackNavigator;
