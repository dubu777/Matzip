import PostForm from '@/components/post/PostForm';
import {feedNavigations} from '@/constants';
import {FeedStackParamList} from '@/navigations/stack/FeedStackNavigator';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import React from 'react';

type EditPostScreenProps = StackScreenProps<
  FeedStackParamList,
  typeof feedNavigations.EDIT_POST
>;

function EditPostScreen({route}: EditPostScreenProps) {
  const {location} = route.params
  return <PostForm location={location} isEdit/>;
}

export default EditPostScreen;
