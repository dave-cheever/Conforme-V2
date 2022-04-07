import { Button, Flex, Heading } from '@chakra-ui/react';

const Audit = () => (
  <>
    <Flex flexDir="column" h={['fit-content', 'full']} w="full">
      <Flex
        alignItems="center"
        justifyContent={['space-between', 'initial']}
        mb="8"
      >
        <Heading mb={3}>Walk Items</Heading>
        <Button
          bg="auditModal.tabs.bottomButton.bg"
          borderRadius="10px"
          color="auditModal.tabs.bottomButton.color"
          ml={3}
        >
          Add
        </Button>
      </Flex>
    </Flex>
  </>
);

export default Audit;

export const auditItemStyles = {
  auditItem: {
    addButton: {
      bg: 'auditModal.tabs.bottomButton.bg',
      color: 'auditModal.tabs.bottomButton.color',
    },
    bg: 'white',
    nextButtonColor: '#818197',
    labelColor: '#818197',
    expandButtonText: '#462AC4',
    labelTextColor: '#1F1F1F',
    textColor: '#282F36',
  },
};
