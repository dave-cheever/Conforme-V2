import { gql, useQuery } from '@apollo/client';
import { Box, Flex, IconButton, Image, Text, useDisclosure } from '@chakra-ui/react';
import { format } from 'date-fns';

import { BlankPage, DownloadIcon, Trashcan } from '../../icons';
import { IDocument } from '../../interfaces/IResponse';
import DocumentDeleteModal from './DocumentDeleteModal';

const GET_DOCUMENT_DETAILS = gql`
  query FilesDetails($filesDetailsQuery: FilesDetailsQuery) {
    filesDetails(filesDetailsQuery: $filesDetailsQuery) {
      id
      thumbnail
      path
      preview
    }
  }
`;

const DocumentUploaded = ({
  document,
  removable = false,
  deleteModalMessage,
  downloadable = false,
  callback,
  doNotAwaitCallback,
}: {
  document: IDocument | undefined;
  removable?: boolean;
  deleteModalMessage?: string;
  downloadable?: boolean;
  callback?: () => Promise<void>;
  doNotAwaitCallback?: boolean;
}) => {
  const { data } = useQuery(GET_DOCUMENT_DETAILS, {
    variables: { filesDetailsQuery: { ids: [document?.id] } },
  });
  const { onOpen: openDeleteModal, onClose: handleDeleteModalClose, isOpen: isDeleteModalOpen } = useDisclosure();
  const documentDetails = (data?.filesDetails || [])[0];

  const remove = async () => {
    if (callback) {
      if (doNotAwaitCallback) callback();
      else await callback();
    }
  };

  return (
    <>
      <DocumentDeleteModal
        handleClose={handleDeleteModalClose}
        handleDelete={remove}
        isOpen={isDeleteModalOpen}
        message={deleteModalMessage || `Are you sure you wish to delete ${document?.name}?`}
      />
      <Flex
        align="center"
        bg="documentUploaded.bg"
        borderRadius="10px"
        color="brand.darkGrey"
        fontWeight="400"
        h="65px"
        justify="space-between"
        key={document?.id}
        role="group"
        w="full"
      >
        <Flex align="center" justify="space-between" w="full">
          <Box bg="documentUploaded.thumbnailBg" borderRadius="10px" flexShrink={0} fontSize="12px" h="55px" ml="5px" mr={2} w="55px">
            <Image
              fallback={
                <Flex align="center" h="full">
                  <BlankPage h="30px" w="55px" />
                </Flex>
              }
              maxHeight="55px"
              maxWidth="55px"
              src={documentDetails?.thumbnail}
            />
          </Box>
          <Flex direction="column" fontSize="12px" mr={2} overflow="hidden" textOverflow="ellipsis">
            <Text fontWeight="700" noOfLines={1} textOverflow="ellipsis">
              {document?.name}
            </Text>
            <Flex opacity="0.6">Uploaded {document && format(new Date(document.addedAt), 'Pp')}</Flex>
          </Flex>
          <Flex>
            {downloadable && (
              <IconButton
                _hover={{ bg: '' }}
                aria-label="delete evidence"
                bg=""
                display="inline-block"
                icon={<DownloadIcon stroke="documentUploaded.downloadIcon" />}
                ml={2}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(documentDetails?.path);
                }}
              />
            )}
            {removable && (
              <IconButton
                _hover={{ bg: '' }}
                aria-label="delete evidence"
                bg=""
                display="inline-block"
                icon={<Trashcan stroke="documentUploaded.binIcon" />}
                mr={2}
                onClick={(e) => {
                  e.stopPropagation();
                  openDeleteModal();
                }}
              />
            )}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default DocumentUploaded;

export const documentUploadedStyles = {
  documentUploaded: {
    bg: '#F2F2F2',
    thumbnailBg: '#FFFFFF',
    downloadIcon: '#282F36',
    binIcon: 'black',
  },
};
