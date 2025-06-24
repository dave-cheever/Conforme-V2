import { Button } from '@chakra-ui/react';

import { ShareIcon } from '../icons';

function ShareButton({
  ariaLabel,
  onClick,
  disabled = false,
  mr = '15px',
  ml = '0',
}: {
  ariaLabel: string;
  onClick?: () => void;
  disabled?: boolean;
  mr?: string | number | {};
  ml?: string | number|{};
}) {
  return <Button
    _hover={
      disabled
        ? {}
        : {
            bg: '#818197',
            color: '#FFFFFF',
            cursor: 'pointer',
            stroke: '#FFFFFF',
          }
    }
    aria-label={ariaLabel}
    bg="#FFFFFF"
    border="1px solid #E2E8F0"
    borderRadius="10px"
    color="#818197"
    data-id="916c917183c7"
    disabled={disabled}
    display="flex"
    fontSize="14px"
    fontWeight="bold"
    ml={ml}
    mr={mr}
    onClick={onClick}
    rightIcon={<ShareIcon data-id="a19f2e7036ef" fontSize="15px" />}
    role="group"
    stroke="#818197"
    w={['calc(100% - 1rem - 15px)', 'auto']}>
    Share
  </Button>
}

export default ShareButton;
