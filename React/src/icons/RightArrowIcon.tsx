import { createIcon } from "@chakra-ui/icons";

const RightArrowIcon = createIcon({
  path: (
    <>
      <path fill="none" d="M1 6H11" stroke="#9A9EA1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path fill="none" d="M6 1L11 6L6 11" stroke="#9A9EA1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </>

  ),
  viewBox: "0 0 12 12",
});

export default RightArrowIcon;
