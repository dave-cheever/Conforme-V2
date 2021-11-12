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
  }

  input CommentInput {
    responseId: ID!
    text: String!
  }
`;

export const commentsQueryDefs = `
  comments: [Comment!]!
`;

export const commentsMutationDefs = `
  createComment(commentInput: CommentInput!): Comment
  deleteComment(_id: String!): Boolean!
`;

export default commnetsResolvers;
