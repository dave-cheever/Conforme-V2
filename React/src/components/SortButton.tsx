import { Box, Button, Flex, HStack, Menu, MenuButton, MenuList, Spacer, Text } from '@chakra-ui/react';

import { ChevronRight } from '../icons';

function SortButton({
  sortBy,
  sortOrder,
  sortType,
  setSortType,
  setSortOrder,
  ml,
}: {
  sortBy: { label: string; key: string }[];
  sortOrder: 'asc' | 'desc';
  sortType: string;
  setSortType: (key: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  ml?: number | string | {};
}) {
  return <Box data-id="edb62cd329ee" ml={ml ?? '15px'}>
    <Menu autoSelect={false} data-id="9e6c02425b38">
      {({ onClose }) => (
        <>
          <MenuButton
            _active={{}}
            _hover={{}}
            as={Button}
            bg="sortButton.menuButtonBg"
            data-id="cb617272ae6d"
            fontSize="14px"
            fontWeight="700"
            h="40px"
            ml={['15px', '0']}
            rightIcon={<ChevronRight
              color="sortButton.rightIcon"
              data-id="c3c8799dfe9d"
              h="12px"
              mt="3px"
              transform="rotate(90deg)"
              w="12px" />}
            rounded="10px">
            <Flex align="center" data-id="387fc30084b0" mr="1">
              <Text data-id="56ce5132037e" fontSize="smm" fontWeight="semi_medium">
                Sort by
              </Text>
            </Flex>
          </MenuButton>
          <MenuList
            border="none"
            boxShadow="simple"
            data-id="1367f945e695"
            rounded="lg"
            w="100px"
            zIndex={2}>
            {sortBy.map((sortItem) => (
              <Flex data-id="6afb6d71cd37" key={sortItem.key} px={3} py={2}>
                <Box data-id="fd79748082b4">
                  <Text color="sortButton.menuItemFont" data-id="4513c1a0b8b0" fontSize="14px">
                    {sortItem.label}
                  </Text>
                </Box>
                <Spacer data-id="991f9491dab9" />
                <HStack data-id="63b1c3cd64af">
                  <Box
                    bg={sortType === sortItem.key && sortOrder === 'asc' ? 'sortButton.menuItemFocus' : undefined}
                    data-id="1df1f2ba41bc"
                    h="30px"
                    onClick={() => {
                      setSortType(sortItem.key);
                      setSortOrder('asc');
                      onClose();
                    }}
                    rounded="5px"
                    w="30px">
                    <ChevronRight
                      color={sortType === sortItem.key && sortOrder === 'asc' ? 'sortButton.icon.active' : 'sortButton.icon.default'}
                      cursor="pointer"
                      data-id="b31646bb6c74"
                      h="12px"
                      transform="rotate(-90deg)"
                      w="12px" />
                  </Box>
                  <Spacer data-id="872433c5a412" />
                  <Flex
                    align="center"
                    bg={sortType === sortItem.key && sortOrder === 'desc' ? 'sortButton.menuItemFocus' : undefined}
                    data-id="fa70dd029e8b"
                    h="30px"
                    justify="center"
                    onClick={() => {
                      setSortType(sortItem.key);
                      setSortOrder('desc');
                      onClose();
                    }}
                    rounded="5px"
                    w="30px">
                    <ChevronRight
                      color={sortType === sortItem.key && sortOrder === 'desc' ? 'sortButton.icon.active' : 'sortButton.icon.default'}
                      cursor="pointer"
                      data-id="ccfafd5f0601"
                      h="12px"
                      transform="rotate(90deg)"
                      w="12px" />
                  </Flex>
                </HStack>
              </Flex>
            ))}
          </MenuList>
        </>
      )}
    </Menu>
  </Box>
}

export default SortButton;

export const sortButtonStyles = {
  sortButton: {
    menuButtonBg: 'white',
    rightIcon: '#9A9EA1',
    icon: {
      default: '#9A9EA1',
      active: '#FFF',
    },
    menuItemFocus: '#462AC4',
    menuItemFontSelected: '#462AC4',
    menuItemFont: '#9A9EA1',
  },
};
