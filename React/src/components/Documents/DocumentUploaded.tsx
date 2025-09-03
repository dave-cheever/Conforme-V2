import { gql, useQuery } from '@apollo/client';
import { Flex, HStack, Image, Text, useDisclosure } from '@chakra-ui/react';
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

function DocumentUploaded({
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
}) {
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
        data-id="030925-ae989e"
        handleClose={handleDeleteModalClose}
        handleDelete={remove}
        isOpen={isDeleteModalOpen}
        message={deleteModalMessage || `Are you sure you wish to delete ${document?.name}?`} />
      <Flex
        data-id="030925-17bece"
        align="center"
        border="1px solid #CBD5E0"
        borderRadius="10px"
        color="brand.darkGrey"
        fontWeight="400"
        justify="space-between"
        key={document?.id}
        p={2}
        role="group"
        w="full">
        <Flex
          data-id="030925-bc140f"
          align="center"
          bg="documentUploaded.thumbnailBg"
          borderColor="documentUploaded.border"
          borderRadius="3px"
          borderWidth="1px"
          flexShrink={0}
          fontSize="12px"
          h="45px"
          justify="center"
          overflow="hidden"
          w="45px">
          <Image
            data-id="030925-072156"
            aspectRatio="1 / 1"
            fallback={
              <Flex data-id="030925-c89b82" align="center" h="full">
                <BlankPage data-id="030925-e606e3" h="20px" w="45px" />
              </Flex>
            }
            h="auto"
            maxH="55px"
            maxW="55px"
            src={documentDetails?.thumbnail}
            w="auto" />
        </Flex>
        <Flex
          data-id="030925-9dd481"
          direction="column"
          fontSize="12px"
          grow={1}
          mx={2}
          overflow="hidden"
          textOverflow="ellipsis">
          <Text
            data-id="030925-397c30"
            fontWeight="700"
            noOfLines={1}
            textOverflow="ellipsis">
            {document?.name}
          </Text>
          <Flex data-id="030925-047e4f" opacity="0.6">Uploaded {document && format(new Date(document.addedAt), 'Pp')}</Flex>
        </Flex>
        <HStack data-id="030925-2f288d" mr={[1, 3]} spacing={4}>
          {downloadable && <DownloadIcon
            data-id="030925-241f09"
            cursor='pointer'
            onClick={() => window.open(documentDetails?.path)}
            stroke="documentUploaded.downloadIcon" />}
          {removable && <Trashcan
            data-id="030925-2fe2a9"
            cursor='pointer'
            onClick={openDeleteModal}
            stroke="documentUploaded.binIcon" />}
        </HStack>
      </Flex>
    </>
  );
}

export default DocumentUploaded;

export const documentUploadedStyles = {
  documentUploaded: {
    bg: '#F2F2F2',
    thumbnailBg: '#EDF2F7',
    downloadIcon: '#282F36',
    binIcon: 'black',
    border: '#BBBBBB',
  },
};
