import { Checkbox, Text } from '@chakra-ui/react';

function FilterCheckBox({ value, label }) {
  return (
    <Checkbox
      css={{
        '.chakra-checkbox__control': {
          borderRadius: '4px', // Square corners for checkboxes
          width: '16px',
          height: '16px',
          borderWidth: '2px',
          borderColor: '#A0AEC0', // default gray border
          background: 'transparent',
          boxShadow: 'none',
          transition: 'all 0.2s ease',
          position: 'relative',
          '&[data-checked]': {
            borderColor: '#005C96',
            borderWidth: '2px', // Keep normal border width for checkboxes
            background: '#005C96', // Solid background for checked state
            '&[data-hover]': {
              background: '#005C96',
              borderColor: '#005C96',
            },
          },
        },
        '.chakra-checkbox__icon': {
          color: 'white !important',
          fontSize: '12px !important',
          fontWeight: 'bold !important',
          display: 'block !important',
          opacity: '1 !important',
        },
      }}
      data-id="000143"
      value={value}
    >
      <Text color="#2D3748" data-id="000145" fontSize="16px" fontWeight="medium" marginLeft="3px">
        {label}
      </Text>
    </Checkbox>
  );
}

export default FilterCheckBox;
