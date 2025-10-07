import React from 'react';

import { Box, Button, Menu, MenuButton, MenuItem, MenuList, useDisclosure } from '@chakra-ui/react';

import { EllipsisIcon } from '../icons';

export interface EllipsisMenuOption {
  readonly label: string;
  readonly onClick: () => void;
  readonly icon?: React.ReactNode;
  readonly disabled?: boolean;
  readonly color?: string;
}

interface EllipsisMenuProps {
  readonly options: readonly EllipsisMenuOption[];
  readonly size?: 'sm' | 'md' | 'lg';
  readonly variant?: 'ghost' | 'outline' | 'solid';
  readonly placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  readonly 'data-id'?: string;
}

function EllipsisMenu({
  options,
  size = 'md',
  variant = 'ghost',
  placement = 'bottom-end',
  'data-id': dataId = '000600',
}: EllipsisMenuProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getButtonSize = () => {
    switch (size) {
      case 'sm':
        return { w: '32px', h: '32px', iconSize: '12px' };
      case 'lg':
        return { w: '48px', h: '48px', iconSize: '20px' };
      default:
        return { w: '40px', h: '40px', iconSize: '16px' };
    }
  };

  const buttonSize = getButtonSize();

  return (
    <Menu data-id={dataId} isOpen={isOpen} onClose={onClose} onOpen={onOpen} placement={placement}>
      <MenuButton
        _active={{
          bg: 'gray.100',
          borderColor: '#D0D5DD',
        }}
        _focus={{
          boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px rgba(16, 24, 40, 0.05)',
        }}
        _hover={{
          bg: 'gray.50',
          borderColor: '#D0D5DD',
        }}
        as={Button}
        bg="white"
        border="1px solid #D0D5DD"
        borderRadius="8px"
        boxShadow="0px 1px 2px 0px rgba(16, 24, 40, 0.05)"
        data-id={`${dataId}-button`}
        h={buttonSize.h}
        minW={buttonSize.w}
        onClick={(e) => {
          e.stopPropagation();
        }}
        p={0}
        size="sm"
        variant={variant}
        w={buttonSize.w}
      >
        <EllipsisIcon boxSize={buttonSize.iconSize} color="#344054" data-id={`${dataId}-icon`} />
      </MenuButton>
      <MenuList
        bg="white"
        border="1px solid #E4E7EC"
        borderRadius="8px"
        boxShadow="0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)"
        data-id={`${dataId}-menu`}
        minW="160px"
        onClick={(e) => {
          e.stopPropagation();
        }}
        p="4px"
      >
        {options.map((option, index) => (
          <MenuItem
            _disabled={{
              opacity: 0.5,
              cursor: 'not-allowed',
            }}
            _focus={{
              bg: 'gray.50',
            }}
            _hover={{
              bg: 'gray.50',
            }}
            borderRadius="6px"
            color={option.color || '#344054'}
            data-id={`${dataId}-option-${index}`}
            disabled={option.disabled}
            fontSize="14px"
            fontWeight="500"
            h="36px"
            key={`${option.label}-${index}`}
            onClick={(e) => {
              e.stopPropagation();
              option.onClick();
              onClose();
            }}
            px="12px"
            py="8px"
          >
            <Box alignItems="center" data-id="001366" display="flex" gap="8px" w="100%">
              {option.icon && (
                <Box alignItems="center" data-id="001367" display="flex" justifyContent="center">
                  {option.icon}
                </Box>
              )}
              <Box data-id="001368" flex="1">
                {option.label}
              </Box>
            </Box>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}

export default EllipsisMenu;
