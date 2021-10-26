import { GraphQLScalarType, Kind } from 'graphql';
import { isValid, parseISO } from 'date-fns';

const anyScalar = new GraphQLScalarType({
  name: 'Any',
  description: 'Any type',
  serialize(value) {
    return value;
  },
  parseValue(value) {
    return value;
  },
});

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value) {
    return value;
    // return value.getTime(); // Convert outgoing Date to integer for JSON
  },
  parseValue(value) {
    return value;
    // return new Date(value); // Convert incoming integer to Date
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
    } else if (ast.kind === Kind.STRING && isValid(parseISO(ast.value))) {
      return new Date(ast.value); // Convert ISOString to Date
    }
    return null; // Invalid hard-coded value (not an integer)
  },
});

const objectScalar = new GraphQLScalarType({
  name: 'Object',
  description: 'Object type',
  serialize(value) {
    return value;
  },
  parseValue(value) {
    return value;
  },
});

export default {
  anyScalar,
  dateScalar,
  objectScalar,
};
