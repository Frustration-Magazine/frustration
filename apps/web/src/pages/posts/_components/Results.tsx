import { useState } from "react";
import { cn } from "@/libs/tailwind";
import { Button } from "@/components/ui/button";
import { CgArrowTopRight } from "react-icons/cg";

type Props = {
  readonly term: string;
  readonly category: string | null;
  readonly author: string | null;
  readonly initialPosts: any;
  readonly initialPageInfo: any;
};

type Post = {
  readonly title: string;
  readonly excerpt: string;
  readonly slug: string;
};

const { PUBLIC_WORDPRESS_GRAPHQL_API } = import.meta.env;

const NoResults = (
  <p className="flex justify-center gap-2 text-center text-xl">
    <span>🕵️‍♂️</span>
    <span>Aucun article ne correspond à votre recherche...</span>
  </p>
);

const Title = ({ children: title }: { readonly children: string }) => (
  <h3
    className={cn(
      "font-bakbak leading-none! font-bold",
      "text-2xl",
      "md:text-3xl",
    )}>
    {title}
  </h3>
);

const Excerpt = ({ children: excerpt }: { children: string }) => (
  <p
    className="mt-4"
    dangerouslySetInnerHTML={{ __html: excerpt }}></p>
);

const Read = () => (
  <Button className="font-bakbak flex items-center gap-1 rounded-none text-lg uppercase">
    <span>Lire</span>
    <CgArrowTopRight size={20} />
  </Button>
);

/* =============== */
/* ||||||||||||||| */
/* =============== */

function Results({
  term,
  category,
  author,
  initialPosts,
  initialPageInfo,
}: Props) {
  const [posts, setPosts] = useState(initialPosts);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);

  if (!posts || !pageInfo) return null;
  if (posts.length === 0) return NoResults;

  const handleMoreArticles = async () => {
    setLoadingPosts(true);
    const query = `
     query fetchSearchPosts {
      posts(
        first: 6
        ${pageInfo?.endCursor ? `after: "${pageInfo.endCursor}"` : ""}
        where: { search: "${term}", ${category ? `categoryName: "${category}",` : ""} ${author ? `authorName:"${author}",` : ""} orderby: { field: DATE, order: DESC } }
      ) {
        nodes {
          title(format: RENDERED)
          slug
          excerpt(format: RENDERED)
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
    `;

    try {
      const res = await fetch(PUBLIC_WORDPRESS_GRAPHQL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const json = await res.json();
      if (json.errors) {
        throw new Error("Failed to fetch wordpress API");
      }

      if (json.data) {
        const data = json.data.posts;
        setPosts([...posts, ...data.nodes]);
        setPageInfo(data.pageInfo);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPosts(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {posts.map(({ title, excerpt, slug }: Post) => (
        <a
          href={`/${slug}`}
          key={slug}
          className="space-y-3 border p-6 shadow-md">
          <Title>{title}</Title>
          <Excerpt>{excerpt}</Excerpt>
          <Read />
        </a>
      ))}
      {pageInfo.hasNextPage ? (
        <Button
          className={cn(
            "text-frustration-yellow hover:text-frustration-yellow font-bebas mt-12 box-content bg-black px-5 py-2 text-2xl hover:bg-black",
            "md:px-6 md:py-3 md:text-3xl",
          )}
          onClick={handleMoreArticles}
          type="button">
          {loadingPosts ? "Chargement..." : "Voir plus d'articles"}
        </Button>
      ) : null}
    </div>
  );
}

export default Results;
