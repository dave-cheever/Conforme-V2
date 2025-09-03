import React from 'react';

import { Avatar, Flex, Spacer, Text, Tooltip } from '@chakra-ui/react';

import { useAppContext } from '../contexts/AppProvider';
import { useFiltersContext } from '../contexts/FiltersProvider';
import useDevice from '../hooks/useDevice';
import useNavigate from '../hooks/useNavigate';
import { ArrowCount } from '../icons';
import { ILocation } from '../interfaces/ILocation';

function LocationListItem({ location, openLocationModal, index }: { location: ILocation; openLocationModal: any; index: number }) {
  const device = useDevice();
  const { module } = useAppContext();
  const { navigateTo } = useNavigate();
  const { setResponseFiltersValue, setAuditFiltersValue } = useFiltersContext();
  const rowBg = index % 2 === 0 ? 'white' : 'gray.50';

  return (
    <Flex
      data-id="030925-e5ba94"
      _hover={{ bg: '#F5F7FA' }}
      align="center"
      bg={rowBg}
      borderBottomColor="auditsList.headerBorderColor"
      borderBottomWidth="1px"
      color="auditsList.fontColor"
      cursor="pointer"
      flexShrink={0}
      fontSize="14px"
      fontWeight="500"
      h="50px"
      mt="0px"
      onClick={() => openLocationModal('edit', location)}
      overflow="hidden"
      pl={3}
    >
      <Flex data-id="030925-83d81f"  w={['max-content', 'full']}>
        {location.name}
      </Flex>
      {device !== 'mobile' && device !== 'tablet' && (
        <>
          <Flex data-id="030925-08693a" w="full">
            <Text data-id="030925-71a486" mr="25px" noOfLines={1}>
              {location.notes || '-'}
            </Text>
          </Flex>
          <Flex data-id="030925-bf1cd2" w="full">
            <Avatar
              data-id="030925-ccd51c"
              bg="userMenu.avatar.bg"
              color="userMenu.avatar.color"
              h="24px"
              mr="10px"
              name={location?.owner?.displayName?.replace(/\s*\(.*?\)\s*/g, '')}
              rounded="full"
              size="sm"
              src={location?.owner?.imgUrl}
              w="24px"
            />
            {location?.owner?.displayName}
          </Flex>
        </>
      )}
      <Spacer data-id="030925-ebb405" display={['block', 'none']} />
      <Flex data-id="030925-bb3ef1" alignItems="center" w={['97px', 'full']}>
        {module?.type === 'tracker' ? location.trackerItemsResponsesCount || 0 : location.totalAuditsCount || 0}
        <Tooltip data-id="030925-3e73ec" fontSize="md" label="Show Items">
          <ArrowCount
            data-id="030925-f67d8b"
            cursor="pointer"
            h="10px"
            ml="13px"
            onClick={() => {
              if (module?.type === 'tracker') setResponseFiltersValue({ locationsIds: { value: [location._id] } });
              else setAuditFiltersValue({ locationsIds: { value: [location._id] } });
              navigateTo('/');
            }}
            stroke="locations.tooltipStroke"
            w="10px"
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
}

export default LocationListItem;
