module.exports = ({ types: t }) => {
  const minifyRaw = (raw) => {
    let minified = raw;

    // Start by stripping commas and comments
    minified = minified.replace(/,/g, '');
    minified = minified.replace(/#(.*)/g, '');

    // Converti all whitespace to spaces
    minified = minified.replace(/[\s]+/g, ' ');

    // Strip spaces around {, }, and ...
    minified = minified.replace(/\s*{\s*/g, '{');
    minified = minified.replace(/\s*}\s*/g, '}');
    minified = minified.replace(/\s*\.\.\.\s*/g, '...');

    // Trim the resulting string
    minified = minified.trim();

    return minified;
  };

  return {
    visitor: {
      TaggedTemplateExpression: (path) => {
        const node = path.node;

        // Only operate on gql template literals
        if (t.isIdentifier(node.tag, { name: "gql" })) {
          for (let element of node.quasi.quasis) {
            element.value.raw = minifyRaw(element.value.raw);
          }
        }
      }
    }
  }
};
