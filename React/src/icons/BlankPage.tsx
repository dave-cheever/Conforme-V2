import { createIcon } from '@chakra-ui/icons';

const BlankPage = createIcon({
  displayName: 'Blank page',
  viewBox: '0 0 18 22',
  path: (
    <g>
      <path
        d="M10 1H3a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-7-7z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path d="M10 1v7h7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </g>
  ),
});

export default BlankPage;
