import React from 'react';
import {Alert, StyleSheet} from 'react-native';
import { CompoundOption } from '../common/CompoundOption';
import useDetailStore from '@/store/useDetailPostStore';
import useMutateDeletePost from '@/hooks/queries/useMutateDeletePost';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FeedStackParamList } from '@/navigations/stack/FeedStackNavigator';
import { alerts, feedNavigations } from '@/constants';

interface FeedDetailOptionProps {
  isVisible: boolean;
  hideOption: () => void;
} 

function FeedDetailOption({isVisible, hideOption}: FeedDetailOptionProps) {
  const navigation = useNavigation<StackNavigationProp<FeedStackParamList>>();
  const deletePost = useMutateDeletePost();
  const {detailPost} = useDetailStore();

  const hadleDeletePost = () => {
    if (!detailPost) {
      return;
    }

    Alert.alert(alerts.DELETE_POST.TITLE, alerts.DELETE_POST.DESCRIPTION, [
      {
        text: '삭제',
        onPress: () => {
          deletePost.mutate(detailPost?.id, {
            onSuccess: () => {
              hideOption();
              navigation.goBack();
            }
          })
        },
        style: 'destructive',
      },
      {
        text: '취소',
        style: 'cancel',
      },
    ]);
  };

  const handleEditPost = () => {
    if (!detailPost) {
      return
    }
    navigation.navigate(feedNavigations.EDIT_POST, {
      location: {
        latitude: detailPost.latitude,
        longitude: detailPost.longitude,
      },
    });
    hideOption();
  }
  return (
    <CompoundOption isVisible={isVisible} hideOption={hideOption}>
      <CompoundOption.Background>
      <CompoundOption.Container>
        <CompoundOption.Button isDanger onPress={hadleDeletePost}>삭제하기</CompoundOption.Button>
        <CompoundOption.Divider/>
        <CompoundOption.Button onPress={handleEditPost}>수정하기</CompoundOption.Button>
        <CompoundOption.Divider/>
        <CompoundOption.Button onPress={hideOption}>취소하기</CompoundOption.Button>
      </CompoundOption.Container>
      </CompoundOption.Background>
    </CompoundOption>
  )
}



export default FeedDetailOption;
