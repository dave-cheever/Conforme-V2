import { ReactElement } from 'react';

import { Button } from '@chakra-ui/react';

function ResponseHeaderButton({
  icon,
  name,
  onClick,
  loading = false,
  disabled = false,
  primary = false,
  isListView,
}: {
  icon?: ReactElement<any, any>;
  name: string;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  primary?: boolean;
  isListView?: boolean;
}) {
  return <>
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
      data-id="c104bdb6d779"
      disabled={disabled}
      display={isListView ? 'flex' : 'initial'}
      flexDir={isListView ? 'row' : 'initial'}
      fontSize="14px"
      fontWeight="bold"
      isLoading={loading}
      justifyContent={isListView ? 'space-between' : 'initial'}
      leftIcon={icon}
      onClick={onClick}
      px={4}
      role="group"
>
      {name}
    </Button>
  </>
}

export default ResponseHeaderButton;
