# Gatsby Plugin Feed

A plugin for GatsbyJS to generate an RSS, Atom and JSON feeds.

## Why use this instead of the official one?

It generates more feeds than just plain RSS. It also attempts to follow a similar API to the official one to make it easier to transition.

Uses [Feed](https://github.com/jpmonette/feed) to generate the feeds.

API based on the original [gatsby-plugin-feed](https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-plugin-feed)

## Installation

`npm i @darth-knoppix/gatsby-plugin-feed`

or

`yarn add @darth-knoppix/gatsby-plugin-feed`

## How to Use

```js
// In your gatsby-config.js

module.exports = {
  plugins: [
    {
      resolve: `@darth-knoppix/gatsby-plugin-feed`,
      options: {
        // Site query, whatever you need for the setup function will be on `query`
        query: `
      {
        site {
          siteMetadata {
            title
            description
            siteUrl
            author {
              name
              link
              email
            }
          }
        }
      }
    `,
        setup: (options) => {
          const { siteUrl, author } = options.query.site.siteMetadata;
          const currentYear = new Date().getFullYear();

          return {
            ...options,
            title: "My Blog",
            link: siteUrl,
            description: "Feed for my blog",
            copyright: `All rights reserved ${currentYear}, ${author.name}`,
            updated: Date.now(),
            author: author,
            favicon: `${siteUrl}/favicon.ico`,
            feedLinks: {
              json: `${siteUrl}/feed.json`,
              atom: `${siteUrl}/atom.xml`,
              rss: `${siteUrl}/rss.xml`,
            },
            categories: ["Technology"],
          };
        },
        feeds: [
          {
            // serialize will receive the query below and the site query
            serialize: ({ query: { site, allMdx } }) => {
              return allMdx.edges.map((edge) => {
                const articleUrl =
                  site.siteMetadata.siteUrl + "/" + edge.node.frontmatter.slug;

                return {
                  title: edge.node.frontmatter.title,
                  date: edge.node.frontmatter.date_published,
                  published: edge.node.frontmatter.date_published,
                  id: articleUrl,
                  link: articleUrl,
                  description: edge.node.excerpt,
                  content: edge.node.html,
                  author: [site.siteMetadata.author],
                  image: edge.node.frontmatter.image,
                };
              });
            },
            query: `
          {
            allMdx(
              sort: { fields: [frontmatter___date_published], order: DESC }
              limit: 500
            ) {
              edges {
                node {
                  frontmatter {
                    title
                    slug
                    date_published
                    excerpt
                    image
                  }
                  html
                }
              }
            }
          }
        `,
            title: "My Blog Posts",
          },
        ],
      },
    },
  ],
};
```
