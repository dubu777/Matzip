import CustomButton from '@/components/common/CustomButton';
import InputField from '@/components/common/InputField';
import PreviewImageList from '@/components/common/PreviewImageList';
import AddPostHeaderRight from '@/components/post/AddPostHeaderRight';
import DatePickerOption from '@/components/post/DatePickerOption';
import ImageInput from '@/components/post/ImageInput';
import MarkerSelector from '@/components/post/MarkerSelector';
import ScoreInput from '@/components/post/ScoreInput';
import {colors} from '@/constants';
import useMutateCreatePost from '@/hooks/queries/useMutateCreatePost';
import useMutateUpdatePost from '@/hooks/queries/useMutateUpdatePost';
import useForm from '@/hooks/useForm';
import useGetAddress from '@/hooks/useGetAddress';
import useImagePicker from '@/hooks/useImagePicker';
import useModal from '@/hooks/useModal';
import usePermission from '@/hooks/usePermission';
import { FeedStackParamList } from '@/navigations/stack/FeedStackNavigator';
import useDetailStore from '@/store/useDetailPostStore';
import useThemeStore from '@/store/useThemeStore';
import {MarkerColor} from '@/types/domain';
import {getDateWithSeparator, validateAddPost} from '@/utils';
import { useNavigation } from '@react-navigation/native';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LatLng } from 'react-native-maps';
import Octicons from 'react-native-vector-icons/Octicons';

interface PostFormProps {
  location: LatLng;
  isEdit?: boolean;
}

function PostForm({location, isEdit = false}: PostFormProps) {
  const {theme} = useThemeStore();
  const navigation = useNavigation<StackNavigationProp<FeedStackParamList>>()
  const descriptionRef = useRef<TextInput | null>(null);
  const createPost = useMutateCreatePost();
  const updatePost = useMutateUpdatePost();
  const {detailPost} = useDetailStore();
  const isEditMode = isEdit && detailPost; // isEdit이 true 이고, detailPost가 있다면 
  const address = useGetAddress(location);
  const addPost = useForm({
    initialValue: {
      title: isEditMode ? detailPost.title : '',
      description: isEditMode ? detailPost.description : '',
    },
    validate: validateAddPost,
  });
  const [markerColor, setMarkerColor] = useState<MarkerColor>(isEditMode ? detailPost.color : 'RED');
  const [score, setScore] = useState(isEditMode ? detailPost.score : 5);
  const [date, setDate] = useState(isEditMode ? new Date(String(detailPost.date)) : new Date());
  const [isPicked, setIsPicked] = useState(false);
  const datePickerModal = useModal();
  const imagePicker = useImagePicker({
    initialImages: isEditMode ? detailPost.images : [],
  });
  usePermission('PHOTO');
  const handleSelectMarker = (name: MarkerColor) => {
    setMarkerColor(name);
  };

  const handleChangeScore = (value: number) => {
    setScore(value);
  };

  const hadleChangeDate = (pickedDate: Date) => {
    setDate(pickedDate);
  };

  const handleConfirmDate = () => {
    setIsPicked(true);
    datePickerModal.hide();
  };
  const handleSubmit = () => {
    const body = {
      date,
      title: addPost.values.title,
      description: addPost.values.description,
      color: markerColor,
      score,
      imageUris: imagePicker.imageUris,
    };
    if (isEditMode) {
      updatePost.mutate(
        {
          id: detailPost.id,
          body
        },
        {
          onSuccess: () => navigation.goBack(),
        },
      );
      return
    }
    createPost.mutate(
      {address, ...location, ...body},
      {
        onSuccess: () => navigation.goBack(),
      },
    );
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => AddPostHeaderRight(handleSubmit),
    });
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        <View style={styles.inputContainer}>
          <InputField
            value={address}
            disabled
            icon={
              <Octicons name="location" size={16} color={colors[theme].GRAY_500} />
            }
          />
          <CustomButton
            variant="outlined"
            size="large"
            label={
              isPicked || isEdit ? `${getDateWithSeparator(date, '. ')}` : '날짜 선택'
            }
            onPress={datePickerModal.show}
          />
          <InputField
            {...addPost.getTextInputProps('title')}
            error={addPost.errors.title}
            touched={addPost.touched.title}
            placeholder="제목을 입력하세요."
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => {
              descriptionRef.current?.focus();
            }}
          />
          <InputField
            {...addPost.getTextInputProps('description')}
            error={addPost.errors.description}
            touched={addPost.touched.description}
            ref={descriptionRef}
            placeholder="기록하고 싶은 내용을 입력하세요. (선택)"
            returnKeyType="next"
            multiline
          />
          <MarkerSelector
            score={score}
            markerColor={markerColor}
            onPressMarker={handleSelectMarker}
          />
          <DatePickerOption
            date={date}
            onChangeDate={hadleChangeDate}
            onConfirmDate={handleConfirmDate}
            isVisible={datePickerModal.isVisible}
          />
          <ScoreInput score={score} onChangeScore={handleChangeScore} />
          <View style={styles.imagesViewer}>
            <ImageInput onChange={imagePicker.handleChange} />
            <PreviewImageList
              imageUris={imagePicker.imageUris}
              onDelete={imagePicker.delete}
              onChangeOrder={imagePicker.changeOrder}
              showOption={true}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    marginBottom: 10,
  },
  inputContainer: {
    gap: 20,
    marginBottom: 20,
  },
  imagesViewer: {
    flexDirection: 'row',
  }
});

export default PostForm;
