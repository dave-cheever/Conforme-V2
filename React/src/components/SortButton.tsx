import { Box, Button, Flex, HStack, Menu, MenuButton, MenuList, Spacer, Text, Portal } from '@chakra-ui/react';

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
    <Box data-id="000474" ml={ml ?? '10px'} position="relative" zIndex={9999}>
      <Menu autoSelect={false} data-id="000475" strategy="fixed" placement="bottom-end">
        {({ onClose }) => (
          <>
            <MenuButton
              _active={{}}
              _hover={{}}
              as={Button}
              bg="sortButton.menuButtonBg"
              border={'1px solid #CBD5E0'}
              data-id="000476"
              fontSize="14px"
              fontWeight="700"
              h="40px"
              leftIcon={<UpAndDownIcon color="sortButton.rightIcon" data-id="000477" h="12px" mt="3px" w="12px" />}
              ml={['15px', '0']}
              rounded="10px"
            >
              <Flex align="center" data-id="000478" mr="1">
                <Text data-id="000479" fontSize="14px" fontWeight="semi_medium">
                  Sort by
                </Text>
              </Flex>
            </MenuButton>
            <Portal data-id="002464">
              <MenuList border="none" boxShadow="simple" data-id="000480" rounded="lg" w="100px" zIndex={9999}>
                {sortBy.map((sortItem) => (
                  <Flex data-id="000481" key={sortItem.key} px={3} py={2}>
                    <Box data-id="000482">
                      <Text color="sortButton.menuItemFont" data-id="000483" fontSize="14px">
                        {sortItem.label}
                      </Text>
                    </Box>
                    <Spacer data-id="000484" />
                    <HStack data-id="000485">
                      <Flex
                        align="center"
                        bg={sortType === sortItem.key && sortOrder === 'asc' ? 'sortButton.menuItemFocus' : undefined}
                        data-id="000486"
                        h="30px"
                        justify="center"
                        onClick={() => {
                          setSortType(sortItem.key);
                          setSortOrder('asc');
                          onClose();
                        }}
                        rounded="5px"
                        w="30px"
                      >
                        <ChevronRight
                          color={sortType === sortItem.key && sortOrder === 'asc' ? 'sortButton.icon.active' : 'sortButton.icon.default'}
                          cursor="pointer"
                          data-id="000487"
                          h="12px"
                          transform="rotate(-90deg)"
                          w="12px"
                        />
                      </Flex>
                      <Spacer data-id="000488" />
                      <Flex
                        align="center"
                        bg={sortType === sortItem.key && sortOrder === 'desc' ? 'sortButton.menuItemFocus' : undefined}
                        data-id="000489"
                        h="30px"
                        justify="center"
                        onClick={() => {
                          setSortType(sortItem.key);
                          setSortOrder('desc');
                          onClose();
                        }}
                        rounded="5px"
                        w="30px"
                      >
                        <ChevronRight
                          color={sortType === sortItem.key && sortOrder === 'desc' ? 'sortButton.icon.active' : 'sortButton.icon.default'}
                          cursor="pointer"
                          data-id="000490"
                          h="12px"
                          transform="rotate(90deg)"
                          w="12px"
                        />
                      </Flex>
                    </HStack>
                  </Flex>
                ))}
              </MenuList>
            </Portal>
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
