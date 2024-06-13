import FeedFavoritList from '@/components/feed/FeedFavoriteList';
import { colors } from '@/constants';
import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

interface FeedFavoriteScreenProps {}

function FeedFavoriteScreen({}: FeedFavoriteScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <FeedFavoritList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  }

});

export default FeedFavoriteScreen;
