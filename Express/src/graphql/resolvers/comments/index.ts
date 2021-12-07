import comments from './comments.q';
import createComment from './createComment.m';
import deleteComment from './deleteComment.m';

const commnetsResolvers = {
  Query: {
    comments
  },
  Mutation: {
    createComment,
    deleteComment
  },
};

export const commnentsTypeDefs = `
  type Comment {
    _id: ID!
    responseId: String!
    text: String!
    metatags: Metatags
    author: Author
  }

  type Author {
    _id: String!
    firstName: String
    lastName: String
    displayName: String!
    email: String!
    jobTitle: String
    imgUrl: String
    role: String!
    defaultPage: String!
  }

  input CommentInput {
    responseId: ID!
    text: String!
    author: AuthorInput!
  }

  input AuthorInput {
    _id: String!
    firstName: String
    lastName: String
    displayName: String!
    email: String!
    jobTitle: String
    imgUrl: String
    role: String!
    defaultPage: String!
  } 
`;

export const commentsQueryDefs = `
  comments(_id:String!): [Comment!]!
`;

export const commentsMutationDefs = `
  createComment(commentInput: CommentInput!): Comment
  deleteComment(_id: String!): Boolean!
`;

export default commnetsResolvers;
