import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { gql, useMutation } from '@apollo/client';
import { Box, Button, Flex, Modal, ModalCloseButton, ModalContent, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react';

import { toastFailed, toastSuccess } from '../../bootstrap/config';
import { useAppContext } from '../../contexts/AppProvider';
import TextInput from '../Forms/TextInput';

interface IAddTrackerItemAttribute {
  isOpenModal: boolean;
  refetch: () => void;
  attributeType: 'Category' | 'Regulatory body' | undefined;
  onAction: (action: 'close') => void;
  newAttributeValue: (arg0: { value: string; type: 'category' | 'regulatoryBody' }) => void;
}

const CREATE_CATEGORY = gql`
  mutation ($name: String!, $moduleId: ID!) {
    createCategory(name: $name, moduleId: $moduleId) {
      _id
      name
    }
  }
`;

const CREATE_REGULATORY_BODY = gql`
  mutation ($name: String!) {
    createRegulatoryBody(name: $name) {
      _id
      name
    }
  }
`;

function AddTrackerItemAttribute({ isOpenModal, onAction, attributeType, newAttributeValue, refetch }: IAddTrackerItemAttribute) {
  const { module } = useAppContext();
  const { onClose } = useDisclosure();
  const [createCategory] = useMutation(CREATE_CATEGORY);
  const [createRegulatoryBody] = useMutation(CREATE_REGULATORY_BODY);
  const toast = useToast();

  const {
    control,
    formState: { errors },
    getValues,
    trigger,
    reset,
  } = useForm({
    mode: 'all',
    defaultValues: {
      _id: '',
      name: '',
    },
  });

  useEffect(
    () => () => {
      reset({
        _id: '',
        name: '',
      });
    },

    [],
  );

  const addAttribute = async (type: 'Category' | 'Regulatory body' | undefined) => {
    try {
      if (Object.keys(errors).length === 0) {
        const values = getValues();
        switch (type) {
          case 'Category': {
            const { data: category } = await createCategory({ variables: { ...values, moduleId: module?._id } });
            refetch();
            toast({ ...toastSuccess, description: 'Category added' });
            newAttributeValue({
              value: category.createCategory._id,
              type: 'category',
            });
            break;
          }
          case 'Regulatory body': {
            const { data: regulatoryBody } = await createRegulatoryBody({
              variables: values,
            });
            toast({ ...toastSuccess, description: 'Regulatory body added' });
            refetch();
            newAttributeValue({
              value: regulatoryBody.createRegulatoryBody._id,
              type: 'regulatoryBody',
            });
            break;
          }
          default:
            onAction('close');
            break;
        }
      } else {
        toast({
          ...toastFailed,
          description: 'Please complete all the required fields',
        });
      }
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    } finally {
      onAction('close');
    }
  };

  const onAddAction = async (type: 'Category' | 'Regulatory body' | undefined) => {
    const isFormValid = await trigger();
    if (!isFormValid) {
      return toast({
        ...toastFailed,
        description: 'Please complete all the required fields',
      });
    }

    return addAttribute(type);
  };

  return (
    <Modal
        data-id="000394"
        isCentered
        isOpen={isOpenModal}
        onClose={onClose}
        onEsc={() => onAction('close')}
        onOverlayClick={() => onAction('close')}
        size="xs">
      <ModalOverlay data-id="000395" />
      <ModalContent borderRadius={['0', '20px']} data-id="000396" position="absolute">
        <Flex data-id="000397" flexDirection="column" p="25px">
          <Flex data-id="000398">
            <Box data-id="000399" fontSize="smm" fontWeight="bold" mb="10px">
              {`Add ${attributeType}`}
            </Box>
            <ModalCloseButton data-id="000400" onClick={() => onAction('close')} />
          </Flex>
          <TextInput
            control={control}
            data-id="000401"
            name="name"
            placeholder={`${attributeType} name`}
            validations={{
              notEmpty: true,
            }} />
          <Flex data-id="000402" justifyContent="end" mt="34px">
            <Button
              _hover={{
                backgroundColor: 'addTrackerItemAttribute.button.hover',
              }}
              bg="addTrackerItemAttribute.button.bg"
              borderRadius="10px"
              color="addTrackerItemAttribute.button.color"
              data-id="000403"
              onClick={() => onAddAction(attributeType)}>
              Add
            </Button>
          </Flex>
        </Flex>
      </ModalContent>
    </Modal>
  );
}

export default AddTrackerItemAttribute;

export const addTrackerItemAttributeStyles = {
  addTrackerItemAttribute: {
    content: {
      bg: '#FFFFFF',
    },
    body: {
      bg: '#FFFFFF',
    },
    button: {
      bg: '#462AC4',
      hover: '#462AC4',
      color: '#ffffff',
    },
    text: {
      color: '#818197',
    },
  },
};
