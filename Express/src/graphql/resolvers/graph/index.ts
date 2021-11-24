import filesDetails from './filesDetails.q';

const graphResolvers = {
  Query: {
    filesDetails
  },
};

export const graphTypeDefs = `
  type FileDetails {
    id: String!
    thumbnail: String
    path: String
  }

  input FilesDetailsQuery {
    ids: [String!]!
  }
`;

export const graphQueryDefs = `
  filesDetails(filesDetailsQuery: FilesDetailsQuery): [FileDetails!]!
`;

export default graphResolvers;
