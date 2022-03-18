import { Icon } from "@chakra-ui/icons";

const TickIcon = (props) => {
  const { isIndeterminate, isChecked, ...rest } = props
  return (
    <Icon viewBox="0 0 10 12" {...rest}>
      <path fill="transparent" strokeLinecap="round" strokeLinejoin="round" d="M9.44455 0.944443L3.33344 7.05555L0.555664 4.27778" />
    </Icon>
  )
};

export default TickIcon;
