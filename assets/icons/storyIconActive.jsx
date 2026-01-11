import * as React from "react";
import Svg, { Path } from "react-native-svg";

const StoryIconActive = (props) => (
  <Svg
    width={34}
    height={34}
    viewBox="0 0 34 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M17 2.83334C19.7485 2.83284 22.4378 3.63189 24.7402 5.1331C27.0425 6.63431 28.8585 8.77284 29.9667 11.2881C31.0749 13.8033 31.4275 16.5866 30.9815 19.2987C30.5355 22.0108 29.3102 24.5346 27.455 26.5625M17 11.3333V22.6667M22.6666 17H11.3333M3.54165 12.5729C3.09023 13.9452 2.85135 15.3784 2.83331 16.8229M4.00915 22.6667C4.80461 24.4968 5.97772 26.1382 7.45165 27.4833M6.56765 7.41626C6.96295 6.98592 7.38451 6.58045 7.8299 6.20218M12.2456 30.345C15.7784 31.6035 19.666 31.4099 23.0562 29.8067"
      stroke="#7C7CFF"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default StoryIconActive;
