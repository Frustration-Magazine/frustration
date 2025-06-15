export async function fetchAuthors() {

    let allAuthors: any[] = [];
    let hasNext = null;
    let cursor = "";
  
    const query = `
      query fetchAuthors {
        users(first: 50, after: "${cursor}") {
          edges {
            node {
              email
              name
              userId
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `
    do {
      let { data: { users: { edges: authors, pageInfo: { hasNextPage, endCursor } } } } = await fetchWordpress({ query });
      allAuthors = [...allAuthors, ...authors.map(({ node: { name, email, userId } }: any) => ({ name, email, id: String(userId) }))];
      hasNext = hasNextPage;
      cursor = endCursor;
    } while(hasNext)
  
    return allAuthors;
  }
  

/* ========================================================= */
/* ========================================================= */

async function fetchWordpress({ query, variables = {} }: any) {
    const PUBLIC_WORDPRESS_GRAPHQL_API = process.env.PUBLIC_WORDPRESS_GRAPHQL_API;
  
    if (!PUBLIC_WORDPRESS_GRAPHQL_API) {
      console.error("Missing PUBLIC_WORDPRESS_GRAPHQL_API env variable");
      return;
    }
    const username = process.env.WORDPRESS_APPLICATION_USERNAME;
    const password = process.env.WORDPRESS_APPLICATION_PASSWORD;
  
    try {
      const headers = {
        "Content-Type": "application/json",
        ...(username && password
          ? { Authorization: "Basic " + btoa(`${username}:${password}`) }
          : null),
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
  