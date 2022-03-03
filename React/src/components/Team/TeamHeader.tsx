import React from 'react';
import { Flex, Text, Button } from '@chakra-ui/react';

import Can from '../can';
import { useResponseContext } from '../../contexts/ResponseProvider';

const TeamHeader = ({
  header,
  onOpen,
  setFilterType,
  isButtonVisible = true,
  action
}: {
  header: string,
  onOpen: () => void,
  setFilterType: (value: string) => void,
  isButtonVisible?: boolean,
  action: string
}) => {
  const { response, snapshot } = useResponseContext();

  return (
    <Flex alignItems="center" mb="15px" justify={["center", "flex-start"]}>
      <Text>{header}</Text>
      {!snapshot && <Can
        action={action}
        data={{ response }}
        yes={() =>
        (isButtonVisible ?
          <Button
            w="52px"
            h="28px"
            ml="10px"
            bg="teamPage.button.addDelegates.bg"
            fontSize="11px"
            color="teamPage.button.addDelegates.color"
            rounded="10px"
            onClick={() => {
              onOpen();
              setFilterType("responsibleId");
            }}
          >
            Add
          </Button> : <> </>
        )
        }
      />}
    </Flex>
  );
};

export default TeamHeader;
