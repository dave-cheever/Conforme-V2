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

const AuditHistory = () => {
  const { navigateTo } = useNavigate();
  const { audit, questionsCategories } = useAuditContext();

  const { data, loading } = useQuery(GET_HISTORICAL_AUDITS, {
    variables: {
      auditQueryInput: {
        auditTypesIds: [audit?.auditTypeId],
        areasIds: [audit?.area?._id],
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
    <Stack bg="auditHistory.bg" px={6} py={6} rounded="20px" w="full">
      {loading && <Loader />}
      <Stack spacing={4}>
        {Object.entries(days).map(([day, audits]) => (
          <HStack align="flex-start" key={day} spacing={4}>
            <Box
              bg="auditHistory.date.bg"
              color="auditHistory.date.color"
              flexShrink={0}
              fontSize="smm"
              fontWeight="bold"
              px={4}
              py={1}
              rounded="10px"
            >
              {day}
            </Box>
            <Stack spacing={4} w="full">
              {audits.map((audit) => (
                <HStack
                  _hover={{
                    bg: 'auditHistory.listItem.bg.hover',
                  }}
                  bg="auditHistory.listItem.bg.default"
                  key={audit._id}
                  p={4}
                  role="group"
                  rounded="10px"
                  spacing={4}
                  w="full"
                >
                  <Avatar alignSelf="flex-start" name={audit?.auditor?.displayName} size="sm" src={audit?.auditor?.imgUrl} />
                  <Stack flexGrow={1} spacing={2}>
                    <Flex direction="column">
                      <Text color="auditHistory.listItem.auditor" fontSize="ssm">
                        {audit.auditor?.displayName}
                        {audit.metatags?.addedAt && ` - ${format(new Date(audit.metatags.addedAt), 'H:mm')}`}
                      </Text>
                      <Text color="auditHistory.listItem.title" fontSize="smm">
                        Completed {a(t('audit') as string)}
                      </Text>
                    </Flex>
                    <HStack fontSize="smm" spacing={6}>
                      {questionsCategories.map((questionsCategory) => (
                        <HStack
                          key={questionsCategory._id}
                          opacity={audit.questionsCategoriesCount[questionsCategory._id] ? 1 : 0.25}
                          spacing={2}
                        >
                          <Icon
                            fill="auditHistory.listItem.icon.fill"
                            h="13px"
                            icon={questionsCategory.icon}
                            stroke="auditHistory.listItem.icon.stroke"
                            w="13px"
                          />
                          <Text>{audit.questionsCategoriesCount[questionsCategory._id] || 0}</Text>
                        </HStack>
                      ))}
                    </HStack>
                  </Stack>
                  <Flex
                    _groupHover={{
                      display: 'flex',
                    }}
                    align="center"
                    display="none"
                  >
                    <Button
                      bg="auditHistory.listItem.button.bg"
                      color="auditHistory.listItem.button.color"
                      fontSize="ssm"
                      fontWeight="bold"
                      h="28px"
                      onClick={() => navigateTo(`/audits/${audit._id}`)}
                      rounded="10px"
                    >
                      Load walk
                    </Button>
                  </Flex>
                </HStack>
              ))}
            </Stack>
          </HStack>
        ))}
      </Stack>
    </Stack>
  );
};

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
