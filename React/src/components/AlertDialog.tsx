import React from 'react';

import {
  AlertDialogBody,
  AlertDialog as AlertDialogChakra,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  HStack,
  Text,
} from '@chakra-ui/react';

interface IAlertDialog {
  isOpen: boolean;
  title?: string;
  description?: string;
  state?: string;
  showButtons?: boolean;
  handleYes?: any;
  handleNo?: any;
  onClose?: any;
}

const AlertDialog = ({
  isOpen,
  title,
  description,
  state,
  showButtons,
  handleYes,
  handleNo,
  onClose,
}: IAlertDialog) => {
  const cancelRef: any = React.useRef();
  return (
    <AlertDialogChakra
      isCentered
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      motionPreset="slideInBottom"
      onClose={onClose}
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader>{title}</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>{description}</AlertDialogBody>
        <AlertDialogFooter justifyContent="space-between">
          <Text color="alertDialog.state" fontSize="md">
            {state}
          </Text>
          {showButtons && (
            <HStack>
              <Button disabled={!!state} onClick={handleNo} ref={cancelRef}>
                No
              </Button>
              <Button
                _hover={{
                  bg: 'alertDialog.buttons.action.hover',
                }}
                bg="alertDialog.buttons.action.bg"
                color="alertDialog.buttons.action.color"
                isLoading={!!state}
                ml={3}
                onClick={handleYes}
              >
                Yes
              </Button>
            </HStack>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogChakra>
  );
};

export const alertDialogStyles = {
  alertDialog: {
    state: '#CCCCCC',
    buttons: {
      action: {
        color: 'white',
        bg: '#462AC4',
        hover: '#462AC470',
      },
    },
  },
};

export default AlertDialog;
