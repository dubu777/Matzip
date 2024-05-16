import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuth from '../../hooks/queries/useAuth';



function MapHomeScreen() {
  const {logoutMutation} = useAuth();

  return (
    <SafeAreaView>
      <Text>맵홈</Text>
      <Button title='로그아웃' onPress={() => logoutMutation.mutate()}/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({});

export default MapHomeScreen;
