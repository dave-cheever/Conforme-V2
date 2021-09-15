import { createIcon } from "@chakra-ui/icons";

const ArrowRight = createIcon({
  displayName: "Arrow right",
  viewBox: "0 0 12 12",
  path: (
    <path
      fill="none"
      d="M1 6h10M6 1l5 5-5 5"
      stroke="#fff"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
});

export default ArrowRight;
