import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { gql, useMutation } from '@apollo/client';
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

import { toastFailed, toastSuccess } from '../../bootstrap/config';
import TextInput from '../Forms/TextInput';

interface IAddComplianceItemAttribute {
  isOpenModal: boolean;
  refetch: () => void;
  attributeType: 'Category' | 'Regulatory body' | undefined;
  onAction: (action: 'close') => void;
  newAttributeValue: (arg0: {
    value: string;
    type: 'category' | 'regulatoryBody';
  }) => void;
}

const CREATE_CATEGORY = gql`
  mutation ($name: String!) {
    createCategory(name: $name) {
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

const AddComplianceItemAttribute = ({
  isOpenModal,
  onAction,
  attributeType,
  newAttributeValue,
  refetch,
}: IAddComplianceItemAttribute) => {
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

  const addAttribute = async (
    type: 'Category' | 'Regulatory body' | undefined,
  ) => {
    try {
      if (Object.keys(errors).length === 0) {
        const values = getValues();
        switch (type) {
          case 'Category': {
            const { data: category } = await createCategory({
              variables: values,
            });
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

  const onAddAction = async (
    type: 'Category' | 'Regulatory body' | undefined,
  ) => {
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
      isCentered
      isOpen={isOpenModal}
      onClose={onClose}
      onEsc={() => onAction('close')}
      onOverlayClick={() => onAction('close')}
      size="xs"
    >
      <ModalOverlay />
      <ModalContent borderRadius={['0', '20px']} position="absolute">
        <Flex flexDirection="column" p="25px">
          <Flex>
            <Box fontSize="smm" fontWeight="bold" mb="10px">
              {`Add ${attributeType}`}
            </Box>
            <ModalCloseButton onClick={() => onAction('close')} />
          </Flex>
          <TextInput
            control={control}
            name="name"
            placeholder={`${attributeType} name`}
            validations={{
              notEmpty: true,
            }}
          />
          <Flex justifyContent="end" mt="34px">
            <Button
              _hover={{
                backgroundColor: 'addComplianceItemAttribute.button.hover',
              }}
              bg="addComplianceItemAttribute.button.bg"
              borderRadius="10px"
              color="addComplianceItemAttribute.button.color"
              onClick={() => onAddAction(attributeType)}
            >
              Add
            </Button>
          </Flex>
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default AddComplianceItemAttribute;

export const addComplianceItemAttributeStyles = {
  addComplianceItemAttribute: {
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
