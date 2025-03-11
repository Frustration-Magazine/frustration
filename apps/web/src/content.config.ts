import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const authors = defineCollection({
  loader: glob({ base: "./src/content/authors", pattern: "*.json" }),
  schema: ({ image }) =>
    z.object({
      id: z.number(),
      name: z.string(),
      nickname: z.string().optional(),
      email: z.string().email().optional(),
      role: z.string().optional().optional(),
      picture: image(),
      punchline: z.string().optional(),
      themes: z.array(z.string()).optional(),
      public: z.boolean().optional(),
      slug: z.string().optional(),
    }),
});

export const collections = {
  authors,
};
