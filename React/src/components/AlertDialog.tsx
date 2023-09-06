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
    (<AlertDialogChakra
      data-id="290d401c856e"
      isCentered
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      motionPreset="slideInBottom"
      onClose={onClose}>
      <AlertDialogOverlay data-id="d32c26439944" />
      <AlertDialogContent data-id="31e4d9cfbe70">
        <AlertDialogHeader data-id="51e100dbd9de">{title}</AlertDialogHeader>
        <AlertDialogCloseButton data-id="c18b1b498492" />
        <AlertDialogBody data-id="9e86353b7676">{description}</AlertDialogBody>
        <AlertDialogFooter data-id="7150bf80cca1" justifyContent="space-between">
          <Text color="alertDialog.state" data-id="6533b0817499" fontSize="md">
            {state}
          </Text>
          {showButtons && (
            <HStack data-id="7504d915dc65">
              <Button
                data-id="151e439ac343"
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
                data-id="ca2311d321dc"
                isLoading={!!state}
                ml={3}
                onClick={handleYes}>
                Yes
              </Button>
            </HStack>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogChakra>)
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
