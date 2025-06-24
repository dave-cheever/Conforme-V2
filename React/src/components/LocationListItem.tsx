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
      _hover={{ bg: '#F5F7FA' }}
      align="center"
      bg={rowBg}
      borderBottomColor="auditsList.headerBorderColor"
      borderBottomWidth="1px"
      color="auditsList.fontColor"
      cursor="pointer"
      data-id="96adef20cb4f"
      flexShrink={0}
      fontSize="14px"
      fontWeight="500"
      h="50px"
      mt="0px"
      overflow="hidden"
      pl={6}
      w="calc(100% - 22px)"
    >
      <Flex data-id="8270f05bd9d6" onClick={() => openLocationModal('edit', location)} w={['max-content', 'full']}>
        {location.name}
      </Flex>
      {device !== 'mobile' && device !== 'tablet' && (
        <>
          <Flex data-id="10061454c136" w="full">
            <Text data-id="d73573f70156" mr="25px" noOfLines={1}>
              {location.notes || '-'}
            </Text>
          </Flex>
          <Flex data-id="5e7285327f5b" w="full">
            <Avatar
              bg="userMenu.avatar.bg"
              color="userMenu.avatar.color"
              data-id="bc3ca127f3da"
              h="24px"
              mr="10px"
              name={location?.owner?.displayName}
              rounded="full"
              size="sm"
              src={location?.owner?.imgUrl}
              w="24px"
            />
            {location?.owner?.displayName}
          </Flex>
        </>
      )}
      <Spacer data-id="542645157092" display={['block', 'none']} />
      <Flex alignItems="center" data-id="395feb86882b" w={['97px', 'full']}>
        {module?.type === 'tracker' ? location.trackerItemsResponsesCount || 0 : location.totalAuditsCount || 0}
        <Tooltip data-id="213dd5445151" fontSize="md" label="Show Items">
          <ArrowCount
            cursor="pointer"
            data-id="9f9a87f5965a"
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
