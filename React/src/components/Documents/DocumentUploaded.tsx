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

  return (<>
    <DocumentDeleteModal
      data-id="51616ded175a"
      handleClose={handleDeleteModalClose}
      handleDelete={remove}
      isOpen={isDeleteModalOpen}
      message={deleteModalMessage || `Are you sure you wish to delete ${document?.name}?`} />
    <Flex
      align="center"
      bg="documentUploaded.bg"
      borderRadius="10px"
      color="brand.darkGrey"
      data-id="692ac974b86e"
      fontWeight="400"
      justify="space-between"
      key={document?.id}
      p={2}
      role="group"
      w="full">
      <Flex
        align="center"
        bg="documentUploaded.thumbnailBg"
        borderColor="documentUploaded.border"
        borderRadius="3px"
        borderWidth="1px"
        data-id="4c6c99e69c2b"
        flexShrink={0}
        fontSize="12px"
        h="55px"
        justify="center"
        overflow="hidden"
        w="55px">
        <Image
          aspectRatio="1 / 1"
          data-id="68397871f312"
          fallback={
            <Flex align="center" data-id="962981fdb686" h="full">
              <BlankPage data-id="b83c5c6a42d6" h="30px" w="55px" />
            </Flex>
          }
          h="auto"
          maxH="55px"
          maxW="55px"
          src={documentDetails?.thumbnail}
          w="auto" />
      </Flex>
      <Flex
        data-id="e8e644a590bc"
        direction="column"
        fontSize="12px"
        grow={1}
        mx={2}
        overflow="hidden"
        textOverflow="ellipsis">
        <Text
          data-id="5a562db5396e"
          fontWeight="700"
          noOfLines={1}
          textOverflow="ellipsis">
          {document?.name}
        </Text>
        <Flex data-id="63dfffcf17f1" opacity="0.6">Uploaded {document && format(new Date(document.addedAt), 'Pp')}</Flex>
      </Flex>
      <HStack data-id="5d23f6ba0144" mr={[1, 3]} spacing={4}>
        {downloadable && <DownloadIcon
          cursor='pointer'
          data-id="e5de5299a4a6"
          onClick={() => window.open(documentDetails?.path)}
          stroke="documentUploaded.downloadIcon" />}
        {removable && <Trashcan
          cursor='pointer'
          data-id="f605712a0088"
          onClick={openDeleteModal}
          stroke="documentUploaded.binIcon" />}
      </HStack>
    </Flex>
  </>);
}

export default DocumentUploaded;

export const documentUploadedStyles = {
  documentUploaded: {
    bg: '#F2F2F2',
    thumbnailBg: '#FFFFFF',
    downloadIcon: '#282F36',
    binIcon: 'black',
    border: '#BBBBBB',
  },
};
