import { Checkbox, Text } from '@chakra-ui/react';

function FilterCheckBox({ value, label }) {
  return (
    <Checkbox
      css={{
        '.chakra-checkbox__control': {
          borderRadius: '50%',
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
            borderWidth: '5px',
            background: 'transparent',
          },
        },
      }}
      data-id="000143"
      icon={<span data-id="001525" />}
      value={value}
    >
      <Text color="#2D3748" data-id="000145" fontSize="16px" fontWeight="medium" marginLeft="3px">
        {label}
      </Text>
    </Checkbox>
  );
}

export default FilterCheckBox;
