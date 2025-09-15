import { gql, useQuery } from '@apollo/client';
import { Flex, Image } from '@chakra-ui/react';

import { BlankPage } from '../../icons';
import { IDocument } from '../../interfaces/IResponse';

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

function DocumentThumbnail({ document }: { document: IDocument | undefined }) {
  const { data } = useQuery(GET_DOCUMENT_DETAILS, {
    variables: { filesDetailsQuery: { ids: [document?.id] } },
  });
  const documentDetails = (data?.filesDetails || [])[0];

  return (
    <Flex
        align="center"
        borderColor="documentUploaded.border"
        borderRadius="3px"
        borderWidth={1}
        data-id="030925-dadfe8"
        flexShrink={0}
        fontSize="12px"
        h="55px"
        justify="center"
        overflow="hidden"
        w="55px">
      <Image
        data-id="030925-026b49"
        fallback={
          <Flex align="center" data-id="030925-ad51e1" h="full">
            <BlankPage data-id="030925-1e4262" h="30px" w="55px" />
          </Flex>
        }
        h="auto"
        maxH="55px"
        maxW="55px"
        src={documentDetails?.thumbnail}
        w="auto" />
    </Flex>
  );
}

export default DocumentThumbnail;
