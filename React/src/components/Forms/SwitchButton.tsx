import { Button } from "@chakra-ui/react";

function SwitchButton({ laterality, value, onchange, name, requiredAnswer, disabled }) {
  return (
    <Button
      data-id="030925-98442c"
      _hover={disabled ? {} : { bg: 'switch.activebtn.bg', color: 'switch.activebtn.color' }}
      bg={
        laterality === 'left' && value === 'yes'
          ? 'switch.activebtn.bg'
          : laterality === 'right' && value === 'no'
            ? 'switch.activebtn.bg'
            : 'switch.btn.bg'
      }
      color={
        laterality === 'left' && value === 'yes'
          ? 'switch.activebtn.color'
          : laterality === 'right' && value === 'no'
            ? 'switch.activebtn.color'
            : 'switch.btn.color'
      }
      disabled={requiredAnswer === 'na' || disabled}
      fontSize="smm"
      fontWeight="bold"
      name={name}
      onClick={() => {
        if (disabled) return;
        if ((laterality === 'left' && value === 'yes') || (laterality === 'right' && value === 'no')) onchange('');
        else onchange(laterality === 'left' ? 'yes' : 'no');
      }}
      p="10px 20px">
      {laterality === 'left' ? 'Yes' : 'No'}
    </Button>
  );
}

export default SwitchButton;
