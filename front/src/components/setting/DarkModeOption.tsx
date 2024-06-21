import React from 'react';
import {StyleSheet, View} from 'react-native';
import { CompoundOption } from '../common/CompoundOption';

interface DarkModeOptionProps {
  isVisible: boolean;
  hideOption: () => void;
}

function DarkModeOption({isVisible, hideOption}: DarkModeOptionProps) {
  return (
    <CompoundOption isVisible={isVisible} hideOption={hideOption}>
      <CompoundOption.Background>
        <CompoundOption.Container>
          <CompoundOption.Button>라이트 모드</CompoundOption.Button>
          <CompoundOption.Divider/>
          <CompoundOption.Button>다크 모드</CompoundOption.Button>
          <CompoundOption.Divider/>
          <CompoundOption.Button>시스템 기본값 모드</CompoundOption.Button>
          <CompoundOption.Divider/>
        </CompoundOption.Container>
        <CompoundOption.Container>
          <CompoundOption.Button onPress={hideOption}>취소</CompoundOption.Button>
        </CompoundOption.Container>
      </CompoundOption.Background>
    </CompoundOption>
  )
}

const styles = StyleSheet.create({});

export default DarkModeOption;
