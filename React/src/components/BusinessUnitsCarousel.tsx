import React from 'react';
import { Stack, Image, Text, Flex, Skeleton } from '@chakra-ui/react';
import { IBusinessUnit } from '../interfaces/IBusinessUnit';

const BusinessUnitsCarousel = ({
  businessUnits,
  selectedBusinessUnits
}: {
  businessUnits: IBusinessUnit[];
  selectedBusinessUnits: IBusinessUnit[];
}) => {

  if (selectedBusinessUnits?.length > 10) {
    return (
      <Flex
        bg="businessUnitsCarousel.manyBg"
        borderRadius="10px"
        w={['full', 'full', '160px']}
        h="fit-content"
        mr="3"
        p="3"
        pl="4"
        flexDirection="column"
        boxShadow="md"
      >
        <Text fontSize="14px">Assigned to {selectedBusinessUnits.length === businessUnits.length && 'all'}</Text>
        <Text fontSize="48px" lineHeight="57px" fontWeight="500">
          {selectedBusinessUnits?.length}
        </Text>
        <Text fontSize="sm">Units</Text>
      </Flex>
    );
  }

  return (
    <Stack spacing={2} mr="3">
      {selectedBusinessUnits?.map((businessUnit, i) => (
        <Skeleton key={`bu-${i}`} isLoaded={!!businessUnit}>
          <Flex
            bg="businessUnitsCarousel.elementBg"
            borderRadius="md"
            w={['full', 'full', '160px']}
            h="50px"
            key={businessUnit?._id}
          >
            <Image w="50px" objectFit="cover" src={businessUnit?.imgUrl} borderLeftRadius="md" />
            <Flex p="2" align="center" w="calc(100% - 50px)">
              <Text fontSize="sm" noOfLines={2} overflow="hidden" textOverflow="ellipsis">
                {businessUnit?.name}
              </Text>
            </Flex>
          </Flex>
        </Skeleton>
      ))}
    </Stack>
  );
};

export default BusinessUnitsCarousel;
