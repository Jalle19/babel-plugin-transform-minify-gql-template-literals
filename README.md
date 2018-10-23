# babel-plugin-transform-minify-gql-template-literals

[![Build Status](https://travis-ci.org/Jalle19/babel-plugin-transform-minify-gql-template-literals.svg?branch=master)](https://travis-ci.org/Jalle19/babel-plugin-transform-minify-gql-template-literals)

A Babel transform plugin that minifies `gql` template literals

## Rationale

When you use `graphql-tag` in a project there are basically two ways to deal with GraphQL queries:

* Defining them inline using the `gql` template literal
* Defining them in separate files and using the accompanied Babel loader to load queries

If you use the `gql` template literal, you can optionally have Babel pre-compile the queries into AST. This increases runtime performance at the cost of larger bundle sizes and longer build times. However, if you don't want to pre-compile your queries (maybe you have a lot of them and the bundle size increase is not worth the performance gains), you've basically been out of luck.

What this plugin does is it minifies the contents of your `gql` template literals so your bundle size can be kept as small as possible.

### How it works

The plugin works on the raw string content only. Some other implementations have resorted to using graphql-js to parse the query, which in my opinion is just overcomplicating things.

The work on this plugin was inspired by the talk from Ivan Goncharov at GraphQL Finland 2018. The talk is available at https://www.youtube.com/watch?v=AeEFjFHehnM.

## Usage

1. Add the project as a dependency:

```bash
yarn add --dev babel-plugin-transform-minify-gql-template-literals
```

2. Configure Babel to use the plugin:

```json
...
"plugins": [
  "babel-plugin-transform-minify-gql-template-literals",
  ...
]
---
```

Make sure to include the plugin as early in your plugin chain as possible, otherwise Babel may transpile away your `gql` template literals before this plugin gets a chance to minify them.

## Example

The following query:

```graphql
query GetArticles($first:Int!) {
  contents(types:[Article],first:$first) {
    edges {
      node {
        type
        # We'll only need the title
        ... on Article {
          title
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
```

Will be converted into:

```graphql
query GetArticles($first:Int!){contents(types:[Article]first:$first){edges{node{type ... on Article{title}... PublishDate}}}} fragment PublishDate on PublishableInterface{publishedAt}
```

This saves 197 B from the query size, a reduction of about 50 percent.

## Contributing

1. Fork the repository
2. Make your changes, make sure they work by running `yarn test`
3. Make a pull request

## License

MIT
