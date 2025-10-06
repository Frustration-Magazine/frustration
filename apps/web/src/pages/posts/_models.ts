export type Post = {
  readonly title: string;
  readonly excerpt: string;
  readonly slug: string;
  readonly date: string;
  readonly author: {
    readonly node: {
      readonly name: string;
    };
  };
  readonly categories: {
    readonly nodes: {
      readonly name: string;
      readonly slug: string;
    }[];
  };
  readonly featuredImage: {
    readonly node: {
      readonly title: string;
      readonly altText: string;
      readonly caption: string;
      readonly sourceUrl: string;
      readonly mediaDetails: {
        readonly width: number;
        readonly height: number;
      };
      readonly mimeType: string;
    };
  };
};
