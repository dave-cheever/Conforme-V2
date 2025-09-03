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

function AlertDialog({ isOpen, title, description, state, showButtons, handleYes, handleNo, onClose }: IAlertDialog) {
  const cancelRef: any = React.useRef();
  return (
    <AlertDialogChakra
        data-id="030925-f09f65"
        isCentered
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        motionPreset="slideInBottom"
        onClose={onClose}>
      <AlertDialogOverlay data-id="030925-4678b0" />
      <AlertDialogContent data-id="030925-6f2ab0">
        <AlertDialogHeader data-id="030925-784591">{title}</AlertDialogHeader>
        <AlertDialogCloseButton data-id="030925-6f6b5e" />
        <AlertDialogBody data-id="030925-5acfc0">{description}</AlertDialogBody>
        <AlertDialogFooter data-id="030925-4daa41" justifyContent="space-between">
          <Text data-id="030925-558e2a" color="alertDialog.state" fontSize="md">
            {state}
          </Text>
          {showButtons && (
            <HStack data-id="030925-c85daf">
              <Button
                data-id="030925-25962e"
                disabled={!!state}
                onClick={handleNo}
                ref={cancelRef}>
                No
              </Button>
              <Button
                data-id="030925-e25fd1"
                _hover={{
                  bg: 'alertDialog.buttons.action.hover',
                }}
                bg="alertDialog.buttons.action.bg"
                color="alertDialog.buttons.action.color"
                isLoading={!!state}
                ml={3}
                onClick={handleYes}>
                Yes
              </Button>
            </HStack>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogChakra>
  );
}

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
