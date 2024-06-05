import { colors } from '@/constants';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  PressableProps,
  Dimensions,
  View,
} from 'react-native';

// PressableProps 를 받아와서 확장시켜준다.
interface CustomButtonProps extends PressableProps {
  label: string;
  variant?: 'filled' | 'outlined';
  size?: 'large' | 'medium';
  inVailed?: boolean;
}

const deviceHeight = Dimensions.get('screen').height;

function CustomButton({
  label,
  variant = 'filled',
  size = 'large',
  inVailed = false,
  ...props
}: // ...props 로 PressableProps를 전부 받아준다.
CustomButtonProps) {
  return (
    <Pressable
      disabled={inVailed}
      style={({pressed}) => [
        styles.container,
        pressed ? styles[`${variant}Pressed`] : styles[variant],
        inVailed && styles.inVailed,
      ]}
      {...props} // props를 넣어주면 PressableProps에 있는 props 들을 일일이 추가하지 않고 한번에 넘겨줄수 있다.
    >
      <View style={styles[size]}>
      <Text style={[styles.text, styles[`${variant}Text`]]}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 3,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  inVailed: {
    opacity: 0.5,
  },
  filled: {
    backgroundColor: colors.PINK_700,
  },
  outlined: {
    borderColor: colors.PINK_700,
    borderWidth: 1,
  },
  filledPressed: {
    backgroundColor: colors.PINK_500,
  },
  outlinedPressed: {
    borderColor: colors.PINK_700,
    borderWidth: 1,
    opacity: 0.5,
  },
  large: {
    width: '100%',
    paddingVertical: deviceHeight > 700 ? 15 : 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  medium: {
    width: '50%',
    paddingVertical: deviceHeight > 700 ? 12 : 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  filledText: {
    color: colors.WHITE,
  },
  outlinedText: {
    color: colors.PINK_700,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },

});

export default CustomButton;
