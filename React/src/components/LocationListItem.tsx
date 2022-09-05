import React from 'react';

import { Avatar, Flex, Spacer, Text, Tooltip } from '@chakra-ui/react';

import { useAppContext } from '../contexts/AppProvider';
import { useFiltersContext } from '../contexts/FiltersProvider';
import useDevice from '../hooks/useDevice';
import useNavigate from '../hooks/useNavigate';
import { ArrowCount } from '../icons';
import { ILocation } from '../interfaces/ILocation';

const LocationListItem = ({ location, openLocationModal }: { location: ILocation; openLocationModal }) => {
  const device = useDevice();
  const { module } = useAppContext();
  const { navigateTo } = useNavigate();
  const { setResponseFiltersValue, setAuditFiltersValue } = useFiltersContext();

  return (
    <Flex
      align="center"
      bg="adminTrackerItems.element.bg"
      borderBottom="1px solid"
      borderColor="adminTableHeader.border"
      color="adminTrackerItems.element.font"
      cursor="pointer"
      flexShrink={0}
      fontSize="smm"
      fontWeight="semi_medium"
      h="73px"
      mt="0px"
      overflow="hidden"
      pl={6}
      w="calc(100% - 22px)"
    >
      <Flex onClick={() => openLocationModal('edit', location)} w={['max-content', 'full']}>
        {location.name}
      </Flex>
      {device !== 'mobile' && device !== 'tablet' && (
        <>
          <Flex w="full">
            <Text mr="25px" noOfLines={1}>
              {location.notes || '-'}
            </Text>
          </Flex>
          <Flex w="full">
            <Avatar
              bg="userMenu.avatar.bg"
              color="userMenu.avatar.color"
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
      <Spacer display={['block', 'none']} />
      <Flex alignItems="center" w={['97px', 'full']}>
        {module?.type === 'tracker' ? location.trackerItemsResponsesCount || 0 : location.totalAuditsCount || 0}
        <Tooltip fontSize="md" label="Show Items">
          <ArrowCount
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
};

export default LocationListItem;
