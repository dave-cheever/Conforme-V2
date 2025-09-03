import { Box, Button, Flex, HStack, Menu, MenuButton, MenuList, Spacer, Text } from '@chakra-ui/react';

import { ChevronRight, UpAndDownIcon } from '../icons';

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
  return (
    <Box data-id="030925-b86422" ml={ml ?? '10px'}>
      <Menu data-id="030925-8e9126" autoSelect={false}>
        {({ onClose }) => (
          <>
            <MenuButton
              data-id="030925-fccfab"
              _active={{}}
              _hover={{}}
              as={Button}
              bg="sortButton.menuButtonBg"
              border={"1px solid #CBD5E0"}
              fontSize="14px"
              fontWeight="700"
              h="40px"
              leftIcon={<UpAndDownIcon
                data-id="030925-44e3e0"
                color="sortButton.rightIcon"
                h="12px"
                mt="3px"
                transform="rotate(90deg)"
                w="12px" />}
              ml={['15px', '0']}
              rounded="10px">
              <Flex data-id="030925-850c9c" align="center" mr="1">
                <Text data-id="030925-52b9e3" fontSize="14px" fontWeight="semi_medium">
                  Sort by
                </Text>
              </Flex>
            </MenuButton>
            <MenuList
              data-id="030925-830657"
              border="none"
              boxShadow="simple"
              rounded="lg"
              w="100px"
              zIndex={2}>
              {sortBy.map((sortItem) => (
                <Flex data-id="030925-dd08f8" key={sortItem.key} px={3} py={2}>
                  <Box data-id="030925-1e498e">
                    <Text data-id="030925-507f78" color="sortButton.menuItemFont" fontSize="14px">
                      {sortItem.label}
                    </Text>
                  </Box>
                  <Spacer data-id="030925-0e5967" />
                  <HStack data-id="030925-bf7b37">
                    <Flex
                      data-id="030925-bacd79"
                      align="center"
                      bg={sortType === sortItem.key && sortOrder === 'asc' ? 'sortButton.menuItemFocus' : undefined}
                      h="30px"
                      justify="center"
                      onClick={() => {
                        setSortType(sortItem.key);
                        setSortOrder('asc');
                        onClose();
                      }}
                      rounded="5px"
                      w="30px">
                      <ChevronRight
                        data-id="030925-7b194a"
                        color={sortType === sortItem.key && sortOrder === 'asc' ? 'sortButton.icon.active' : 'sortButton.icon.default'}
                        cursor="pointer"
                        h="12px"
                        transform="rotate(-90deg)"
                        w="12px" />
                    </Flex>
                    <Spacer data-id="030925-400a99" />
                    <Flex
                      data-id="030925-772568"
                      align="center"
                      bg={sortType === sortItem.key && sortOrder === 'desc' ? 'sortButton.menuItemFocus' : undefined}
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
                        data-id="030925-35a57d"
                        color={sortType === sortItem.key && sortOrder === 'desc' ? 'sortButton.icon.active' : 'sortButton.icon.default'}
                        cursor="pointer"
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
  );
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
