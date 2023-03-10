import { Icon } from '@chakra-ui/icons';

const TickIcon = (props) => {
  const { isIndeterminate, isChecked, ...rest } = props;

  return (
    (<Icon data-id="44234cb0f6ef" viewBox="0 0 10 12" {...rest}>
      <path
        d="M9.44455 0.944443L3.33344 7.05555L0.555664 4.27778"
        data-id="86c0d513e6c5"
        fill="transparent"
        strokeLinecap="round"
        strokeLinejoin="round" />
    </Icon>)
  );
};

export default TickIcon;
