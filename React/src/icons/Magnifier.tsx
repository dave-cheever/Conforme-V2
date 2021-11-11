import { createIcon } from "@chakra-ui/icons";

// path can also be an array of elements, if you have multiple paths, lines, shapes, etc.

const Magnifier = createIcon({
  displayName: "Magnifier",
  viewBox: "0 0 16 16",
  path: (
    <>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.737 14.475l-3.021-3.012a7.038 7.038 0 001.502-4.354 7.109 7.109 0 10-7.11 7.109 7.038 7.038 0 004.355-1.502l3.012 3.021a.889.889 0 001.262 0 .889.889 0 000-1.262zM1.777 7.11a5.332 5.332 0 1110.663 0 5.332 5.332 0 01-10.663 0z"
        fill="currentColor"
      />
    </>
  )
});

export default Magnifier;
