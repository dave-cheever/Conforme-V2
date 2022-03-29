import React from 'react';

import { Button, Flex, Text } from '@chakra-ui/react';

import { useResponseContext } from '../../contexts/ResponseProvider';
import Can from '../can';

const TeamHeader = ({
  header,
  onOpen,
  setFilterType,
  isButtonVisible = true,
  action,
}: {
  header: string;
  onOpen: () => void;
  setFilterType: (value: string) => void;
  isButtonVisible?: boolean;
  action: string;
}) => {
  const { response, snapshot } = useResponseContext();

  return (
    <Flex alignItems="center" justify={['center', 'flex-start']} mb="15px">
      <Text>{header}</Text>
      {!snapshot && (
        <Can
          action={action}
          data={{ response }}
          yes={() =>
            isButtonVisible ? (
              <Button
                bg="teamPage.button.addDelegates.bg"
                color="teamPage.button.addDelegates.color"
                fontSize="11px"
                h="28px"
                ml="10px"
                onClick={() => {
                  onOpen();
                  setFilterType('responsibleId');
                }}
                rounded="10px"
                w="52px"
              >
                Add
              </Button>
            ) : (
              <> </>
            )
          }
        />
      )}
    </Flex>
  );
};

export default TeamHeader;
