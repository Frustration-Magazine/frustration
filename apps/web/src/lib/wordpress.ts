import { JSON_HEADERS } from "@/constants";

async function fetchWordpress({ query, variables = {} }: any) {
  const PUBLIC_WORDPRESS_GRAPHQL_API = import.meta.env.PUBLIC_WORDPRESS_GRAPHQL_API;

  if (!PUBLIC_WORDPRESS_GRAPHQL_API) {
    console.error("Missing PUBLIC_WORDPRESS_GRAPHQL_API env variable");
    return;
  }
  const username = import.meta.env.WORDPRESS_APPLICATION_USERNAME;
  const password = import.meta.env.WORDPRESS_APPLICATION_PASSWORD;

  try {
    const headers = {
      ...JSON_HEADERS,
      ...(username && password ? { Authorization: "Basic " + btoa(`${username}:${password}`) } : null),
    };

    const res = await fetch(PUBLIC_WORDPRESS_GRAPHQL_API, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch wordpress API");
    }

    const json = await res.json();
    if (json.errors) throw new Error("Failed to parse wordpress API response");
    return json;
  } catch (e) {
    console.error(e);
  }
}

export async function fetchPostBySlug({ slug }: any) {
  const query = `
   query fetchPostBySlug {
        post(id: "${slug}", idType: SLUG) {
          title(format: RENDERED)
          slug
          date
          author { node { name userId slug description avatar { url } } }
          categories { nodes { slug name parent { node { name } } } }
          content(format: RENDERED)
          featuredImage {
            node {
              title(format: RENDERED)
              altText
              caption
              sourceUrl
              mediaDetails { height width }
              mimeType
            }
          }
        }
    }`;

  let {
    data: { post },
  } = await fetchWordpress({ query });
  return post;
}

export async function fetchDraftByPostId({ post_id, wp_session }: any) {
  const query = `
   query fetchDraftByPostId {
        post(id: "${post_id}", idType: DATABASE_ID) {
          title(format: RENDERED)
          author { node { name userId slug avatar { url } } }
          categories { nodes { slug name parent { node { name } } } }
          content(format: RENDERED)
          featuredImage {
            node {
              title(format: RENDERED)
              altText
              sourceUrl
              mediaDetails { height width }
              mimeType
            }
          }
        }
    }`;
  let {
    data: { post },
  } = await fetchWordpress({ query, wp_session });
  return post;
}

export async function fetchLastPosts({ first = 6 }: any) {
  const query = `
   query fetchLastPosts {
        posts(first: ${first}) {
          nodes {
            title(format: RENDERED)
            slug
            date
            author { node { name userId avatar { url } } }
            categories { nodes { slug name parent { node { name } } } }
            excerpt(format: RENDERED)
            featuredImage {
              node {
                title(format: RENDERED)
                altText
                sourceUrl
              }
            }
          }
        }
    }`;

  let {
    data: {
      posts: { nodes: posts },
    },
  } = await fetchWordpress({ query });

  return posts;
}

export async function fetchRSSItems({ first = 6 }: any) {
  const query = `
   query fetchLastPosts {
        posts(first: ${first}) {
          nodes {
            title(format: RENDERED)
            slug
            date
            content(format: RENDERED)
            author { node { name } }
            categories { nodes { name } }
            excerpt(format: RENDERED)
          }
        }
    }`;

  let {
    data: {
      posts: { nodes: posts },
    },
  } = await fetchWordpress({ query });

  return posts;
}

export async function fetchAuthorsByIds({ ids }: { ids: string[] }) {
  const query = `
   query fetchAuthorsByIds {
        users(where: { include: [${ids.join(",")}] }) {
          nodes {
            databaseId
            name
            slug
            description
            avatar {
              url
            }
          }
        }
    }`;

  let {
    data: {
      users: { nodes: authors },
    },
  } = await fetchWordpress({ query });

  return authors;
}

export async function fetchInterviews({ first = 6 }: any) {
  const query = `
   query fetchInterviews {
        posts(where: {categoryName: "Entretien"}, first: ${first}) {
          nodes {
            title(format: RENDERED)
            link
            slug
            categories {
              nodes {
                name
              }
            }
            featuredImage {
              node {
                title
                altText
                sourceUrl
              }
            }
          }
        }
    }
  `;

  let {
    data: {
      posts: { nodes: interviews },
    },
  } = await fetchWordpress({ query });

  interviews = interviews.map(({ title, link, slug, categories, featuredImage: { node: image } }: any) => ({
    title,
    link,
    slug,
    image,
    categories,
  }));

  return interviews;
}

export function getSearchPostsQuery({ term, categorySlug, author, after }: any) {
  return `
    query fetchSearchPosts {
        ${
          categorySlug
            ? `category(id: "${categorySlug}", idType: SLUG) {
            name
        }`
            : ""
        }
        posts(
          first: 6
          ${after ? `after: "${after}"` : ""}
          where: { search: "${term}", ${categorySlug ? `categoryName:"${categorySlug}",` : ""} ${author ? `authorName:"${author}",` : ""} orderby: { field: DATE, order: DESC } }
        ) {
          nodes {
            title(format: RENDERED)
            slug
            date
            categories {
              nodes {
                name
                id
                parent {
                  node {
                    name
                  }
                }
              }
            }
            featuredImage {
              node {
                title(format: RENDERED)
                altText
                sourceUrl
              }
            }
            excerpt(format: RENDERED)
            author {
              node {
                name
              }
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
  `;
}

export async function fetchSearchPosts({ term, categorySlug, author, after }: any) {
  const query = getSearchPostsQuery({ term, categorySlug, author, after });

  let {
    data: {
      posts: { nodes: posts, pageInfo },
      category,
    },
  } = await fetchWordpress({ query });

  const categoryName = category?.name || null;

  return { posts, pageInfo, categoryName };
}

export async function fetchLinkPreview(link: string) {
  const query = `
   query fetchLinkPreview {
      post(id: "${link}", idType: URI) {
        title(format: RENDERED)
        slug
        categories {
          nodes {
            name
          }
        }
        author {
          node {
            name
          }
        }
        excerpt
      }
    }
  `;

  let {
    data: { post },
  } = await fetchWordpress({ query });

  return post;
}

export async function fetchCategories() {
  const query = `
    query fetchCategories {
      categories(first: 30) {
        nodes {
          slug
          name
          parent {
            node {
              name
              slug
            }
          }
          children {
            nodes {
              name
              slug
            }
          }
          count
        }
      }
    }
  `;

  let {
    data: {
      categories: { nodes: categories },
    },
  } = await fetchWordpress({ query });

  return categories;
}
