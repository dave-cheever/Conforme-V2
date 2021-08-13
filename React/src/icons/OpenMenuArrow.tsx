import { createIcon } from "@chakra-ui/icons";

// path can also be an array of elements, if you have multiple paths, lines, shapes, etc.

export const OpenMenuArrow = createIcon({
  path: (
    <>
      <path fill="none" d="M1 1L8 8L15 1" stroke="#434B4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  viewBox: "0 0 16 9",
});
