import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';

function LoginScreen() {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const handleChangeText = (name: string, text: string) => {
    setValues({
      ...values,
      [name]: text, // 매개변수 name을 키로하고 text가 value가 됨
    });
  };

  const handleBlur = (name: string) => {
    setTouched({
      ...touched,
      [name]: true,
    });
  };
  const handleSubmit = () => {
    console.log('value', values);
    
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <InputField
          placeholder="이메일"
          error={'이메일을 입력하세요'}
          touched={touched.email}
          inputMode="email"
          value={values.email}
          onChangeText={text => handleChangeText('email', text)}
          onBlur={() => handleBlur('email')}
        />
        <InputField
          placeholder="비밀번호"
          error={'비밀번호를 입력하세요'}
          touched={touched.password}
          secureTextEntry
          value={values.password}
          onChangeText={text => handleChangeText('password', text)}
          onBlur={() => handleBlur('password')}
        />
      </View>
      <CustomButton
        label='로그인'
        variant='filled'
        onPress={handleSubmit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  inputContainer: {
    gap: 10,
    marginBottom: 30,
  },
});

export default LoginScreen;
