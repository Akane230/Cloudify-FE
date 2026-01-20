import * as React from "react";
import Svg, { Path } from "react-native-svg";
const DarkModeIcon = (props) => (
  <Svg
    width={25}
    height={25}
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M8.70166 4.35574C8.70166 10.7361 13.8739 15.9084 20.2541 15.9084C21.4213 15.9084 22.548 15.7358 23.61 15.4139C22.1722 20.1576 17.7656 23.61 12.5525 23.61C6.17222 23.61 1 18.438 1 12.0577C1 6.84448 4.453 2.43778 9.19662 1C8.87474 2.06203 8.70166 3.18859 8.70166 4.35574Z"
      stroke="white"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default DarkModeIcon;
