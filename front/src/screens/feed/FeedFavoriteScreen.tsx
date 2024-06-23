import FeedFavoritList from '@/components/feed/FeedFavoriteList';
import { colors } from '@/constants';
import useThemeStore from '@/store/useThemeStore';
import { ThemeMode } from '@/types';
import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

interface FeedFavoriteScreenProps {}

function FeedFavoriteScreen({}: FeedFavoriteScreenProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  return (
    <SafeAreaView style={styles.container}>
      <FeedFavoritList />
    </SafeAreaView>
  );
}

const styling = (theme: ThemeMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors[theme].WHITE,
  }

});

export default FeedFavoriteScreen;
