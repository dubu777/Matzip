import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {
  Button,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';
import {authNavigations} from '@/constants/navigations';
import CustomButton from '@/components/common/CustomButton';


type AuthHomeScreenProps = StackScreenProps<AuthStackParamList>;

function AuthHomeScreen({navigation}: AuthHomeScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imgContainer}>
        <Image
          resizeMode="contain"
          style={styles.img}
          source={require('@/assets/matzip.png')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          label="로그인하기"
          onPress={() => navigation.navigate(authNavigations.LOGIN)}
        />
        <CustomButton
          label="회원가입하기"
          variant="outlined"
          onPress={() => navigation.navigate(authNavigations.SIGNUP)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 30,
    alignItems: 'center',
  },
  imgContainer: {
    flex: 1.5,
    width: Dimensions.get('screen').width / 2,
  },
  img: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    flex: 1,
    gap: 10,
  },
});

export default AuthHomeScreen;
