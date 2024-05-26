import { LatLng, MapMarkerProps } from "react-native-maps";

declare module 'react-native-maps' {
  export interface MyMapMarkerprops extends MapMarkerProps {
    coordinate?: LatLng;
  }
}