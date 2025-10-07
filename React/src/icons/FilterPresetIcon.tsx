import { createIcon } from '@chakra-ui/icons';

const FilterPresetsIcon = createIcon({
  displayName: 'FilterPresetsIcon',
  viewBox: '0 0 24 24',
  path: (
    <g data-id="000800" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
      {/* Top slider */}
      <line data-id="000801" x1="3" x2="21" y1="8" y2="8" />
      <circle cx="9" cy="8" data-id="000802" fill="white" r="2" />

      {/* Bottom slider */}
      <line data-id="000803" x1="3" x2="21" y1="16" y2="16" />
      <circle cx="15" cy="16" data-id="000804" fill="white" r="2" />
    </g>
  ),
});

export default FilterPresetsIcon;
