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
        data-id="000146"
        isCentered
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        motionPreset="slideInBottom"
        onClose={onClose}>
      <AlertDialogOverlay data-id="000147" />
      <AlertDialogContent data-id="000148">
        <AlertDialogHeader data-id="000149">{title}</AlertDialogHeader>
        <AlertDialogCloseButton data-id="000150" />
        <AlertDialogBody data-id="000151">{description}</AlertDialogBody>
        <AlertDialogFooter data-id="000152" justifyContent="space-between">
          <Text color="alertDialog.state" data-id="000153" fontSize="md">
            {state}
          </Text>
          {showButtons && (
            <HStack data-id="000154">
              <Button
                data-id="000155"
                disabled={!!state}
                onClick={handleNo}
                ref={cancelRef}>
                No
              </Button>
              <Button
                _hover={{
                  bg: 'alertDialog.buttons.action.hover',
                }}
                bg="alertDialog.buttons.action.bg"
                color="alertDialog.buttons.action.color"
                data-id="000156"
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
