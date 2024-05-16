import axios from 'axios';

import {Platform} from 'react-native';

// 안드로이드에서는 localhost가 잘 동작하지 않으므로, 10.0.2.2를 사용함

// 아래처럼 Platform.OS를 이용해서 기기의 OS를 판단하여 baseURL을 바꿔주시면 안드로이드일 경우 문제가 해결된다.

const axiosInstance = axios.create({

baseURL:

Platform.OS === 'android'

? 'http://10.0.2.2:3030'

: 'http://localhost:3030',

withCredentials: true,

});



export default axiosInstance;