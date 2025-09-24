import { Icon } from '@chakra-ui/icons';

function TickIcon(props) {
  const { isIndeterminate, isChecked, ...rest } = props;

  return (
    <Icon data-id="000279" viewBox="0 0 10 12" {...rest}>
      <path
        data-id="000280"
        d="M9.44455 0.944443L3.33344 7.05555L0.555664 4.27778"
        fill="transparent"
        strokeLinecap="round"
        strokeLinejoin="round" />
    </Icon>
  );
}

export default TickIcon;
