import { useEffect, useState } from "react";
import { fetchLinkPreview } from "@/lib/wordpress";
import { cn, formatVideoTitle } from "@/lib/utils";
import LogoSquare from "../../assets/logo_square.png";
import { TagIcon, UserIcon } from "lucide-react";

const EMBED_INTERNAL_LINK_SELECTOR = "figure.wp-block-embed:not(.is-type-video):has(.wp-block-embed__wrapper)";

const scanEmbedInternalLinks = () => {
  let nodeList = document.querySelectorAll(EMBED_INTERNAL_LINK_SELECTOR);
  return nodeList;
};

const mapToLinks = (embedArticles: any) =>
  Array.from(embedArticles)
    .map((node: any) => {
      const REGEX_HTTPS = /^https?:\/\/frustrationmagazine.fr/;
      const potentialLink = node && node.textContent && node.textContent.trim();
      if (!potentialLink || !REGEX_HTTPS.test(potentialLink)) return null;
      return potentialLink.replace(REGEX_HTTPS, "");
    })
    .filter((link) => typeof link === "string");

export const MoreArticles = () => {
  const [linkPreviews, setLinkPreviews] = useState<any>([]);

  useEffect(() => {
    const embedArticles = scanEmbedInternalLinks();
    const links = mapToLinks(embedArticles);

    // Fetch articles and ignore not found articles
    const linksPreviewPromises = links.map(fetchLinkPreview);
    Promise.allSettled(linksPreviewPromises).then((results) => {
      const successfulPreviews = results
        .filter((result) => result.status === "fulfilled" && result.value)
        .map((result) => (result as PromiseFulfilledResult<any>).value);

      setLinkPreviews(successfulPreviews);

      // Remove embed articles from the article content
      embedArticles.forEach((node) => {
        const isFrustrationLink = node && node.textContent && node.textContent.match("frustrationmagazine.fr");
        if (isFrustrationLink) node.remove();
      });
    });
  }, []);

  if (linkPreviews.length === 0) return null;

  return (
    <div>
      <h3
        className="font-bakbak -underline-offset-4 decoration-logo-yellow mb-6 text-4xl underline decoration-[10px]"
        style={{ textDecorationSkipInk: "none" }}
      >
        Plus d'articles
      </h3>
      <ul className="space-y-4">
        {linkPreviews.map(({ slug, title, categories, author, excerpt }: any) => (
          <li key={slug}>
            <a
              href={`/${slug}`}
              className={cn(
                "flex rounded-md border shadow-md",
                "flex-col items-center gap-4 p-4",
                "sm:flex-row sm:items-start sm:gap-6 sm:p-6",
              )}
            >
              {/* Logo */}
              <img
                src={LogoSquare.src}
                alt="Logo Square"
                className={cn("hidden h-12 w-12 sm:block")}
              />

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  {/* Logo */}
                  <img
                    src={LogoSquare.src}
                    alt="Logo Square"
                    className={cn("block h-8 w-8 sm:hidden")}
                  />

                  {/* Title */}
                  <h5 className={cn("font-bakbak leading-none! font-bold", "text-xl", "sm:text-2xl")}>
                    {formatVideoTitle(title)}
                  </h5>
                </div>

                <div className="flex flex-wrap justify-between">
                  {/* Author */}
                  <div className="flex items-center gap-2">
                    <UserIcon className="block w-4" />
                    <span>{author.node.name}</span>
                  </div>

                  {/* Categories */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0">
                    {categories.nodes.map((category: { name: string; slug: string }) => (
                      <div
                        key={category.slug}
                        className="flex items-center"
                      >
                        <TagIcon className="mr-1.5 w-3" />
                        <span>{category.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Excerpt */}
                <div
                  className={cn("text-sm text-gray-800", "xs:text-base")}
                  dangerouslySetInnerHTML={{ __html: excerpt }}
                />
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
