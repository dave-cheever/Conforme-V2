import React from 'react';

import { Flex, Spacer, Text, Tooltip } from '@chakra-ui/react';

import { useAppContext } from '../contexts/AppProvider';
import { useFiltersContext } from '../contexts/FiltersProvider';
import useDevice from '../hooks/useDevice';
import useNavigate from '../hooks/useNavigate';
import { ArrowCount } from '../icons';
import { ILocation } from '../interfaces/ILocation';
import AvatarCell from './Table/Cells/AvatarCell';

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
      data-id="000327"
      flexShrink={0}
      fontSize="14px"
      fontWeight="500"
      h="50px"
      mt="0px"
      onClick={() => openLocationModal('edit', location)}
      overflow="hidden"
      pl={3}
    >
      <Flex data-id="000328"  w={['max-content', 'full']}>
        {location.name}
      </Flex>
      {device !== 'mobile' && device !== 'tablet' && (
        <>
          <Flex data-id="000329" w="full">
            <Text data-id="000330" mr="25px" noOfLines={1}>
              {location.notes || '-'}
            </Text>
          </Flex>
          <AvatarCell data-id="001204" users={location.owner ? [location.owner] : []} />
        </>
      )}
      <Spacer data-id="000333" display={['block', 'none']} />
      <Flex alignItems="center" data-id="000334" w={['97px', 'full']}>
        {module?.type === 'tracker' ? location.trackerItemsResponsesCount || 0 : location.totalAuditsCount || 0}
        <Tooltip data-id="000335" fontSize="md" label="Show Items">
          <ArrowCount
            cursor="pointer"
            data-id="000336"
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
