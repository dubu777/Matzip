import {MutationFunction, useMutation, useQuery} from '@tanstack/react-query';
import {
  ResponseProfile,
  ResponseToken,
  deleteAccount,
  editCategory,
  editProfile,
  getAccessToken,
  getProfile,
  kakaoLogin,
  logout,
  postLogin,
  postSignup,
} from '@/api/auth';
import {UseMutationCustomOptions, UseQueryCustomOptions} from '@/types/common';
import {removeEncryptStorage, setEncryptStorage} from '@/utils';
import {removeHeader, setHeader} from '@/utils/header';
import {useEffect} from 'react';

import {numbers, queryKeys, storageKeys} from '@/constants';
import queryClient from '@/api/queryClient';
import {Category, Profile} from '@/types';

function useSignup(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: postSignup,
    throwOnError: error => Number(error.response?.status) >= 500,
    ...mutationOptions,
  });
}

// 카카오 로그인, 애플로그인에서도 사용할 수 있게 제네릭 이용해서 수정
function useLogin<T>(
  loginAPI: MutationFunction<ResponseToken, T>,
  mutationOptions?: UseMutationCustomOptions,
) {
  return useMutation({
    mutationFn: loginAPI,
    onSuccess: ({accessToken, refreshToken}) => {
      setEncryptStorage(storageKeys.REFRESH_TOKEN, refreshToken);
      setHeader('Authorization', `Bearer ${accessToken}`);
    },
    // 로그인 후에 리프레시 훅을 실행해줘서
    // 자동 갱신이 로그인 했을때도 훅에서 설정한 옵션에 따라 돌도록 하기위해
    // queryClient.refetchQueries를 사용한다.
    // onSettled는 요청이 성공하든 실패하든 항상 실행됨
    onSettled: () => {
      console.log('로그인 useLogin쿼리 ');
      queryClient.refetchQueries({
        queryKey: [queryKeys.AUTH, queryKeys.GET_ACCESS_TOKEN],
      });
      // 그 전에 있던 프로필 요청 무효화하기 위해
      queryClient.invalidateQueries({
        queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE],
      });
    },
    throwOnError: error => Number(error.response?.status) >= 500,
    ...mutationOptions,
  });
}

function useEmailLogin(mutationOptions?: UseMutationCustomOptions) {
  return useLogin(postLogin, mutationOptions);
}

function useKakaoLogin(mutationOptions?: UseMutationCustomOptions) {
  return useLogin(kakaoLogin, mutationOptions);
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

type ResponseSelectProfile = {categories: Category} & Profile;

// useGetProfile 함수가 반환한 데이터가 여기서 data로 받아온다.
// data에서 categories 와 나머지 데이터들을 분리해서 사용하기 위해서 이 함수를 만든다.
const transformProfileCategory = (data: ResponseProfile): ResponseSelectProfile => {
  const {BLUE, GREEN, PURPLE, RED, YELLOW, ...rest} = data;
  const categories = {BLUE, GREEN, PURPLE, RED, YELLOW};

  return {categories, ...rest};
};

function useGetProfile(
  queryOptions?: UseQueryCustomOptions<ResponseProfile, ResponseSelectProfile>,
) {
  return useQuery({
    queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE],
    // select 함수는 서버에서 가져온 데이터를 변환할때 사용한다.
    select: transformProfileCategory,
    queryFn: getProfile,
    ...queryOptions,
  });
}

function useMutateCategory(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: editCategory,
    onSuccess: newProfile => {
      queryClient.setQueryData(
        [queryKeys.AUTH, queryKeys.GET_PROFILE],
        newProfile,
      );
    },
    ...mutationOptions,
  });
}

function useUpdateProfile(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: editProfile,
    onSuccess: newProfile => {
      queryClient.setQueryData(
        [queryKeys.AUTH, queryKeys.GET_PROFILE],
        newProfile,
      );
    },
    ...mutationOptions,
  });
}

function useLogout(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      removeHeader('Authorization');
      removeEncryptStorage(storageKeys.REFRESH_TOKEN);
      // auth에 해당하는 쿼리들 무효화
      queryClient.resetQueries({queryKey: [queryKeys.AUTH]});
    },
    ...mutationOptions,
  });
}

function useMutateDeleteAccount(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: deleteAccount,
    ...mutationOptions,
  });
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
  const loginMutation = useEmailLogin();
  const kakaoLoginMutation = useKakaoLogin();
  const logoutMutation = useLogout();
  const profileMutation = useUpdateProfile();
  const deleteAccountMutation = useMutateDeleteAccount({
    onSuccess: () => logoutMutation.mutate(null),
  });
  const categoryMutation = useMutateCategory();
  return {
    signupMutation,
    refreshTokenQuery,
    getProfileQuery,
    isLogin,
    loginMutation,
    logoutMutation,
    kakaoLoginMutation,
    profileMutation,
    deleteAccountMutation,
    categoryMutation,
  };
}

export default useAuth;
