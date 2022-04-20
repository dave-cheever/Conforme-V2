import { gql, useQuery } from '@apollo/client';
import { Box, Flex, Image } from '@chakra-ui/react';

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

const DocumentThumbnail = ({
  document,
}: {
  document: IDocument | undefined;
}) => {
  const { data } = useQuery(GET_DOCUMENT_DETAILS, {
    variables: { filesDetailsQuery: { ids: [document?.id] } },
  });
  const documentDetails = (data?.filesDetails || [])[0];

  return (
    <>
      <Box
        borderRadius="10px"
        flexShrink={0}
        fontSize="12px"
        h="55px"
        ml="5px"
        mr={2}
        w="55px"
      >
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
    </>
  );
};

export default DocumentThumbnail;
