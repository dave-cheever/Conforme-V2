// jscodeshift can take a parser, like "babel", "babylon", "flow", "ts", or "tsx"
// Read more: https://github.com/facebook/jscodeshift#parser
import { v4 as uuidv4 } from 'uuid';

export const parser = 'tsx';

// Function to generate date-based ID with random characters
function generateDateBasedId() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2); // Last 2 digits of year

  // Generate 6 random characters
  const randomChars = uuidv4().slice(-6);

  return `${day}${month}${year}-${randomChars}`;
}

export default function transformer(file, api) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(j.JSXIdentifier)
    .forEach((path) => {
      if (path.parentPath.node.attributes) {
        // Remove existing data-id if it exists
        const filteredAttributes = path.parentPath.node.attributes.filter((attr) => attr.name?.name !== 'data-id');

        // Add new data-id with date format
        path.parentPath.node.attributes = [
          j.jsxAttribute(j.jsxIdentifier('data-id'), j.stringLiteral(generateDateBasedId())),
          ...filteredAttributes,
        ];
      }
    })
    .toSource();
}
