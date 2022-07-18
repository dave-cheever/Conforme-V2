import { ChevronRightIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Divider, Flex, Skeleton, Text, Tooltip } from '@chakra-ui/react';
import { format } from 'date-fns';

import { auditStatuses } from '../../hooks/useAuditUtils';
import useNavigate from '../../hooks/useNavigate';
import { ActionsIcon, WarningIcon } from '../../icons';
import { IAudit } from '../../interfaces/IAudit';

const AuditSquare = ({ audit }: { audit: IAudit }) => {
  const { navigateTo } = useNavigate();

  return (
    <Box
      _hover={{ boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.18)' }}
      bg="white"
      borderRadius="20px"
      boxShadow="sm"
      cursor="pointer"
      flexShrink={0}
      h="290px"
      onClick={() => navigateTo(`/audits/${audit?._id}`)}
      p="20px 25px 20px 25px"
      w={['full', 'full', '350px']}
    >
      <Flex align="center" justify="space-between">
        <Flex align="center">
          <Flex h="12px" rounded="full" w="12px" />
          <Box color="auditSquare.fontColor" fontSize="11px" opacity="1" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
            <Flex>{audit?.auditType?.name}</Flex>
          </Box>
        </Flex>
      </Flex>
      <Flex align="center" h="52px" ml={2} mt={2} position="relative" w="full">
        <Skeleton isLoaded={!!audit} rounded="full">
          <Tooltip label={audit?.auditor?.displayName}>
            <Avatar boxSize="24px" cursor="pointer" name={audit?.auditor?.displayName} size="sm" src={audit?.auditor?.imgUrl} />
          </Tooltip>
        </Skeleton>
        <Text color="auditSquare.nameFontColor" fontSize="16px" fontWeight="700" lineHeight="20px" ml={3} noOfLines={2} w="full">
          {audit?.walkType === 'physical' ? audit?.area?.name : 'Virtual walk'}
        </Text>
      </Flex>
      <Flex align="center" h="40px" w="full">
        {audit?.walkType === 'physical' && (
          <Box fontSize="ssm" lineHeight="20px" overflow="hidden" pl={2} textOverflow="ellipsis" w={['auto', '200px']} whiteSpace="nowrap">
            <Text color="auditSquare.titleFontColor">Site</Text>
            <Text>{audit?.site?.name}</Text>
          </Box>
        )}
        <Box fontSize="ssm" lineHeight="20px" overflow="hidden" pl={2} textOverflow="ellipsis" w={['auto', '200px']} whiteSpace="nowrap">
          <Text color="auditSquare.titleFontColor">Type</Text>
          <Text textTransform="capitalize">{audit?.walkType}</Text>
        </Box>
      </Flex>
      <Flex alignItems="flex-start" h="50px" py="4" w="full">
        <Box fontSize="ssm" ml={2} w="50%">
          <Text color="auditSquare.titleFontColor">Due for</Text>
          <Box fontSize="ssm" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
            {audit?.dueDate ? format(new Date(audit?.dueDate), 'd MMM yyyy') : <Flex fontStyle="italic">No due date</Flex>}
          </Box>
        </Box>
      </Flex>
      <Flex align="center" justify="space-between" pt="50px" w="full">
        <Button
          _hover={{
            bg: 'auditSquare.buttonBg',
          }}
          bg="auditSquare.buttonBg"
          color="auditSquare.fontColor"
          fontSize="ssm"
          h="28px"
          onClick={() => navigateTo(`/audits/${audit._id}/`)}
          rightIcon={<ChevronRightIcon boxSize="20px" color="auditSquare.fontColor" />}
          w="85px"
        >
          More
        </Button>
        <Flex align="center" color={`auditSquare.${audit?.status}`} flexDirection="column" justify="center" mr={1}>
          <Flex fontSize="11px" fontWeight="700">
            {audit?.status === 'missed' && <WarningIcon fill="transparent" h="16px" mr={2} stroke="auditSquare.missed" w="16px" />}
            <Text as="span">{auditStatuses[audit?.status]}</Text>
            {audit?.status === 'completed' && (
              <>
                <Divider color="lightgray" h="auto" mx="15px" orientation="vertical" />
                <ActionsIcon fill="transparent" h="16px" stroke="#D2D1D7" w="16px" />
                <Text as="span" color="auditSquare.nameFontColor" ml={2}>
                  {audit?.numberOfActions}
                </Text>
              </>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default AuditSquare;

export const auditSquareStyles = {
  auditSquare: {
    completed: '#62c240',
    missed: '#FC5960',
    upcoming: '#FFA012',
    statusFontColor: '#FFFFFF',
    imageBg: '#ffffff',
    rightIcon: '#9A9EA1',
    crossIcon: '#F0F0F0',
    tickIcon: '#41BA17',
    fontColor: '#818197',
    dueDateColor: '#424B50',
    evidenceFontColor: '#424B50',
    titleFontColor: '#818197',
    categoryFontColor: '#818197',
    nameFontColor: '#282F36',
    buttonBg: '#F0F2F5',
  },
};
