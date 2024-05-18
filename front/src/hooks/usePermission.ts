import { alerts } from '@/constants/message';
import {useEffect} from 'react';
import {Alert, Linking, Platform} from 'react-native';
import {PERMISSIONS, Permission, RESULTS, check, request} from 'react-native-permissions';

type PermissionType = 'LOCATION' | 'PHOTO';

type PermissionOS = {
  [key in PermissionType]: Permission;
};

const androidPermissions: PermissionOS = {
  LOCATION: PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION,
  PHOTO: PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
};

const iosPermissions: PermissionOS = {
  LOCATION: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  PHOTO: PERMISSIONS.IOS.PHOTO_LIBRARY,
};



function usePermission(type: PermissionType) {
  useEffect(() => {
    // async를 이용해서 즉시 실행함수 만들기
    (async () => {
      const isAndroid = Platform.OS === 'android';
      const permissionOS = isAndroid
        ? androidPermissions
        : iosPermissions

      const checked = await check(permissionOS[type]);
      console.log(checked, 'checked');
      const showPermissionAlert = () => {
        Alert.alert(
          alerts[`${type}_PERMISSION`].TITLE,
          alerts[`${type}_PERMISSION`].DESCRIPTION,
          [
            {
              text: '설정하기',
              onPress: () => Linking.openSettings(),
            },
            {
              text: '취소',
              style: 'cancel',
            },
          ],
        );
      };

      switch (checked) {
        case RESULTS.DENIED:
          if (isAndroid) {
            showPermissionAlert();
            return
          }
          await request(permissionOS[type])
          break
        case RESULTS.BLOCKED:
        case RESULTS.LIMITED:
          // 첫번째 요소는 제목, 두번째는 설명, 세번째는 옵션
          showPermissionAlert();
          break
        default:
          break
      }
    })();
  }, []);
}

export default usePermission;
