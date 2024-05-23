import {
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import {
  ResponseProfile,
  getAccessToken,
  getProfile,
  logout,
  postLogin,
  postSignup,
} from '@/api/auth';
import {
  UseMutationCustomOptions,
  UseQueryCustomOptions,
} from '@/types/common';
import {removeEncryptStorage, setEncryptStorage} from '@/utils';
import {removeHeader, setHeader} from '@/utils/header';
import {useEffect} from 'react';

import { numbers, queryKeys, storageKeys } from '@/constants';
import queryClient from '@/api/queryClient';


function useSignup(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: postSignup,
    ...mutationOptions,
  });
}

function useLogin(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: postLogin,
    onSuccess: ({accessToken, refreshToken}) => {
      setEncryptStorage(storageKeys.REFRESH_TOKEN, refreshToken);
      setHeader('Authorization', `Bearer ${accessToken}`);
    },
    // 로그인 후에 리프레시 훅을 실행해줘서
    // 자동 갱신이 로그인 했을때도 훅에서 설정한 옵션에 따라 돌도록 하기위해
    // queryClient.refetchQueries를 사용한다.
    onSettled: () => {
      console.log('로그인 useLogin쿼리 ');
      queryClient.refetchQueries({queryKey: [queryKeys.AUTH, queryKeys.GET_ACCESS_TOKEN]});
      // 그 전에 있던 프로필 요청 무효화하기 위해
      queryClient.invalidateQueries({queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE]})
    },
    ...mutationOptions,
  });
}

// 액세스 토큰을 받아와서 평생쓰는게 아니고 보안상 짧게 유효시간을 가지고 사용하고 따로 저장소에 저장하지도 않는다.
// 그래서 useGetRefreshToken에서 신선하지 않은 데이터로 취급되는 시간을 지정해줄수 있다. 여기에선 27분으로 설정
// v4 에서는 useQuery 안에서 onSuccess 를 사용할 수 있었는데 v5에서 제거됐다.
// 그래서 그것과 비슷하게 만들어보자.
// useQuery가 반환하는 값 중에 isSuccess, isError 상태가 있다. useEffect를 같이 사용해서 구현해보자
function useGetRefreshToken() {
  const {data, isSuccess, isError} = useQuery({
    queryKey: [queryKeys.AUTH, queryKeys.GET_ACCESS_TOKEN],
    queryFn: getAccessToken,
    staleTime: numbers.ACCESS_TOKEN_REFRESH_TIME,
    refetchInterval: numbers.ACCESS_TOKEN_REFRESH_TIME,
    refetchOnReconnect: true,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (isSuccess) {
      setEncryptStorage(storageKeys.REFRESH_TOKEN, data.refreshToken);
      setHeader('Authorization', `Bearer ${data.accessToken}`);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      removeHeader('Authorization');
      removeEncryptStorage(storageKeys.REFRESH_TOKEN);
    }
  }, [isError]);

  return {isSuccess, isError};
}

function useGetProfile(queryOptions?: UseQueryCustomOptions<ResponseProfile>) {
  return useQuery({
    queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE],
    queryFn: getProfile,
    ...queryOptions,
  });
}

function useLogout(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      removeHeader('Authorization');
      removeEncryptStorage(storageKeys.REFRESH_TOKEN);
    },
    onSettled: () => {
      // auth에 해당하는 쿼리들 무효화
      queryClient.invalidateQueries({queryKey: [queryKeys.AUTH]})
    }
  })
}


function useAuth() {
  const signupMutation = useSignup();
  const refreshTokenQuery = useGetRefreshToken();
  const getProfileQuery = useGetProfile({
    enabled: refreshTokenQuery.isSuccess,
    // enabled 옵션은 이 부분이 true 일때 해당 쿼리가 실행되게 한다.
    // 리프레시 토큰이 성공했다면 프로필도 가져온다.
  });
  const isLogin = getProfileQuery.isSuccess; // 프로필 쿼리가 성공했다면 로그인도 성공했다고 볼수있으니까
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  return {
    signupMutation,
    refreshTokenQuery,
    getProfileQuery,
    isLogin,
    loginMutation,
    logoutMutation,
  };
}

export default useAuth;
