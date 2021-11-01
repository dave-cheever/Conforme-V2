import { Text, Box, Spacer, Icon, Flex, Avatar } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

import { INavItem } from "../../interfaces/INavItem";
import SubSection from "./SubSection";

const NavigationLeftItem = ({
  icon,
  label,
  url,
  isActive,
  type,
  subSections,
}: INavItem) => {
  const history = useHistory();

  return (
    <Flex>
      {isActive === true && (
        <Flex
          w="10px"
          h="38px"
          mt="-10px"
          pos="absolute"
          left="0"
          bg="navigationLeft.menuList.activeIndicator"
          borderRightRadius="4px"
        />
      )}

      <Flex flexDir="column">
        <Box
          pos="relative"
          display="flex"
          flexDirection="row"
          alignContent="center"
          ml="-26px"
          onClick={() => {
            if (
              subSections &&
              url &&
              !history.location.pathname.includes(url)
            ) {
              history.push(subSections[0].url);
            } else if (
              (url && !history.location.pathname.includes(url)) ||
              url === "/"
            ) {
              history.push(url);
            }
          }}
          cursor="pointer"
        >
          <Icon
            as={icon}
            width="22px"
            height="22px"
            left="25px"
            top="10px"
            mb="28px"
            mr="22px"
            ml="26px"
            stroke={
              isActive
                ? "navigationLeft.menuList.selectedMenuItem"
                : "navigationLeft.menuList.unselectedMenuItem"
            }
          />
          {type === "mentions" && (
            <Flex
              justifyContent="center"
              bg="navigationLeft.mentionBackground"
              rounded="50%"
              pos="absolute"
              w="15px"
              h="15px"
              left={10}
              top={-2}
            >
              <Text fontSize="11px" fontWeight="bold">
                2
              </Text>
            </Flex>
          )}
          <Text
            fontSize="16px"
            lineHeight="19px"
            mt="2px"
            color={
              isActive
                ? "navigationLeft.menuList.selectedMenuItem"
                : "navigationLeft.menuList.unselectedMenuItem"
            }
          >
            {label}
          </Text>
          {type === "mentions" && (
            <Flex ml='10px' width="74px" justifyContent="space-between">
              <Avatar
                name="Mention1"
                src="https://i.ibb.co/V2RtVyN/Ellipse-3.png"
                h="22px"
                w="22px"
              />
              <Avatar
                name="Mention2"
                src="https://i.ibb.co/WtJM5B5/Ellipse-2.png"
                h="22px"
                w="22px"
              />
              <Avatar
                name="Mention2"
                src="https://i.ibb.co/8NrPHLD/Ellipse-1.png"
                h="22px"
                w="22px"
              />
            </Flex>
          )}
          <Spacer />
        </Box>
        {subSections && url && history.location.pathname.includes(url) && (
          <Flex flexDir="column">
            {subSections.map((section) => (
              <SubSection
                key={section.label}
                url={section.url}
                label={section.label}
              />
            ))}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default NavigationLeftItem;
