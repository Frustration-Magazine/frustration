type PaperItem = {
  id: string;
  title: string;
  description?: string;
  image: any;
  link: string;
  type: "magazine" | "book";
  price?: string;
};

// Images d'exemple - vous devrez remplacer par de vraies images
// Pour l'instant, nous utilisons des images placeholder
// Vous pouvez importer de vraies images comme ceci :
// import magazine1 from "./images/magazine-1.jpg";
// import book1 from "./images/book-1.jpg";

// Placeholder temporaire - remplacez par de vraies images
const placeholderMagazine =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk1hZ2F6aW5lPC90ZXh0Pjwvc3ZnPg==";
const placeholderBook =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWZmNmZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzMzMzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxpdnJlPC90ZXh0Pjwvc3ZnPg==";

export const papers: PaperItem[] = [
  {
    id: "1",
    title: "Frustration #1",
    description: "Le premier numéro de Frustration Magazine, une exploration critique de la société contemporaine.",
    image: placeholderMagazine,
    link: "https://example.com/magazine-1",
    type: "magazine",
    price: "12€",
  },
  {
    id: "2",
    title: "Frustration #2",
    description: "Deuxième numéro avec des analyses approfondies sur les enjeux politiques actuels.",
    image: placeholderMagazine,
    link: "https://example.com/magazine-2",
    type: "magazine",
    price: "12€",
  },
  {
    id: "3",
    title: "Saint Luigi - Nicolas Framont",
    description: "Un roman critique sur la société moderne et ses contradictions.",
    image: placeholderBook,
    link: "https://example.com/saint-luigi",
    type: "book",
    price: "18€",
  },
  {
    id: "4",
    title: "Frustration #3",
    description: "Troisième numéro avec des contributions exclusives d'auteurs engagés.",
    image: placeholderMagazine,
    link: "https://example.com/magazine-3",
    type: "magazine",
    price: "12€",
  },
  {
    id: "5",
    title: "Collection LLL x Frustration",
    description: "Une collaboration exclusive entre LLL et Frustration Magazine.",
    image: placeholderBook,
    link: "https://example.com/lll-frustration",
    type: "book",
    price: "25€",
  },
  {
    id: "6",
    title: "Frustration #4",
    description: "Quatrième numéro avec des analyses sur l'économie et la politique.",
    image: placeholderMagazine,
    link: "https://example.com/magazine-4",
    type: "magazine",
    price: "12€",
  },
];
