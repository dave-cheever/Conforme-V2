import { useEffect, useState } from "react";
import { AccordionItem, AccordionButton, AccordionPanel } from "@chakra-ui/accordion";
import { Box, Spacer, Badge, Stack, Flex, Text } from "@chakra-ui/layout";

import { IComplianceItemModalSection, useComplianceItemModalContext } from "../../contexts/ComplianceItemModalProvider";
import { CircleEmpty, CircleChecked, ErrorSign } from "../../icons";

const ComplianceItemModalSection = (section: IComplianceItemModalSection, index: number) => {
  const {
    errors, trigger,
    selectedSection,
    selectedSectionIndex,
    setSelectedSection,
  } = useComplianceItemModalContext();

  const [sectionVisited, setSectionVisited] = useState(false);
  const { name, fields, Component } = section;

  useEffect(() => {
    if (selectedSection.name === name) {
      setSectionVisited(true);
    } else {
      if (sectionVisited) {
        trigger(Object.keys(fields || []) as any);
      }
    }
  }, [selectedSection.name === name]); // eslint-disable-line react-hooks/exhaustive-deps

  const sectionErrorsCount = Object.keys(errors).reduce((acc, fieldName) => {
    if (Object.keys(fields || []).includes(fieldName)) {
      return acc + 1;
    }
    return acc;
  }, 0);

  return (
    <AccordionItem
      key={name}
      bg={name === 'Summary' || index > selectedSectionIndex ? 'transparent' : 'white'}
      borderRadius='10px'
      borderWidth='0 !important'
      m={1}
      boxShadow={name === 'Summary' || index > selectedSectionIndex ? 'none' : '0px 4px 10px rgba(0, 0, 0, 0.05)'}
    >
      <AccordionButton
        h="50px"
        onClick={() => setSelectedSection(section)}
        display={name === 'Summary' ? 'none' : 'flex'}
        _hover={{
          backgroundColor: 'white',
          borderRadius: '10px',
        }}
      >
        {index >= selectedSectionIndex && <CircleEmpty boxSize={6} color='adminComplianceItemModal.section.emptyCircle' />}
        {index < selectedSectionIndex && (
          <CircleChecked
            boxSize={6}
            color={!!sectionErrorsCount ? 'adminComplianceItemModal.section.fullCircle.error' : 'adminComplianceItemModal.section.fullCircle.success'}
          />
        )}
        <Box m="2" textAlign="left" fontWeight="bold">{name}</Box>
        <Spacer />
        {!!sectionErrorsCount &&
          <Badge colorScheme='red' variant='solid'>
            <Stack align='center' spacing={1} direction='row'>
              <ErrorSign color='adminComplianceItemModal.section.errorSign' />
              <Text>{sectionErrorsCount}</Text>
            </Stack>
          </Badge>
        }
      </AccordionButton>
      <AccordionPanel
        borderRadius='10px'
        bg={name === 'Summary' ? 'transparent' : 'white'}
      >
        <Flex visibility={selectedSection.name === name ? 'visible' : 'hidden'}>
          <Component />
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default ComplianceItemModalSection;
