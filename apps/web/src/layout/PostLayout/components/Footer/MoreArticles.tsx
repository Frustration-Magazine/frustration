import { useEffect, useState } from "react";
import { fetchLinkPreview } from "@/lib/wordpress";
import { cn } from "@/lib/utils";
import LogoSquare from "../../assets/logo_square.png";

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

/* ================== */
/* |||||||||||||||||| */
/* ================== */

function MoreArticles() {
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
        {linkPreviews.map((linkPreview: any) => (
          <li key={linkPreview.slug}>
            <a
              href={`/${linkPreview.slug}`}
              className={cn(
                "flex rounded-md border shadow-md",
                "flex-col items-center gap-4 p-4",
                "sm:flex-row sm:items-start sm:gap-6 sm:p-6",
              )}
            >
              <img
                src={LogoSquare.src}
                alt="Logo Square"
                className={cn("h-12 w-12")}
              />
              <div>
                <h5 className={cn("font-bakbak leading-none! font-bold", "mb-2 text-xl", "sm:mb-2 sm:text-2xl")}>
                  {linkPreview.title}
                </h5>
                <div
                  className={cn("text-sm", "xs:text-base")}
                  dangerouslySetInnerHTML={{ __html: linkPreview.excerpt }}
                />
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MoreArticles;
