// 🗿 Models
import { type YoutubeResourceType } from "data-access/youtube";

// Card resources
interface MediaCard {
  title: string;
  type: YoutubeResourceType;
  key: string;
  texts: {
    subtitle: string;
    dialogTitle: string;
    dialogDescription: string;
    placeholder: string;
    add: {
      tooltip: string;
      alertDialogTitle: string;
      alertDialogAction: string;
    };
    remove: {
      tooltip: string;
      alertDialogTitle: string;
      alertDialogAction: string;
    };
  };
}

export const MEDIA_TYPES_DESCRIPTION: MediaCard[] = [
  // Channels
  {
    title: "Chaînes",
    type: "channel",
    key: "channels",
    texts: {
      subtitle: "Les vidéos de ces chaînes YouTube seront ajoutées aux vidéos à la une",
      dialogTitle: "Rechercher une chaîne",
      dialogDescription: "Rechercher une chaîne YouTube en entrant un nom",
      placeholder: "Nom de la chaîne",
      add: {
        tooltip: "Ajouter cette chaîne",
        alertDialogTitle: "Voulez-vous vraiment ajouter cette chaîne ?",
        alertDialogAction: "Ajouter",
      },
      remove: {
        tooltip: "Supprimer cette chaîne",
        alertDialogTitle:
          "Voulez-vous vraiment supprimer l'affichage des vidéos de cette chaîne de votre page d'accueil ?",
        alertDialogAction: "Supprimer",
      },
    },
  },
  // Playlists
  {
    title: "Playlists",
    type: "playlist",
    key: "playlists",
    texts: {
      subtitle: "Les vidéos de ces playlists YouTube seront ajoutées aux vidéos à la une",
      dialogTitle: "Rechercher une playlist",
      dialogDescription: "Rechercher une playlist YouTube en entrant un nom ou l'URL d'une vidéo de cette playlist",
      placeholder: "Nom de la playlist ou URL d'une vidéo de la playlist",
      add: {
        tooltip: "Ajouter cette playlist",
        alertDialogTitle: "Voulez-vous vraiment ajouter cette playlist ?",
        alertDialogAction: "Ajouter",
      },
      remove: {
        tooltip: "Supprimer cette playlist",
        alertDialogTitle:
          "Voulez-vous vraiment supprimer l'affichage des vidéos de cette playlist de votre page d'accueil ?",
        alertDialogAction: "Supprimer",
      },
    },
  },
  // Videos
  {
    title: "Vidéos",
    type: "video",
    key: "videos",
    texts: {
      subtitle: "Ces vidéos seront ajoutées aux vidéos à la une",
      dialogTitle: "Rechercher une vidéo",
      dialogDescription: "Rechercher une vidéo YouTube en entrant un nom ou son URL",
      placeholder: "Nom ou URL de la vidéo",
      add: {
        tooltip: "Ajouter cette vidéo",
        alertDialogTitle: "Voulez-vous vraiment ajouter cette vidéo ?",
        alertDialogAction: "Ajouter",
      },
      remove: {
        tooltip: "Supprimer cette vidéo",
        alertDialogTitle: "Voulez-vous vraiment supprimer l'affichage de cette vidéo de votre page d'accueil ?",
        alertDialogAction: "Supprimer",
      },
    },
  },
];

// 🌍 i18n
export const typesTranslations = new Map([
  ["channel", "chaîne"],
  ["playlist", "playlist"],
  ["video", "vidéo"],
]);
