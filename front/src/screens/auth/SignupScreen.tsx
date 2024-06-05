import React, { useRef } from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import useForm from '@/hooks/useForm';
import {validateSignup} from '@/utils';
import { TextInput } from 'react-native-gesture-handler';
import useAuth from '@/hooks/queries/useAuth';
import InputField from '@/components/common/InputField';
import CustomButton from '@/components/common/CustomButton';

function SignupScreen() {
  const passwordRef = useRef<TextInput | null>(null);
  const {signupMutation, loginMutation} = useAuth();
  const passwordConfirmRef = useRef<TextInput | null>(null);
  const signup = useForm({
    initialValue: {email: '', password: '', passwordConfirm: ''},
    validate: validateSignup,
  });
  
  const handleSubmit = () => {
    const {email, password} = signup.values
    signupMutation.mutate(signup.values, {
      onSuccess: () => loginMutation.mutate({email, password}),
      // 쿼리마다 옵션을 받을 수 있게  ...mutationOptions 와 같이 해놔서 onSuccess를 사용할 수 있다.
    })
    
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <InputField
          autoFocus
          placeholder="이메일"
          error={signup.errors.email}
          touched={signup.touched.email}
          inputMode="email"
          returnKeyType='next' // 키패드에서 제출버튼이 다음버튼으로 됨
          blurOnSubmit={false} // 제출해도 키패트가 닫히지 않음
          onSubmitEditing={() => passwordRef.current?.focus()} // 제출 후 ref를 이용해서 password에 포커스되게 힘
          {...signup.getTextInputProps('email')}
        />
        <InputField
          ref={passwordRef}
          placeholder="비밀번호"
          textContentType='oneTimeCode' // strong password 설정 안뜨게
          error={signup.errors.password}
          touched={signup.touched.password}
          secureTextEntry
          returnKeyType='next'
          blurOnSubmit={false}
          onSubmitEditing={() => passwordConfirmRef.current?.focus()}
          {...signup.getTextInputProps('password')}
        />
        <InputField
          ref={passwordConfirmRef}
          placeholder="비밀번호 확인"
          error={signup.errors.passwordConfirm}
          touched={signup.touched.passwordConfirm}
          secureTextEntry
          onSubmitEditing={handleSubmit}
          {...signup.getTextInputProps('passwordConfirm')}
        />
      </View>
      <CustomButton label="회원가입" onPress={handleSubmit}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 30,
  },
  inputContainer: {
    gap: 20,
    marginBottom: 30,
  },
});

export default SignupScreen;
