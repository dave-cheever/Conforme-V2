import { Icon } from '@chakra-ui/icons';

const CheckIcon = (props) => {
  const { isIndeterminate, isChecked, ...rest } = props;
  return (
    <Icon viewBox="0 0 18 13" {...rest}>
      <path
        d="M17 1L6 12L1 7"
        fill="transparent"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
};

export default CheckIcon;
