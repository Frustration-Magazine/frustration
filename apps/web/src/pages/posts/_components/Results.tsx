import { Button } from "@/components/ui/button";
import { JSON_HEADERS } from "@/constants";
import { cn, formatVideoTitle } from "@/lib/utils";
import { getSearchPostsQuery } from "@/lib/wordpress";
import { ArrowRight, TagIcon } from "lucide-react";
import { useState } from "react";

type Post = {
  readonly title: string;
  readonly excerpt: string;
  readonly slug: string;
  readonly categories: {
    readonly nodes: {
      readonly name: string;
      readonly slug: string;
    }[];
  };
  readonly featuredImage: {
    readonly node: {
      readonly title: string;
      readonly sourceUrl: string;
      readonly altText: string;
    };
  };
};

type ResultsProps = {
  readonly term: string;
  readonly categorySlug: string | null;
  readonly author: string | null;
  readonly initialPosts: any;
  readonly initialPageInfo: any;
};

const { PUBLIC_WORDPRESS_GRAPHQL_API } = import.meta.env;

const NoResults = (
  <p className="flex justify-center gap-2 text-center text-xl">
    <span>🕵️‍♂️</span>
    <span>Aucun article ne correspond à votre recherche...</span>
  </p>
);

const Title = ({ children: title }: { readonly children: string }) => (
  <h3 className={cn("font-bakbak leading-none! font-bold", "text-2xl", "md:text-3xl")}>{title}</h3>
);

const Excerpt = ({ children: excerpt }: { children: string }) => <p dangerouslySetInnerHTML={{ __html: excerpt }}></p>;

const Read = () => (
  <Button className="font-bakbak ml-auto mt-auto flex items-center gap-1 rounded-none text-lg uppercase">
    <span>Lire</span>
    <ArrowRight />
  </Button>
);

function Results({ term, categorySlug, author, initialPosts, initialPageInfo }: ResultsProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);

  if (!posts || !pageInfo) return null;
  if (posts.length === 0) return NoResults;

  const handleMoreArticles = async () => {
    setLoadingPosts(true);
    const query = getSearchPostsQuery({
      term,
      categorySlug,
      author,
      after: pageInfo?.endCursor,
    });

    try {
      const res = await fetch(PUBLIC_WORDPRESS_GRAPHQL_API, {
        method: "POST",
        headers: JSON_HEADERS,
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
      {posts.map(({ title, excerpt, slug, featuredImage, categories }: Post) => (
        <a
          href={`/${slug}`}
          key={slug}
          className="w-full space-y-4 border p-4 shadow-md md:p-6"
        >
          <Title>{formatVideoTitle(title)}</Title>
          <div className="flex flex-col gap-4 md:flex-row md:gap-6">
            {featuredImage && (
              <img
                className="h-[200px] w-full object-cover md:h-auto md:w-[300px]"
                src={featuredImage?.node?.sourceUrl}
                alt={featuredImage?.node?.altText}
              />
            )}
            <div className="flex flex-col gap-4">
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0">
                {categories.nodes.map(({ name, slug }) => (
                  <div
                    key={slug}
                    className="flex items-center [&>svg]:mr-1.5 [&>svg]:w-[13px]"
                  >
                    <TagIcon />
                    <span>{name}</span>
                  </div>
                ))}
              </div>
              <Excerpt>{excerpt}</Excerpt>
              <Read />
            </div>
          </div>
        </a>
      ))}

      {pageInfo.hasNextPage ? (
        <Button
          className={cn(
            "text-primary hover:text-primary font-bebas mt-12 box-content bg-black px-5 py-2 text-2xl hover:bg-black",
            "md:px-6 md:py-3 md:text-3xl",
          )}
          onClick={handleMoreArticles}
          type="button"
        >
          {loadingPosts
            ? "Chargement..."
            : `Voir plus ${categorySlug && categorySlug === "videos" ? "de vidéos" : "d'articles"}`}
        </Button>
      ) : null}
    </div>
  );
}

export default Results;
