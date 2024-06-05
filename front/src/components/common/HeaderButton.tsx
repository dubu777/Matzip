import {colors} from '@/constants';
import React, {ReactNode} from 'react';
import {Pressable, PressableProps, StyleSheet, Text, View} from 'react-native';

// HeaderButtonProps가 PressableProps를 확장(extends)함으로써,
// Pressable에서 사용 가능한 모든 props가 HeaderButton에도 자동으로 포함됨.
interface HeaderButtonProps extends PressableProps {
  labelText?: string;
  icon?: ReactNode;
  hasError?: boolean;
}

function HeaderButton({
  labelText,
  icon,
  hasError = false,
  ...props
}: HeaderButtonProps) {
  return (
    <Pressable disabled={hasError} style={styles.container} {...props}>
      {!labelText && icon}
      {!icon && labelText && (
        <Text style={[styles.text, hasError && styles.textError]}>
          {labelText}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.PINK_700,
  },
  textError: {
    color: colors.GRAY_200,
  },
});

export default HeaderButton;
