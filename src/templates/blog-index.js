import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"

const BlogIndex = ({ data, location, pageContext }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <SEO title="All posts" />
        <Bio />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }
  console.log(pageContext)
  const { humanPageNumber, previousPagePath, numberOfPages, nextPagePath } = pageContext
  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" />
      <Bio />
      <ol style={{ listStyle: `none` }}>
        {posts.map(post => {
          const title = post.frontmatter.title || post.fields.slug

          return (
            <li key={post.fields.slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                    <Link to={post.fields.slug} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </h2>
                  <small>{post.frontmatter.date}</small>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.frontmatter.description || post.excerpt,
                    }}
                    itemProp="description"
                  />
                </section>
              </article>
            </li>
          )
        })}
      </ol>
      <div>
        {previousPagePath && <Link to={previousPagePath}>&lt;</Link>}
        {humanPageNumber > 2 && <Link key={`pagination-number1`} to={`/blog`} activeStyle={{ color: "red" }}>1</Link>}
        {humanPageNumber > 3 && <span>...</span>}
        {Array.from({ length: numberOfPages }, (_, i) => {
          const p = i + 1
          if (p < (humanPageNumber + 2) && p > (humanPageNumber - 2)) {
            return (
              <Link key={`pagination-number${p}`} to={`/blog${i === 0 ? "" : `/${p}`}`} activeStyle={{ color: "red" }}>
                {p}
              </Link>
            )
          }
        })}
        {humanPageNumber <= (numberOfPages - 3) && <span>...</span>}
        {humanPageNumber <= (numberOfPages - 2) && <Link key={`pagination-number${numberOfPages}`} to={`/blog/${numberOfPages}`} activeStyle={{ color: "red" }}>{numberOfPages}</Link>}
        {nextPagePath && <Link to={nextPagePath}>&gt;</Link>}
      </div>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query ($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      skip: $skip
      limit: $limit
    ) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
        }
      }
    }
  }
`
