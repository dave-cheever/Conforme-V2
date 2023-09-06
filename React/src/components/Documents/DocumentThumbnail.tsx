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

  return (<Flex
      align="center"
      borderColor="documentUploaded.border"
      borderRadius="3px"
      borderWidth={1}
      data-id="56368189657d"
      flexShrink={0}
      fontSize="12px"
      h="55px"
      justify="center"
      overflow="hidden"
      w="55px">
      <Image
        data-id="d3a03c92f2fa"
        fallback={
          <Flex align="center" data-id="38362c90f6d3" h="full">
            <BlankPage data-id="21e809d23383" h="30px" w="55px" />
          </Flex>
        }
        h="auto"
        maxH="55px"
        maxW="55px"
        src={documentDetails?.thumbnail}
        w="auto" />
    </Flex>);
}

export default DocumentThumbnail;
