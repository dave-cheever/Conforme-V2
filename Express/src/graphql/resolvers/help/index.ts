import help from './help.q';

const helpResolvers = {
  Query: {
    help,
  },
};

export const helpTypeDefs = `
  type Help {
    _id: ID!
    module: String!
    content: String!
    terms: String!
    privacy: String!
  }
`;

export const helpQueryDefs = `
    help: [Help]
`;

export default helpResolvers;
