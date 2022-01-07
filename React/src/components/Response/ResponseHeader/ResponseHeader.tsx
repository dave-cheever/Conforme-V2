import { useContext, useEffect, useMemo, useState } from 'react';
import { Badge, Button, Flex, Heading, Menu, MenuButton, MenuDivider, MenuList, Spacer, useToast } from '@chakra-ui/react';
import format from 'date-fns/format';

import { isPermitted } from '../../can';
import { useAppContext } from '../../../contexts/AppProvider';
import { FollowIcon, ShareIcon, CheckIcon, ArrowDownIcon } from '../../../icons';
import { useResponseContext } from '../../../contexts/ResponseProvider';
import { ResponseContext } from '../../../contexts/ResponseProvider';
import ResponseHeaderStatus from './ResponseHeaderStatus';
import ResponseHeaderButton from './ResponseHeaderButton';
import ResponseHeaderMenuItem from './ResponseHeaderMenuItem';
import useResponseUtils from '../../../hooks/useResponseUtils';
import { toastSuccess } from '../../../bootstrap/config';

const ReasponseHeader = () => {
  const { response, handleRenewalOpen } = useResponseContext();
  const toast = useToast();
  const { getStatus, getRenewalStatus, isEvidenceUploaded, areRequiredQuestionsAnswered } = useResponseUtils();
  const { user } = useAppContext();
  const currentEvidenceItems = response?.evidence?.filter(({ outdated }) => !outdated);
  const { handleShareOpen } = useContext(ResponseContext);
  const [status, setStatus] = useState<"compliant" | "nonCompliant" | "">("");

  useEffect(() => {
    if (status === "nonCompliant" && getStatus(response) === "compliant") {
      toast({
        ...toastSuccess,
        title: "Response is Compliant",
        description: `Compliant until ${response.nextRenewalDate ? format(new Date(response.nextRenewalDate), "dd MMMM yyyy") : "N/A"}`
      });
      return setStatus("compliant");
    }
    setStatus(getStatus(response));
    // eslint-disable-next-line
  }, [response]);

  const enableRenewalButton = useMemo(() => {
    if (!response) {
      return false;
    }

    if (getRenewalStatus(response) === "comingUp") {
      return isPermitted({
        user,
        data: { response },
        action: "responses.edit",
      });
    }

    if (getRenewalStatus(response) === "overdue" && response.status === "completed") {
      return isPermitted({
        user,
        data: { response },
        action: "responses.edit",
      });
    }

    return false;

    // eslint-disable-next-line
  }, [response, user]);

  return (
    <Flex
      direction='column'
      pl={6}
      w="full"
      minH="100px"
      bg="reasponseHeader.bg"
      zIndex={1}
      mb="15px"
    >

      <Flex alignItems='center' w="full" h="40px" mb="15px">
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
      <Flex mb="15px">
        <Flex alignItems='center' w="full" maxW={["100vw", "390px"]} pl={["10px", "0px"]} pr={["35px", "0px"]}>
          <ResponseHeaderStatus heading="Compliant" status={response && getStatus(response) === "compliant" ? "Yes" : "No"} />
          <Spacer />
          {currentEvidenceItems?.length > 0 && <ResponseHeaderStatus heading="Evidence provided" status={isEvidenceUploaded(response) ? 'Yes' : 'No'} />}
          <Spacer />
          <ResponseHeaderStatus heading="Questions answered" status={areRequiredQuestionsAnswered(response) ? 'Yes' : 'No'} />
        </Flex>
        <Spacer display={["none", "flex"]} />
        <Flex color='white' justify='flex-end' h='40px' mr="27px" display={["none", "flex"]}>
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
              onClick={handleRenewalOpen}
              display={["none", "flex"]}
              isDisabled={!enableRenewalButton}
            >Renew</Button>
          }
        </Flex>
      </Flex>

      <Flex alignItems='center' h='40px' mr="25px" display={["flex", "none"]}>
        <Menu>
          {({ isOpen }) => (
            <>
              <MenuButton
                colorScheme='reasponseHeader.optionsMenuColorScheme'
                bg={isOpen ? "reasponseHeader.optionsMenuBgOpen" : "reasponseHeader.optionsMenuBg"}
                color="reasponseHeader.optionsMenuButtonColor"
                textAlign="left"
                fontWeight="bold"
                fontSize="smm"
                fontFamily="Helvetica"
                lineHeight="18px"
                w="full"
                isActive={isOpen}
                as={Button}
                rightIcon={<ArrowDownIcon />}
                borderRadius="10px">
                {isOpen ? 'Options' : 'Options'}

              </MenuButton>

              <MenuList
                borderColor="reasponseHeader.optionsMenuBorderColor"
                minW={["calc(100vw - 50px)", "325px"]}
                w="100%"
                boxShadow="0px 0px 80px"
                color="reasponseHeader.optionsMenuBoxShadow"
                borderRadius="10px"
              >
                <ResponseHeaderMenuItem
                  title="Follow"
                  icon={
                    <FollowIcon
                      fontSize="15px"
                      stroke="reasponseHeader.buttonLightColor"
                      fill='transparent'
                      _groupHover={{ stroke: 'reasponseHeader.buttonLightColorHover' }}
                    />}
                  onClick={undefined}
                />
                <ResponseHeaderMenuItem
                  title="Share"
                  icon={
                    <ShareIcon
                      fontSize="15px"
                      stroke="reasponseHeader.buttonLightColor"
                      _groupHover={{ stroke: 'reasponseHeader.buttonLightColorHover' }}
                    />}
                  onClick={handleShareOpen}
                />
                <MenuDivider borderColor="reasponseHeader.optionsMenuDivider" ml="20px" mr="20px" border="1px" />
                <ResponseHeaderMenuItem
                  title="Renew"
                  icon={
                    <CheckIcon
                      fontSize="15px"
                      stroke="reasponseHeader.buttonLightColor"
                      fill='transparent'
                      _groupHover={{ stroke: 'reasponseHeader.buttonLightColorHover' }}
                    />}
                  onClick={handleRenewalOpen}
                />
              </MenuList>
            </>
          )}
        </Menu>
      </Flex>


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
    buttonLightColorHover: "#FFFFFF",
    optionsMenuColorScheme: "#818197",
    optionsMenuBg: "#818197",
    optionsMenuBgOpen: "#282F36",
    optionsMenuButtonColor: "#FFFFFF",
    optionsMenuBorderColor: "#FFFFFF",
    optionsMenuDivider: "#F0F0F0",
    optionsMenuBoxShadow: "rgba(49, 50, 51, 0.25)",
    optionsMenuColor: "#818197",





  }
}
