import { Icon } from "@chakra-ui/icons";

const CheckIcon = (props) => {
  const { isIndeterminate, isChecked, ...rest } = props
  return (
    <Icon viewBox="0 0 18 13" {...rest}>
      <path fill="transparent" strokeLinecap="round" strokeLinejoin="round" d="M17 1L6 12L1 7" />
    </Icon>
  )
};

export default CheckIcon;
