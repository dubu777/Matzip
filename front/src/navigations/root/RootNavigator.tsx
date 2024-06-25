import useAuth from '@/hooks/queries/useAuth';
import MainDrawerNavigator from '../drawer/MainDrawerNavigator';
import AuthStackNavigator from '../stack/AuthStackNavigator';
import RetryErrorBoundary from '@/components/common/RetryErrorBoundary';
import { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';

function RootNavigator() {
  const {isLogin, isLoginLoading} = useAuth();


// 로딩중일(getRefreshToken쿼리가 isPending일 때)때 스플래시 화면이 보이게 설정
// setTimeout을 이용해서 스플래시 시간을 늘려서 잠깐씩 보이는 AuthHomeScreen을 안보이게 설정
useEffect(() => {
  if(!isLoginLoading) {
    setTimeout(() => {
      SplashScreen.hide();
    }, 500)
  }
}, [isLoginLoading])

  return (
    <RetryErrorBoundary>
      {isLogin ? <MainDrawerNavigator /> : <AuthStackNavigator />}
    </RetryErrorBoundary>
  );
}

export default RootNavigator;
