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
        data-id="000488"
        align="center"
        borderColor="documentUploaded.border"
        borderRadius="3px"
        borderWidth={1}
        flexShrink={0}
        fontSize="12px"
        h="55px"
        justify="center"
        overflow="hidden"
        w="55px">
      <Image
        data-id="000489"
        fallback={
          <Flex data-id="000490" align="center" h="full">
            <BlankPage data-id="000491" h="30px" w="55px" />
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
