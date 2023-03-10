import { Icon } from '@chakra-ui/icons';

const CheckIcon = (props) => {
  const { isIndeterminate, isChecked, ...rest } = props;
  return (
    (<Icon data-id="6b3e5cba1aa6" viewBox="0 0 18 13" {...rest}>
      <path
        d="M17 1L6 12L1 7"
        data-id="ec82b473859d"
        fill="transparent"
        strokeLinecap="round"
        strokeLinejoin="round" />
    </Icon>)
  );
};

export default CheckIcon;
