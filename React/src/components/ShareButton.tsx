import { Button } from '@chakra-ui/react';

import { ShareIcon } from '../icons';

const ShareButton = ({
  ariaLabel,
  onClick,
  disabled = false,
  mr = '15px',
  ml = '0',
}: {
  ariaLabel: string;
  onClick?: () => void;
  disabled?: boolean;
  mr?: string;
  ml?: string;
}) => (
  <>
    <Button
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
      borderRadius="10px"
      color="#818197"
      disabled={disabled}
      ml={ml}
      mr={mr}
      onClick={onClick}
      rightIcon={<ShareIcon fontSize="15px" />}
      stroke="#818197"
    >
      Share
    </Button>
  </>
);

export default ShareButton;
