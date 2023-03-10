import { Checkbox, Text } from '@chakra-ui/react';

import { TickIcon } from '../../icons';

const FilterCheckBox = ({ value, label }) => (
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
    data-id="5be3b325a364"
    icon={<TickIcon data-id="5060fbc2da93" stroke="white" />}
    value={value}>
    <Text
      color="filterPanel.checkboxLabelColor"
      data-id="b9e075ac5790"
      fontSize="14px">
      {label}
    </Text>
  </Checkbox>
);

export default FilterCheckBox;
