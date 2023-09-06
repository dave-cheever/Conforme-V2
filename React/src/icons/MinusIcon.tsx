import { Icon } from '@chakra-ui/icons';

// path can also be an array of elements, if you have multiple paths, lines, shapes, etc.

function MinusIcon(props) {
  const { isIndeterminate, isChecked, ...rest } = props;
  return (
    (<Icon data-id="2ea31159324a" viewBox="0 0 9 1" {...rest}>
      <path
        d="M0.5 0.5, L8.5 0.5"
        data-id="24832a64dcad"
        fill="transparent"
        stroke="currentColor" />
    </Icon>)
  );
}

export default MinusIcon;
