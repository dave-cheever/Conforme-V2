import { createIcon } from "@chakra-ui/icons";

// path can also be an array of elements, if you have multiple paths, lines, shapes, etc.

const MinusIcon = createIcon({
  displayName: "MinusIcon",
  viewBox: "0 0 9 1",
  path: [
    <path
      key="minus_icon_1"
      d="M0.5 0.5, L8.5 0.5"
      stroke="currentColor"
      fill="transparent"
    />,
  ],
});

export default MinusIcon;
