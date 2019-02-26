module.exports = ({ types: t }) => {
  const minifyValue = (value) => {
    let minified = value;

    // Start by stripping commas and comments
    minified = minified.replace(/,/g, '');
    minified = minified.replace(/#(.*)/g, '');

    // Convert all whitespace to spaces
    minified = minified.replace(/[\s]+/g, ' ');

    // Strip spaces around {, }, :, [, ], and ...
    minified = minified.replace(/\s*([{}:\[\]]|\.\.\.)\s*/g, '$1');

    // Trim the resulting string
    minified = minified.trim();

    return minified;
  };

  const minifyTemplateElement = (key, templateElement) => {
    if (templateElement.value[key]) {
      templateElement.value[key] = minifyValue(templateElement.value[key]);
    }
  };

  return {
    visitor: {
      TaggedTemplateExpression: (path) => {
        const node = path.node;

        // Only operate on gql template literals
        if (t.isIdentifier(node.tag, { name: 'gql' })) {
          for (let templateElement of node.quasi.quasis) {
            minifyTemplateElement('raw', templateElement);
            minifyTemplateElement('cooked', templateElement);
          }
        }
      }
    }
  };
};
