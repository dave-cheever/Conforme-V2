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
    <Box data-id="000474" ml={ml ?? '10px'}>
      <Menu data-id="000475" autoSelect={false}>
        {({ onClose }) => (
          <>
            <MenuButton
              data-id="000476"
              _active={{}}
              _hover={{}}
              as={Button}
              bg="sortButton.menuButtonBg"
              border={"1px solid #CBD5E0"}
              fontSize="14px"
              fontWeight="700"
              h="40px"
              leftIcon={<UpAndDownIcon
                data-id="000477"
                color="sortButton.rightIcon"
                h="12px"
                mt="3px"
                transform="rotate(90deg)"
                w="12px" />}
              ml={['15px', '0']}
              rounded="10px">
              <Flex data-id="000478" align="center" mr="1">
                <Text data-id="000479" fontSize="14px" fontWeight="semi_medium">
                  Sort by
                </Text>
              </Flex>
            </MenuButton>
            <MenuList
              data-id="000480"
              border="none"
              boxShadow="simple"
              rounded="lg"
              w="100px"
              zIndex={2}>
              {sortBy.map((sortItem) => (
                <Flex data-id="000481" key={sortItem.key} px={3} py={2}>
                  <Box data-id="000482">
                    <Text data-id="000483" color="sortButton.menuItemFont" fontSize="14px">
                      {sortItem.label}
                    </Text>
                  </Box>
                  <Spacer data-id="000484" />
                  <HStack data-id="000485">
                    <Flex
                      data-id="000486"
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
                        data-id="000487"
                        color={sortType === sortItem.key && sortOrder === 'asc' ? 'sortButton.icon.active' : 'sortButton.icon.default'}
                        cursor="pointer"
                        h="12px"
                        transform="rotate(-90deg)"
                        w="12px" />
                    </Flex>
                    <Spacer data-id="000488" />
                    <Flex
                      data-id="000489"
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
                        data-id="000490"
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
