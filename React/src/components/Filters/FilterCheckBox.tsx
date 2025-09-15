import { Checkbox, Text } from '@chakra-ui/react';

import { TickIcon } from '../../icons';

function FilterCheckBox({ value, label }) {
  return (
    <Checkbox
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
      data-id="030925-602919"
      icon={<TickIcon data-id="030925-862993" stroke="white" />}
      value={value}>
      <Text
        color="filterPanel.checkboxLabelColor"
        data-id="030925-ae152b"
        fontSize="14px">
        {label}
      </Text>
    </Checkbox>
  );
}

export default FilterCheckBox;
