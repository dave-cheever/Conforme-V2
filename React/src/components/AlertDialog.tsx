import React from 'react';
import {
  AlertDialog as AlertDialogChakra,
  AlertDialogBody,
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
};

const AlertDialog = ({ isOpen, title, description, state, showButtons, handleYes, handleNo, onClose }: IAlertDialog) => {
  const cancelRef: any = React.useRef();
  return (<AlertDialogChakra
    motionPreset="slideInBottom"
    leastDestructiveRef={cancelRef}
    onClose={onClose}
    isOpen={isOpen}
    isCentered>
    <AlertDialogOverlay />
    <AlertDialogContent>
      <AlertDialogHeader>{title}</AlertDialogHeader>
      <AlertDialogCloseButton />
      <AlertDialogBody>
        {description}
      </AlertDialogBody>
      <AlertDialogFooter justifyContent='space-between'>
        <Text fontSize='md' color='brand.paleGrey'>{state}</Text>
        {showButtons && (
          <HStack>
            <Button ref={cancelRef} onClick={handleNo} disabled={!!state}>No</Button>
            <Button colorScheme="red" onClick={handleYes} ml={3} isLoading={!!state}>Yes</Button>
          </HStack>
        )}
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialogChakra>
  )
}
export default AlertDialog;