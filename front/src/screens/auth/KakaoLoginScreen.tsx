import { colors } from '@/constants';
import useAuth from '@/hooks/queries/useAuth';
import axios from 'axios';
import React, { useState } from 'react';
import {ActivityIndicator, Dimensions, Platform, SafeAreaView} from 'react-native';
import {StyleSheet, View} from 'react-native';
import Config from 'react-native-config';
import WebView, { WebViewMessageEvent, WebViewNavigation } from 'react-native-webview';

const KAKAO_REDIRECT_URI = `${
  Platform.OS === 'ios' ? 'http://localhost:3030/' : 'http://10.0.2.2:3030/'
}auth/oauth/kakao`;

function KakaoLoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [isChangeNavigation, setIsChangeNavigation] = useState(true);
  const {kakaoLoginMutation} = useAuth();
  
  const handleOnMessage = (event: WebViewMessageEvent) => {
    // KAKAO_REDIRECT_URI가 uri에 포함되어있으면
    if(event.nativeEvent.url.includes(`${KAKAO_REDIRECT_URI}?code=`)) {
      // replace로 `${KAKAO_REDIRECT_URI}?code=` 를 빈문자열로 바꾸면 code만 남는다.
      const code = event.nativeEvent.url.replace(`${KAKAO_REDIRECT_URI}?code=`, '')
      requestToken(code)
    }
  }

  const requestToken = async (code: string) => {
    const response = await axios({
      method: 'post',
      url: 'https://kauth.kakao.com/oauth/token',
      params: {
        grant_type: 'authorization_code',
        client_id: Config.KAKAO_REST_API_KEY,
        redirect_uri: KAKAO_REDIRECT_URI,
        code,
      },
    });
    kakaoLoginMutation.mutate(response.data.access_token)
  }

  const handleNavigationChangeState = (event: WebViewNavigation) => {
    const isMatched = event.url.includes(`${KAKAO_REDIRECT_URI}?code=`)
    setIsLoading(isMatched)
    setIsChangeNavigation(event.loading)
  }
  
  return (
    <SafeAreaView style={styles.container}>
      {(isLoading || isChangeNavigation) && (
        <View style={styles.kakaoLoadingContainer}>
          <ActivityIndicator size={'small'} color={colors.BLACK}/>
        </View>
      )}
      <WebView
        source={{
          uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${Config.KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}`,
        }}
        onMessage={handleOnMessage}
        // 웹 페이지가 로드된 후에 한 번 실행됨
        injectedJavaScript={"window.ReactNativeWebView.postMessage('')"}
        // 웹뷰의 URL이 변경되거나, 페이지가 로딩 중인지 아닌지 등의 탐색 상태가 변경될 때마다 호출됨
        // 이 콜백 함수는 WebViewNavigation 객체를 인수로 받아, 웹뷰의 탐색 상태(예: URL, 로딩 상태 등)에 접근할 수 있다.
        onNavigationStateChange={handleNavigationChangeState}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  kakaoLoadingContainer: {
    backgroundColor: colors.WHITE,
    height: Dimensions.get('window').height,
    paddingBottom: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default KakaoLoginScreen;
