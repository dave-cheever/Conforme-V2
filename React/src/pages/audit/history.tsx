import { useMemo } from 'react';

import { gql, useQuery } from '@apollo/client';
import { Avatar, Box, Button, Flex, HStack, Stack, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { t } from 'i18next';
import a from 'indefinite';
import { countBy } from 'lodash';

import Icon from '../../components/Icon';
import Loader from '../../components/Loader';
import { useAuditContext } from '../../contexts/AuditProvider';
import useDevice from '../../hooks/useDevice';
import useNavigate from '../../hooks/useNavigate';
import { IAudit } from '../../interfaces/IAudit';

const GET_HISTORICAL_AUDITS = gql`
  query GetHistoricalAudits($auditQueryInput: AuditQueryInput) {
    audits(auditQueryInput: $auditQueryInput) {
      _id
      questions {
        questionsCategoryId
      }
      auditor {
        _id
        displayName
        imgUrl
      }
      metatags {
        addedAt
      }
    }
  }
`;

function AuditHistory() {
  const { navigateTo } = useNavigate();
  const { audit, questionsCategories } = useAuditContext();
  const device = useDevice();

  const { data, loading, error } = useQuery(GET_HISTORICAL_AUDITS, {
    variables: {
      auditQueryInput: {
        auditTypesIds: [audit?.auditTypeId],
        businessUnitsIds: [audit?.businessUnit?._id],
      },
    },
  });
  const days: {
    [day: string]: (IAudit & {
      questionsCategoriesCount: { [key: string]: number };
    })[];
  } = useMemo(() => {
    const audits = data?.audits || [];
    return audits.reduce((acc, curr) => {
      // Filter out current audit
      if (curr._id === audit?._id) return acc;

      const date = new Date(curr.metatags.addedAt);
      const day = format(date, 'd MMMM yy');
      const auditWithCount = {
        ...curr,
        questionsCategoriesCount: countBy(curr.questions, 'questionsCategoryId'),
      };
      if (!acc[day]) {
        return {
          ...acc,
          [day]: [auditWithCount],
        };
      }
      return {
        ...acc,
        [day]: [...acc[day], auditWithCount],
      };
    }, {});
  }, [JSON.stringify(data)]);

  return (
    <Stack
        data-id="000550"
        bg="auditHistory.bg"
        border="1px solid #CBD5E0"
        h="full"
        maxH={['none', 'calc(100vh - 220px)']}
        overflowY="auto"
        px={6}
        py={6}
        rounded="20px"
        sx={{
          '&::-webkit-scrollbar': {
            width: '0px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'transparent',
          },
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE and Edge
        }}
        w="full"
      >
      {loading ? (
        <Loader data-id="000551" />
      ) : (
        <Stack data-id="000552" spacing={4}>
          {Object.entries(days).length > 0 ? (
            Object.entries(days).map(([day, audits]) => (
              <Stack
                data-id="000553"
                align="flex-start"
                direction={['column', 'row']}
                key={day}
                spacing={4}>
                <Box
                  data-id="000554"
                  bg="auditHistory.date.bg"
                  color="auditHistory.date.color"
                  flexShrink={0}
                  fontSize="smm"
                  fontWeight="bold"
                  px={4}
                  py={1}
                  rounded="10px">
                  {day}
                </Box>
                <Stack data-id="000555" spacing={4} w="full">
                  {audits.map((audit) => (
                    <HStack
                      data-id="000556"
                      _hover={{
                        bg: 'auditHistory.listItem.bg.hover',
                      }}
                      bg="auditHistory.listItem.bg.default"
                      border="1px solid #CBD5E0"
                      key={audit._id}
                      onClick={device === 'mobile' ? () => navigateTo(`/audits/${audit._id}`) : () => { }}
                      p={4}
                      role="group"
                      rounded="10px"
                      spacing={4}
                      w="full">
                      <Avatar
                        data-id="000557"
                        alignSelf="flex-start"
                        name={audit?.auditor?.displayName?.replace(/\s*\(.*?\)\s*/g, '')} 
                        size="sm"
                        src={audit?.auditor?.imgUrl} />
                      <Stack data-id="000558" flexGrow={1} spacing={2}>
                        <Flex data-id="000559" direction="column">
                          <Text
                            data-id="000560"
                            color="auditHistory.listItem.auditor"
                            fontSize="ssm">
                            {audit.auditor?.displayName}
                            {audit.metatags?.addedAt && ` - ${format(new Date(audit.metatags.addedAt), 'H:mm')}`}
                          </Text>
                          <Text data-id="000561" color="auditHistory.listItem.title" fontSize="smm">
                            Completed {a(t('audit') as string)}
                          </Text>
                        </Flex>
                        <HStack data-id="000562" fontSize="smm" spacing={6}>
                          {questionsCategories.map((questionsCategory, index) => (
                            <HStack
                              data-id="000563"
                              key={questionsCategory?._id || index}
                              opacity={audit.questionsCategoriesCount[questionsCategory?._id] ? 1 : 0.25}
                              spacing={2}>
                              <Icon
                                data-id="000564"
                                fill="auditHistory.listItem.icon.fill"
                                h="13px"
                                icon={questionsCategory?.icon}
                                stroke="auditHistory.listItem.icon.stroke"
                                w="13px" />
                              <Text data-id="000565">{audit.questionsCategoriesCount[questionsCategory?._id] || 0}</Text>
                            </HStack>
                          ))}
                        </HStack>
                      </Stack>
                      {device !== 'mobile' && (
                        <Flex
                          data-id="000566"
                          _groupHover={{
                            display: 'flex',
                          }}
                          align="center"
                          display="none">
                          <Button
                            data-id="000567"
                            bg="auditHistory.listItem.button.bg"
                            color="auditHistory.listItem.button.color"
                            fontSize="ssm"
                            fontWeight="bold"
                            h="28px"
                            onClick={() => navigateTo(`/audits/${audit._id}`)}
                            rounded="10px">
                            Load walk
                          </Button>
                        </Flex>
                      )}
                    </HStack>
                  ))}
                </Stack>
              </Stack>
            ))
          ) : (
            <Flex
              data-id="000568"
              fontSize="18px"
              fontStyle="italic"
              h="full"
              w="full">
              {error?.message || 'No history'}
            </Flex>
          )}
        </Stack>
      )}
    </Stack>
  );
}

export default AuditHistory;

export const auditHistoryStyles = {
  auditHistory: {
    bg: '#FFF',
    date: {
      bg: '#F4F3F5',
      color: '#1E1836',
    },
    listItem: {
      bg: {
        default: '#FFF',
        hover: '#F4F3F5',
      },
      auditor: '#1E183650',
      title: '#1E1836',
      icon: {
        fill: 'transparent',
        stroke: '#1E1836',
      },
      button: {
        bg: '#DC0043',
        color: '#FFF',
      },
    },
  },
};
