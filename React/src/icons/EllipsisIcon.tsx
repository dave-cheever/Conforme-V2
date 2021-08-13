import { createIcon } from "@chakra-ui/icons";

const EllipsisIcon = createIcon({
  path: (
    <ellipse rx="30" ry="30" fill="#9A9EA180" />
  ),
  viewBox: "0 0 18 22",
  defaultProps: {
    position: "absolute",
    borderRadius: "full",
    transformOrigin: "center",
  }
});

export default EllipsisIcon;
