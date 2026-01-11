import * as React from "react";
import Svg, { Path } from "react-native-svg";
const CreateIcon = (props) => (
  <Svg
    width={26}
    height={26}
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M9.00026 3.66667H5.26693C3.77345 3.66667 3.02616 3.66667 2.45573 3.95732C1.95396 4.21298 1.54631 4.62063 1.29065 5.1224C1 5.69283 1 6.44012 1 7.93359V20.7336C1 22.2271 1 22.9734 1.29065 23.5438C1.54631 24.0456 1.95396 24.454 2.45573 24.7096C3.0256 25 3.77199 25 5.26255 25H18.0708C19.5613 25 20.3067 25 20.8765 24.7096C21.3783 24.454 21.7873 24.0452 22.043 23.5435C22.3333 22.9736 22.3333 22.228 22.3333 20.7375V17M17 5L9 13V17H13L21 9M17 5L21 1L25 5L21 9M17 5L21 9"
      stroke="white"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default CreateIcon;
