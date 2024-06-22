import React, {ForwardedRef, ReactNode, forwardRef, useRef} from 'react';
import {
  Dimensions,
  StyleSheet,
  TextInput,
  View,
  TextInputProps,
  Text,
  Pressable,
} from 'react-native';
import {colors} from '../../constants';
import {mergeRefs} from '../../utils/common';
import useThemeStorage from '@/hooks/useThemeStorage';
import { ThemeMode } from '@/types';

interface InputFieldProps extends TextInputProps {
  disabled?: boolean;
  error?: string;
  touched?: boolean;
  icon?: ReactNode;
}

const deviceHeight = Dimensions.get('screen').height;

const InputField = forwardRef(
  (
    {disabled = false, error, touched, icon = null, ...props}: InputFieldProps,
    ref?: ForwardedRef<TextInput>,
  ) => {
    const innerRef = useRef<TextInput | null>(null);
    const {theme} = useThemeStorage();
    const styles = styling(theme);
    const handlePressInput = () => {
      innerRef.current?.focus();
    };

    return (
      <Pressable onPress={handlePressInput}>
        <View
          style={[
            styles.container,
            disabled && styles.disabled,
            props.multiline && styles.multiLine,
            touched && Boolean(error) && styles.inputError,
          ]}>
          <View style={Boolean(icon) && styles.innerContainer}>
            {icon}
            <TextInput
              ref={ref ? mergeRefs(innerRef, ref) : innerRef} // inputField 에서 사용하고 있는 ref 와 받아오는 ref 둘다 사용하기 위해
              editable={!disabled}
              placeholderTextColor={colors[theme].GRAY_500}
              style={[styles.input, disabled && styles.disabled]}
              autoCapitalize="none" // 첫글자 대문자 끄기
              spellCheck={false} // 스펠 체크 끄기
              autoCorrect={false} // 자동 수정 끄기
              {...props}
            />
          </View>
          {touched && Boolean(error) && (
            <Text style={styles.error}>{error}</Text>
          )}
        </View>
      </Pressable>
    );
  },
);

const styling = (theme: ThemeMode) => StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors[theme].GRAY_200,
    padding: deviceHeight > 700 ? 15 : 10,
  },
  input: {
    fontSize: 16,
    color: colors[theme].BLACK,
    padding: 0,
  },
  disabled: {
    backgroundColor: colors[theme].GRAY_200,
    color: colors[theme].GRAY_700,
  },
  inputError: {
    borderWidth: 1,
    borderColor: colors[theme].RED_300,
  },
  error: {
    color: colors[theme].RED_500,
    fontSize: 12,
    paddingTop: 5,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  multiLine: {
    paddingBottom: deviceHeight > 700 ? 45 : 30,
  },
});

export default InputField;
