const babel = require('babel-core');
const plugin = require('../src/');

const whitespaceQuery = `
const query = gql\`
  query foo {
    field1
    field2
    field3
  }
\`
`;

const commaQuery = `
const query = gql\`
  query foo {
    field1(foo: "foo", bar: "bar", baz: "baz") {
      foo
      bar
      baz
    }
  }
\`
`;

const commentedQuery = `
const query = gql\`
  query foo {
    field1
    field2
    # A comment
    field3 # An inline comment after a field
  }
\`
`;

const kitchenSinkQuery = `
const query = gql\`
  query GetArticles($first: Int!) {
    contents(types: [Article], first: $first) {
      edges {
        node {
          type
          # We'll only need the title and the description
          ... on Article {
            title
            description
          }
          # And the publish date (let's use a separate fragment for that)
          ... PublishDate
        }
      }
    }
  }

  fragment PublishDate on PublishableInterface {
    publishedAt
  }
\`
`;

it('converts whitespace to spaces', () => {
  const { code } = babel.transform(whitespaceQuery, { plugins: [plugin] });
  expect(code).toMatchSnapshot();
});

it('strips commas', () => {
  const { code } = babel.transform(commaQuery, { plugins: [plugin] });
  expect(code).toMatchSnapshot();
});

it('strips comments', () => {
  const { code } = babel.transform(commentedQuery, { plugins: [plugin] });
  expect(code).toMatchSnapshot();
});

it('produces a working kitchen sink query', () => {
  const { code } = babel.transform(kitchenSinkQuery, { plugins: [plugin] });
  expect(code).toMatchSnapshot();
});
