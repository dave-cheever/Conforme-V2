import { Checkbox, Text } from '@chakra-ui/react';

import { TickIcon } from '../../icons';

function FilterCheckBox({ value, label }) {
  return (
    <Checkbox
      data-id="000143"
      colorScheme="purpleHeart"
      css={{
        '.chakra-checkbox__control': {
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          background: 'white',
          borderWidth: '1px',
          borderColor: '#81819750',
          paddingTop: '5px',
          '&[data-checked]': {
            background: '#462AC4',
            borderColor: '#462AC4',
            '&[data-hover]': {
              background: '#462AC4',
              borderColor: '#462AC4',
            },
          },
        },
      }}
      icon={<TickIcon data-id="000144" stroke="white" />}
      value={value}>
      <Text
        data-id="000145"
        color="filterPanel.checkboxLabelColor"
        fontSize="14px">
        {label}
      </Text>
    </Checkbox>
  );
}

export default FilterCheckBox;
