import Geolocation from '@react-native-community/geolocation';
import {useEffect, useState} from 'react';
import {LatLng} from 'react-native-maps';
import useAppState from './useAppState';

function useUserLocation() {
  const [userLocation, setUserLocation] = useState<LatLng>({
    latitude: 37.5516032365118,
    longitude: 126.98989626020192,
  });
  const [isUserLocationError, setIsUserLocationError] = useState(false);
  const {isComback} = useAppState();

  
  // isComback 을 이용해서 현재위치를 불러오는 함수 다시실행
  useEffect(() => {
    Geolocation.getCurrentPosition(
      info => {
        const {latitude, longitude} = info.coords;
        setUserLocation({latitude, longitude});
        setIsUserLocationError(false);
        console.log(latitude, longitude);
      },
      // 위치를 가져오는 과정에서 에러 발생시 호출
      () => {
        setIsUserLocationError(true);
      },
      // 옵션 객체
      {
        enableHighAccuracy: true, // enableHighAccuracy 옵션은 위치를 취득할 때 더 높은 정확도를 요구하는지 여부를 설정
      },
    );
  }, [isComback]);

  return {userLocation, isUserLocationError};
}

export default useUserLocation;
