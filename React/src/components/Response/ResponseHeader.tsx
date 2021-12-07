import { useContext } from 'react';
import { Grid, Flex, Heading, Button, Badge } from '@chakra-ui/react';
import { isPermitted } from '../can';
import { useAppContext } from '../../contexts/AppProvider';
import { FollowIcon, ShareIcon } from '../../icons';
import { useResponseContext } from '../../contexts/ResponseProvider';
import { ResponseContext } from '../../contexts/ResponseProvider';
import ResponseHeaderStatus from './ResponseHeaderStatus';
import ResponseHeaderButton from './ResponseHeaderButton';
import useResponseUtils from '../../hooks/useResponseUtils';


const ReasponseHeader = () => {
  const { response } = useResponseContext();
  const { getStatus, getRenewalStatus } = useResponseUtils();
  const { user } = useAppContext();
  const currentEvidenceItems = response?.evidence?.filter(({ outdated }) => !outdated);
  const { handleShareOpen } = useContext(ResponseContext);

  const enableRenewalButton =
    response && (
      getRenewalStatus(response) === 'comingUp' ||
      (getRenewalStatus(response) === 'overdue' && response.status === 'completed')
    ) && isPermitted({ user, data: { response }, action: 'responses.edit' });

  return (
    <Flex
      direction='column'
      pl={6}
      w="full"
      minH="110px"
      bg="reasponseHeader.bg"
      zIndex={4}
    >
      <Grid gridTemplateColumns='1fr 250px' pb="10px">
        <Flex alignItems='center' h="40px">
          <Heading
            color="reasponseHeader.heading"
            fontSize="xxl"
            fontWeight="bold"
            alignItems={['flex-start', 'center']}
          >
            {response?.complianceItem?.name}
          </Heading>
          {getRenewalStatus(response) === "comingUp" ? <Badge
            ml="13"
            bg="reasponseHeader.badgeBg"
            padding="6px 15px"
            borderRadius="10px"
            fontSize="11px"
            lineHeight="16px"
            fontWeight="bold"
            colorScheme="reasponseHeader.badgeColorScheme"
            color="reasponseHeader.badge"
            textTransform="capitalize"
          >
            Coming up
          </Badge> : ''}
        </Flex>
      </Grid>

      <Grid gridTemplateColumns='1fr 350px' >
        <Flex alignItems='center' h='40px'>
          <ResponseHeaderStatus heading="Compliant" status={response && getStatus(response) === "nonCompliant" ? "No" : "Yes"} />
          {currentEvidenceItems?.length > 0 && <ResponseHeaderStatus heading="Evidence provided" status={response?.evidence?.filter(({ outdated }) => !outdated).some(({ uploaded }) => !uploaded) ? 'No' : 'Yes'} />}
          <ResponseHeaderStatus heading="Questions answered" status={response?.complianceItem?.questions?.filter(({ required }) => required).find(({ value }) => value === undefined) ? 'No' : 'Yes'} />
        </Flex>
        <Flex color='white' justify='flex-end' h='40px' mr="27px">
          <ResponseHeaderButton
            name="Follow"
            icon={
              <FollowIcon
                fontSize="15px"
                stroke="reasponseHeader.buttonLightColor"
                fill='transparent'
                _groupHover={{ stroke: 'reasponseHeader.buttonLightColorHover' }}
              />
            }
            onClick={undefined}
          />
          <ResponseHeaderButton
            name="Share"
            icon={
              <ShareIcon
                fontSize="15px"
                stroke="reasponseHeader.buttonLightColor"
                _groupHover={{ stroke: 'reasponseHeader.buttonLightColorHover' }}
              />
            }
            onClick={handleShareOpen}
          />
          {!['Ad-hoc', 'Variable'].includes(response?.complianceItem?.frequency) &&
            <Button
              ml="15px"
              w='88px'
              borderRadius="10px"
              fontSize="smm"
              fontWeight="bold"
              bg={enableRenewalButton ? 'reasponseHeader.buttonDarkBg' : 'reasponseHeader.buttonDarkBg'}
              color={enableRenewalButton ? 'reasponseHeader.buttonDarkColor' : 'reasponseHeader.buttonDarkColor'}
              _hover={{ bg: "reasponseHeader.buttonDarkBgHover", color: 'reasponseHeader.buttonDarkColorHover' }}
            // onClick={handleRenewOpen}
            >Renew</Button>
          }
        </Flex>
      </Grid>
    </Flex>
  );
};

export default ReasponseHeader;

export const responseHeaderStyles = {
  reasponseHeader: {
    bg: "#E5E5E5",
    heading: "#282F36",
    badge: "#FF9A00",
    badgeBg: "rgba(255, 154, 0, 0.1)",
    badgeColorScheme: "orange",
    buttonDarkBg: "#818197",
    buttonDarkColor: "#FFFFFF",
    buttonDarkBgHover: "#FFFFFF",
    buttonDarkColorHover: "#818197",
    buttonLightBg: "#FFFFFF",
    buttonLightColor: "#818197",
    buttonLightBgHover: "#818197",
    buttonLightColorHover: "#FFFFFF"


  }
}
