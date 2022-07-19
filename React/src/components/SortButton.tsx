import { Box, Button, Flex, HStack, Menu, MenuButton, MenuList, Spacer, Text } from '@chakra-ui/react';

import { ChevronRight } from '../icons';

const SortButton = ({
  sortBy,
  sortOrder,
  sortType,
  setSortType,
  setSortOrder,
}: {
  sortBy: { label: string; key: string }[];
  sortOrder: 'asc' | 'desc';
  sortType: string;
  setSortType: (key: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
}) => (
  <Box ml="15px">
    <Menu autoSelect={false}>
      {({ onClose }) => (
        <>
          <MenuButton
            _active={{}}
            _hover={{}}
            as={Button}
            bg="sortButton.menuButtonBg"
            fontSize="14px"
            fontWeight="700"
            h="40px"
            ml={['15px', '0']}
            rightIcon={<ChevronRight color="sortButton.rightIcon" h="12px" mt="3px" transform="rotate(90deg)" w="12px" />}
            rounded="10px"
          >
            <Flex align="center" mr="1">
              <Text fontSize="smm" fontWeight="semi_medium">
                Sort by
              </Text>
            </Flex>
          </MenuButton>
          <MenuList border="none" boxShadow="simple" rounded="lg" w="100px" zIndex={2}>
            {sortBy.map((sortItem) => (
              <Flex key={sortItem.key} px={3} py={2}>
                <Box>
                  <Text color="sortButton.menuItemFont" fontSize="14px">
                    {sortItem.label}
                  </Text>
                </Box>
                <Spacer />
                <HStack>
                  <Box
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
                    w="30px"
                  >
                    <ChevronRight
                      color={sortType === sortItem.key && sortOrder === 'asc' ? 'sortButton.icon.active' : 'sortButton.icon.default'}
                      cursor="pointer"
                      h="12px"
                      transform="rotate(-90deg)"
                      w="12px"
                    />
                  </Box>
                  <Spacer />
                  <Flex
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
                    w="30px"
                  >
                    <ChevronRight
                      color={sortType === sortItem.key && sortOrder === 'desc' ? 'sortButton.icon.active' : 'sortButton.icon.default'}
                      cursor="pointer"
                      h="12px"
                      transform="rotate(90deg)"
                      w="12px"
                    />
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
