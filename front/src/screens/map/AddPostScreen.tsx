import React from 'react';
import PostForm from '@/components/post/PostForm';
import {mapNavigations} from '@/constants';
import {MapStackParamList} from '@/navigations/stack/MapStackNavigator';
import {StackScreenProps} from '@react-navigation/stack';

type AddPostScreenProps = StackScreenProps<
  MapStackParamList,
  typeof mapNavigations.ADD_POST
>;

function AddPostScreen({route}: AddPostScreenProps) {
  const {location} = route.params;
  return <PostForm location={location} />;
}
export default AddPostScreen;
