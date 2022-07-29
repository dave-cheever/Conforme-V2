import { createIcon } from '@chakra-ui/icons';

const UploadedCross = createIcon({
  path: (
    <g>
      <path
        d="M5.625 0H1.25C0.918479 0 0.600537 0.126428 0.366116 0.351472C0.131696 0.576515 0 0.88174 0 1.2V10.8C0 11.1183 0.131696 11.4235 0.366116 11.6485C0.600537 11.8736 0.918479 12 1.25 12H8.75C9.08152 12 9.39946 11.8736 9.63388 11.6485C9.8683 11.4235 10 11.1183 10 10.8V4.2L5.625 0Z"
        fill="currentColor"
      />
      <path d="M6.5 5.5L3.5 8.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 5.5L6.5 8.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  viewBox: '0 0 10 12',
});

export default UploadedCross;
