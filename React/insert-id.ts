// jscodeshift can take a parser, like "babel", "babylon", "flow", "ts", or "tsx"
// Read more: https://github.com/facebook/jscodeshift#parser
import { v4 as uuidv4 } from 'uuid';

export const parser = 'tsx';

export default function transformer(file, api) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(j.JSXIdentifier)
    .forEach((path) => {
      if (
        path.parentPath.node.attributes &&
        !path.parentPath.node.attributes.map(attr => attr.name?.name).includes('data-id')
      ) {
        path.parentPath.node.attributes = [
          j.jsxAttribute(j.jsxIdentifier('data-id'), j.stringLiteral(uuidv4().slice(-12))),
          ...path.parentPath.node.attributes,
        ];
      }
    })
    .toSource();
};
