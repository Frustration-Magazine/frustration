"use client";

import { useState, useEffect } from "react";
import { YoutubeResourceType, getYoutubeResourceId } from "data-access/youtube";

import {
  fetchSuggestions,
  createMediaRecord,
  deleteMediaRecord,
  readMediaByType,
  refreshMediasInDatabase,
} from "../_actions";

import { isEnvironmentProduction } from "@/lib/utils";

export const useMedia = ({ type }: { type: YoutubeResourceType }) => {
  /* Suggestions */
  const [suggestions, setSuggestions] = useState<any>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(false);

  /* Medias */
  const [medias, setMedias] = useState<any>([]);
  const [loadingMedias, setLoadingMedias] = useState(true);

  useEffect(() => {
    (async function () {
      const medias = await readMediaByType(type);
      setMedias(medias);
      setLoadingMedias(false);
    })();
  }, []);

  // 📀 Add media
  const handleAddMedia = async ({ type, id }: { type: YoutubeResourceType; id: string }) => {
    console.log("handleAddMedia", { type, id });
    const status = await createMediaRecord({ type, id });
    // ✅ Resource created !
    if (status.success) {
      // 1️⃣ Add saved suggestion to listed resources
      let suggestionToAdd = suggestions.find((suggestion: any) => getYoutubeResourceId(suggestion) === id);

      suggestionToAdd = {
        id: suggestionToAdd.id,
        type,
        thumbnail: suggestionToAdd.snippet.thumbnails.default.url,
        title: suggestionToAdd.snippet.title,
        description: suggestionToAdd.snippet.description,
      };

      setMedias((medias: any[]) => [suggestionToAdd, ...medias]);

      // During development mode we fetch directly new medias information instead of redeploying the app
      if (!isEnvironmentProduction) await refreshMediasInDatabase();

      // 2️⃣ Remove suggestion from current suggestions list
      setSuggestions(suggestions.filter((suggestion: any) => getYoutubeResourceId(suggestion) !== id));
    }
  };

  // 📀 Remove media
  const handleDeleteMedia = async ({ id }: { id: string }) => {
    const status = await deleteMediaRecord({ type, id });

    // ✅ Resource created !
    if (status.success) {
      // During development mode we fetch directly new medias information instead of redeploying the app
      if (!isEnvironmentProduction) await refreshMediasInDatabase();

      // 1️⃣ Remove deleted resource from listed resources
      setMedias(medias.filter((media: any) => media.id !== id));
    }
  };

  // 🐝 Fetch suggestions
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const search = formData.get("search");

    // ⏳ Loading...
    setLoadingSuggestions(true);

    const DEFAULT_SUGGESTIONS_COUNT = 5;
    let newSuggestions = [];
    let newToken = null;

    // 🐝 🔁 Fetch youtube suggestions by type
    do {
      let { suggestions, token } = await fetchSuggestions({
        q: search,
        relevanceLanguage: "fr",
        type,
        ...(newToken ? { pageToken: newToken } : null),
      });

      const tempSuggestions = suggestions.filter(
        (suggestion: any) => !medias.find((media: any) => media.id === getYoutubeResourceId(suggestion)),
      );

      newSuggestions.push(...tempSuggestions);
      newToken = token;
    } while (newSuggestions.length < DEFAULT_SUGGESTIONS_COUNT && newToken);

    newSuggestions = newSuggestions.slice(0, DEFAULT_SUGGESTIONS_COUNT);

    // ⌛ End loading...
    setLoadingSuggestions(false);

    // 📦
    setSuggestions(newSuggestions);
  };

  return {
    suggestions,
    loadingSuggestions,
    medias,
    loadingMedias,
    handleAddMedia,
    handleDeleteMedia,
    handleSearch,
  };
};
