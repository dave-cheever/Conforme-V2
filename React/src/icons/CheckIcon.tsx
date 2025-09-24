import { Icon } from '@chakra-ui/icons';

function CheckIcon(props) {
  const { isIndeterminate, isChecked, ...rest } = props;
  return (
    <Icon data-id="000041" viewBox="0 0 18 13" {...rest}>
      <path
        data-id="000042"
        d="M17 1L6 12L1 7"
        fill="transparent"
        strokeLinecap="round"
        strokeLinejoin="round" />
    </Icon>
  );
}

export default CheckIcon;
