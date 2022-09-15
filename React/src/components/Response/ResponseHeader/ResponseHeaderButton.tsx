import { ReactElement } from 'react';

import { Button, IconButton } from '@chakra-ui/react';

const ResponseHeaderButton = ({
  icon,
  name,
  onClick,
  loading = false,
  disabled = false,
  primary = false,
}: {
  icon?: ReactElement<any, any>;
  name: string;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  primary?: boolean;
}) => (
  <>
    <Button
      _hover={
        disabled
          ? {}
          : {
              bg: `reasponseHeader.button${primary ? 'Dark' : 'Light'}BgHover`,
              color: `reasponseHeader.button${primary ? 'Dark' : 'Light'}ColorHover`,
              cursor: 'pointer',
            }
      }
      bg={`reasponseHeader.button${primary ? 'Dark' : 'Light'}Bg`}
      borderRadius="10px"
      color={`reasponseHeader.button${primary ? 'Dark' : 'Light'}Color`}
      disabled={disabled}
      display={['none', 'none', 'flex']}
      fontSize="14px"
      fontWeight="bold"
      isLoading={loading}
      leftIcon={icon}
      ml="15px"
      onClick={onClick}
      px={4}
      role="group"
    >
      {name}
    </Button>
    <IconButton
      _hover={
        disabled
          ? {}
          : {
              bg: `reasponseHeader.button${primary ? 'Dark' : 'Light'}BgHover`,
              color: `reasponseHeader.button${primary ? 'Dark' : 'Light'}ColorHover`,
              cursor: 'pointer',
              stroke: 'white',
            }
      }
      aria-label="Search database"
      bg={`reasponseHeader.button${primary ? 'Dark' : 'Light'}Bg`}
      borderRadius="10px"
      disabled={disabled}
      display={['none', 'flex', 'none']}
      icon={icon}
      ml="15px"
      onClick={onClick}
      role="group"
    />
  </>
);

export default ResponseHeaderButton;
