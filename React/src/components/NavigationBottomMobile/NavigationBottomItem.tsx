import React from 'react';

import { Box, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Icon, Text, useDisclosure } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import useNavigate from '../../hooks/useNavigate';
import { CloseDrawerIcon } from '../../icons';
import { IMenuItem } from '../../interfaces/IMenu';
import NavigationLeftFilters from '../NavigationLeft/NavigationLeftFilters';

function NavigationBottomItem({
  menuItem,
  filtersOpen,
  setFiltersOpen,
  setSubsectionOpen,
}: {
  menuItem: IMenuItem;
  filtersOpen: boolean;
  setFiltersOpen: (value: boolean) => void;
  subsectionOpen: boolean;
  setSubsectionOpen: (value: boolean) => void;
}) {
  const { navigateTo, isPathActive } = useNavigate();
  const { url, icon, label } = menuItem;
  const { responsesStatusesCounts } = useFiltersContext();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
        alignItems="center"
        data-id="000527"
        display="flex"
        flexDirection="column"
        gap="2px"
        height="fit-content"
        justifyContent="center"
        onClick={() => {
          if (menuItem.url === '/') {
            setFiltersOpen(!filtersOpen);
            setSubsectionOpen(false);
            navigateTo(url);
          } else if (menuItem.url === '/admin') {
            onOpen();
            setFiltersOpen(false);
          } else navigateTo(url);
        }}
        pos="relative"
        width='85.8px'>
      {/* Indicator line for items with submenus */}
      {menuItem.subSections && (
        <Box
          bg="#CBD5E0"
          borderRadius="32px"
          data-id="002490"
          height="2px"
          left="50%"
          position="absolute"
          top="-0px"
          transform="translateX(-50%)"
          width="14px"
          zIndex="1" />
      )}
      <Flex
        alignItems="center"
        bg={(() => {
          const isActive = menuItem.subSections 
            ? isPathActive(url)
            : isPathActive(url, { exact: true });
          return isActive ? '#0068A3' : 'none';
        })()}
        data-id="000528"
        h="30px"
        justifyContent="center"
        paddingX={'15px'}
        rounded="8px"
        w="fit-content">
        <Icon
          as={icon}
          data-id="000529"
          fill={(() => {
            const isActive = menuItem.subSections 
              ? isPathActive(url)
              : isPathActive(url, { exact: true });
            return isActive ? '#ffffff' : '#4A5568';
          })()}
          h="18px"
          stroke={(() => {
            const isActive = menuItem.subSections 
              ? isPathActive(url)
              : isPathActive(url, { exact: true });
            return isActive ? '#ffffff' : '#4A5568';
          })()}
          w="18px" />
      </Flex>
      <Text 
        color="#4A5568"
        data-id="000530" 
        fontSize="12px"
        fontWeight={(() => {
          const isActive = menuItem.subSections 
            ? isPathActive(url)
            : isPathActive(url, { exact: true });
          return isActive ? "600" : "400";
        })()}
        overflow="hidden"
        textAlign="center"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        width="85%">
        {label}
      </Text>
      {filtersOpen && menuItem.url === '/' && (
        <Box
          bg="white"
          bottom="45px"
          boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)"
          data-id="000532"
          pos="absolute"
          py="15px"
          right="0"
          rounded="10px"
          w="220px"
          zIndex="5">
          {Object.keys(responsesStatusesCounts).length !== 0 && (
            <NavigationLeftFilters
              data-id="000533"
              filter={['all', responsesStatusesCounts.compliant + responsesStatusesCounts.nonCompliant]}
              setFiltersOpen={setFiltersOpen} />
          )}
          {Object.entries(responsesStatusesCounts).map((filter) => (
            <NavigationLeftFilters
              data-id="000534"
              filter={filter}
              key={filter[0]}
              setFiltersOpen={setFiltersOpen} />
          ))}
        </Box>
      )}
      <Drawer data-id="002491" isOpen={isOpen} onClose={onClose} placement="bottom">
        <DrawerOverlay data-id="002492" />
        <DrawerContent borderTopRadius="20px" data-id="002493">
           <DrawerHeader
             borderBottomColor="#E2E8F0"
             borderBottomWidth="1px"
             data-id="002494"
             display={'flex'}
             flexDirection={'row'}
             justifyContent={'space-between'}>
             <Text data-id="002495">{label}</Text>
             <Box alignItems={'center'} cursor="pointer" data-id="close-drawer" justifyContent={'center'} onClick={onClose}>
               <CloseDrawerIcon data-id="002496" dataId="close-drawer-icon" />
             </Box>
           </DrawerHeader>
          <DrawerBody data-id="002497" p={0}>
            {menuItem.subSections?.map((subSection) => (
              <Box
                _hover={{ bg: 'gray.50' }}
                cursor="pointer"
                data-id="002498"
                key={subSection.label}
                onClick={() => {
                  navigateTo(subSection.url);
                  onClose();
                }}
                px={'16px'}
                py="16px">
                <Text data-id="002499" fontSize="md" fontWeight="medium">
                  {subSection.label}
                </Text>
              </Box>
            ))}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default NavigationBottomItem;
