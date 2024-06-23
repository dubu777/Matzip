import React from 'react';
import {StyleSheet, View} from 'react-native';
import HeaderButton from '../common/HeaderButton';
import {colors} from '@/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {MainDrawerParamList} from '@/navigations/drawer/MainDrawerNavigator';
import {StackNavigationProp} from '@react-navigation/stack';
import {SettingStackParamList} from '@/navigations/stack/SettingStackNavigator';
import useThemeStore from '@/store/useThemeStore';

interface SettingHeaderLeftProps {}

type Navigation = CompositeNavigationProp<
  DrawerNavigationProp<MainDrawerParamList>,
  StackNavigationProp<SettingStackParamList>
>;

function SettingHeaderLeft({}: SettingHeaderLeftProps) {
  const {theme} = useThemeStore();
  const navigation = useNavigation<Navigation>();
  return (
    <HeaderButton
      icon={<Ionicons name="menu" color={colors[theme].BLACK} size={25} />}
      onPress={() => navigation.openDrawer()}
    />
  );
}


export default SettingHeaderLeft;
