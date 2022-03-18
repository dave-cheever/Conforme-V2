import { Icon } from "@chakra-ui/icons";

// path can also be an array of elements, if you have multiple paths, lines, shapes, etc.

const MinusIcon = (props) => {
  const { isIndeterminate, isChecked, ...rest } = props
  return (
    <Icon viewBox='0 0 9 1' {...rest}>
      <path fill="transparent" stroke="currentColor" d="M0.5 0.5, L8.5 0.5" />
    </Icon>
  )
};

export default MinusIcon;
