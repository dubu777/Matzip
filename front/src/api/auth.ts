import axios from 'axios';
import axiosInstance from './axios';
import {Category, Profile} from '../types/domain';
import {getEncryptStorage} from '../utils';

type RequestUser = {
  email: string;
  password: string;
};

const postSignup = async ({email, password}: RequestUser): Promise<void> => {
  const {data} = await axiosInstance.post('/auth/signup', {email, password});

  return data;
};

const kakaoLogin = async(token: string): Promise<ResponseToken> => {
  const {data} = await axiosInstance.post('/auth/oauth/kakao', {token});

  return data
}

type ResponseToken = {
  accessToken: string;
  refreshToken: string;
};

// Promise<ResponseToken> 는 reponse에 대한 타입 선언이다.

const postLogin = async ({
  email,
  password,
}: RequestUser): Promise<ResponseToken> => {
  const {data} = await axiosInstance.post('/auth/signin', {email, password});
  return data;
};

type ResponseProfile = Profile & Category;

const getProfile = async (): Promise<ResponseProfile> => {
  const {data} = await axiosInstance.get('/auth/me');

  return data;
};

type RequestProfile = Omit<Profile, 'id' | 'email' | 'kakaoImageUri' | 'loginType'>

const editProfile = async(body: RequestProfile) => {
  const {data} = await axiosInstance.patch('/auth/me', body)

  return data
}

const getAccessToken = async (): Promise<ResponseToken> => {
  const refreshToken = await getEncryptStorage('refreshToken');

  const {data} = await axiosInstance.get('/auth/refresh', {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  return data;
};

const logout = async () => {
  await axiosInstance.post('/auth/logout');
};

const deleteAccount = async() => {
  await axiosInstance.delete('/auth/me');
};

const editCategory = async(body: Category): Promise<ResponseProfile> => {
  const {data} = await axiosInstance.patch('/auth/category', body)

  return data
}

export {postSignup, postLogin, getProfile, editProfile, getAccessToken, logout, kakaoLogin, deleteAccount, editCategory};
export type {RequestUser, ResponseToken, ResponseProfile, RequestProfile};
