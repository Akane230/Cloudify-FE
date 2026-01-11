import * as React from "react";
import Svg, { Path } from "react-native-svg";

const profileIconInactive = (props) => (
  <Svg
    width={34}
    height={34}
    viewBox="0 0 34 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M26.9167 29.75V26.9167C26.9167 25.4138 26.3197 23.9724 25.2569 22.9097C24.1942 21.847 22.7529 21.25 21.25 21.25H12.75C11.2471 21.25 9.80578 21.847 8.74307 22.9097C7.68037 23.9724 7.08334 25.4138 7.08334 26.9167V29.75M22.6667 9.91667C22.6667 13.0463 20.1296 15.5833 17 15.5833C13.8704 15.5833 11.3333 13.0463 11.3333 9.91667C11.3333 6.78705 13.8704 4.25 17 4.25C20.1296 4.25 22.6667 6.78705 22.6667 9.91667Z"
      stroke="white"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default profileIconInactive;
