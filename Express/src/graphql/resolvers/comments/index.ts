import comments from './comments.q';
import createComment from './createComment.m';
import deleteComment from './deleteComment.m';

const commnetsResolvers = {
  Query: {
    comments,
  },
  Mutation: {
    createComment,
    deleteComment,
  },
};

export const commnentsTypeDefs = `
  type Comment {
    _id: ID!
    componentId: ID!
    text: String!
    metatags: Metatags
    authorId: ID!
  }

  input CommentInput {
    componentId: ID!
    text: String!
    scope: ScopeInput!
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
