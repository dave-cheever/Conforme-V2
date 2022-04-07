import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/react';

import { useAuditContext } from '../../contexts/AuditProvider';
import { ArrowDownIcon, ShareIcon } from '../../icons';
import AuditHeaderButton from './AuditHeaderButton';
import AuditHeaderMenuItem from './AuditHeaderMenuItem';

const AuditHeader = () => {
  const { audit, auditor, site, area } = useAuditContext();

  if (!audit) return null;

  return (
    <>
      <Flex
        bg="auditHeader.bg"
        direction="column"
        mb="15px"
        minH="100px"
        pl={6}
        w="full"
        zIndex={1}
      >
        <Stack
          alignItems="center"
          direction="row"
          h="40px"
          mb="15px"
          spacing={4}
          w="full"
        >
          <Heading
            alignItems={['flex-start', 'center']}
            color="auditHeader.heading"
            fontSize="xxl"
            fontWeight="bold"
          >
            {area?.name ?? 'Virtual'}
          </Heading>
        </Stack>
        <Flex mb="15px">
          <Grid
            alignItems="stretch"
            gap="30px"
            maxW={['100vw', '390px']}
            pl={['10px', '0px']}
            pr={['35px', '0px']}
            templateColumns={['repeat(2, 1fr)', 'repeat(5, 1fr)']}
            w="full"
          >
            <GridItem>
              <Box fontSize="11px" opacity={0.5}>
                Item ID
              </Box>
              <Flex mr={2}>
                <Text fontSize="smm">{audit?.reference}</Text>
              </Flex>
            </GridItem>
            <GridItem>
              <Flex mr={2}>
                <Avatar
                  mr={3}
                  name={auditor?.displayName}
                  rounded="full"
                  size="xs"
                  src={auditor?.imgUrl}
                />
                <Box>
                  <Box fontSize="11px" opacity={0.5}>
                    Owner
                  </Box>
                  <Text fontSize="smm">{auditor?.displayName}</Text>
                </Box>
              </Flex>
            </GridItem>
            <GridItem>
              <Box fontSize="11px" opacity={0.5}>
                Site
              </Box>
              <Flex mr={2}>
                <Text fontSize="smm">{site?.name}</Text>
              </Flex>
            </GridItem>
            {area?.name && (
              <>
                <GridItem>
                  <Box fontSize="11px" opacity={0.5}>
                    Area
                  </Box>
                  <Flex mr={2}>
                    <Text fontSize="smm">{area?.name}</Text>
                  </Flex>
                </GridItem>
              </>
            )}
            <GridItem>
              <Box fontSize="11px" opacity={0.5}>
                Type
              </Box>
              <Flex mr={2}>
                <Text fontSize="smm" textTransform="capitalize">
                  {audit?.walkType}
                </Text>
              </Flex>
            </GridItem>
          </Grid>
          <Spacer display={['none', 'flex']} />
          <Flex
            color="white"
            display={['none', 'flex']}
            h="40px"
            justify="flex-end"
            mr="27px"
          >
            <AuditHeaderButton
              icon={
                <ShareIcon
                  _groupHover={{
                    stroke: 'auditHeader.buttonLightColorHover',
                  }}
                  fontSize="15px"
                  stroke="auditHeader.buttonLightColor"
                />
              }
              name="Share"
              onClick={() => {}}
            />
          </Flex>
          <Flex
            color="white"
            display={['none', 'flex']}
            h="40px"
            justify="flex-end"
            mr="27px"
          >
            <Button
              _hover={{
                bg: 'auditHeader.buttonLightBgHover',
                color: 'auditHeader.buttonLightColorHover',
                cursor: 'pointer',
                stroke: 'green',
              }}
              bg="auditHeader.buttonLightBg"
              color="auditHeader.buttonLightColor"
              onClick={() => {}}
            >
              Save
            </Button>
          </Flex>
        </Flex>
        <Flex alignItems="center" display={['flex', 'none']} h="40px" mr="25px">
          <Menu>
            {({ isOpen }) => (
              <>
                <MenuButton
                  as={Button}
                  bg={
                    isOpen
                      ? 'auditHeader.optionsMenuBgOpen'
                      : 'auditHeader.optionsMenuBg'
                  }
                  borderRadius="10px"
                  color="auditHeader.optionsMenuButtonColor"
                  colorScheme="auditHeader.optionsMenuColorScheme"
                  fontFamily="Helvetica"
                  fontSize="smm"
                  fontWeight="bold"
                  isActive={isOpen}
                  lineHeight="18px"
                  rightIcon={<ArrowDownIcon />}
                  textAlign="left"
                  w="full"
                >
                  Options
                </MenuButton>

                <MenuList
                  borderColor="auditHeader.optionsMenuBorderColor"
                  borderRadius="10px"
                  boxShadow="0px 0px 80px"
                  color="auditHeader.optionsMenuBoxShadow"
                  minW={['calc(100vw - 50px)', '325px']}
                  w="100%"
                >
                  <AuditHeaderMenuItem
                    icon={
                      <ShareIcon
                        _groupHover={{
                          stroke: 'auditHeader.buttonLightColorHover',
                        }}
                        fontSize="15px"
                        stroke="auditHeader.buttonLightColor"
                      />
                    }
                    onClick={() => {}}
                    title="Share"
                  />
                  <MenuItem
                    color="auditHeadeMenuItem.optionsMenuColor"
                    onClick={() => {}}
                    w="100%"
                  >
                    <Box p="2">Save</Box>
                  </MenuItem>
                </MenuList>
              </>
            )}
          </Menu>
        </Flex>
      </Flex>
    </>
  );
};

export default AuditHeader;

export const auditHeaderStyles = {
  auditHeader: {
    bg: '#E5E5E5',
    heading: '#282F36',
    badge: '#FF9A00',
    badgeBg: 'rgba(255, 154, 0, 0.1)',
    badgeColorScheme: 'orange',
    buttonDarkBg: '#818197',
    buttonDarkColor: '#FFFFFF',
    buttonDarkBgHover: '#FFFFFF',
    buttonDarkColorHover: '#818197',
    buttonLightBg: '#FFFFFF',
    buttonLightColor: '#818197',
    buttonLightBgHover: '#818197',
    buttonLightColorHover: '#FFFFFF',
    optionsMenuColorScheme: '#818197',
    optionsMenuBg: '#818197',
    optionsMenuBgOpen: '#282F36',
    optionsMenuButtonColor: '#FFFFFF',
    optionsMenuBorderColor: '#FFFFFF',
    optionsMenuDivider: '#F0F0F0',
    optionsMenuBoxShadow: 'rgba(49, 50, 51, 0.25)',
    optionsMenuColor: '#818197',
    snapshot: {
      color: '#ff7000',
    },
  },
};
