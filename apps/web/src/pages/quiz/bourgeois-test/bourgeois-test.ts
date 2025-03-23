import RevenusImage from "./_assets/_revenus.webp";
import VieSocialeImage from "./_assets/_vie_sociale.webp";
import HierarchieSocialeImage from "./_assets/_hierarchie_sociale.webp";
import ScolariteImage from "./_assets/_scolarite.webp";
import PolitiqueImage from "./_assets/_politique.webp";
import ImmobilierImage from "./_assets/_immobilier.webp";
import LoisirsImage from "./_assets/_loisirs.webp";
import FinancierImage from "./_assets/_financier.webp";

export const QUESTIONS = [
  // Revenus
  {
    title: "Votre revenu mensuel",
    srTitle: "Revenues mensuels",
    name: "revenus-mensuels",
    image: RevenusImage,
    description: `
    Pour répondre à cette question, il faut estimer son revenu personnel, même quand on est en couple et en famille et avoir en tête <a
        class="underline text-blue"
        href="https://www.capital.fr/votre-carriere/on-connait-le-salaire-moyen-dans-le-prive-etes-vous-riche-ou-pauvre-1336109#:~:text=1.789%20euros.,mois%20et%2050%25%20gagnent%20plus."
        >que le salaire net médian en France est de 1789€ par mois</a
      >. La moitié des Français gagnent moins, la moitié plus.
    `,
    options: [
      {
        description: "Je gagne entre 400 et 1100 euros mensuels net",
        value: "400-1000",
        points: 0,
      },
      {
        description: "Je gagne entre 1100 et 2000 euros mensuels net",
        value: "1100-2000",
        points: 0,
      },
      {
        description: "Je gagne entre 2000 et 3000 euros mensuels net",
        value: "2000-3000",
        points: 2,
      },
      {
        description: "Je gagne entre 3000 et 10 000 euros mensuels net",
        value: "3000-10000",
        points: 4,
      },
      {
        description:
          "Je gagne plusieurs dizaines voire plusieurs centaines de milliers d’euros, je ne saurais pas vous répondre à l’euro près, c’est grave ?",
        value: "plus-10000",
        points: 7,
      },
    ],
  },
  // Vie sociale
  {
    title: "Votre vie sociale",
    srTitle: "Vie sociale",
    name: "vie-sociale",
    image: VieSocialeImage,
    description: `
    Dans ce pays qui précarise sa classe laborieuse, les ouvrières et ouvriers souffrent davantage de solitude que les cadres. <a class="underline text-blue" href="https://web.archive.org/web/20240720032340/https://www.inegalites.fr/Inegaux-face-a-la-solitude">18 % des ouvriers se sentent souvent seuls</a>, soit trois fois plus que pour les cadres supérieurs.
    `,
    options: [
      {
        description: "J'ai surtout une vie de famille",
        value: "vie-famille",
        points: 0,
      },
      {
        description:
          "Mon agenda est très chargé, veuillez vous adresser à mon assistante",
        value: "agenda-charge",
        points: 7,
      },
      {
        description:
          " Je suis surtout proche de mes amis d’enfance et mes collègues, on se reçoit chez les uns et chez les autres de temps en temps",
        value: "amis-enfance",
        points: 0,
      },
      {
        description:
          "J’ai pas mal d’amis, différentes sphères, et on fait différents trucs ensemble, comme des restaus, des cinés, des expos…",
        value: "amis-differents",
        points: 2,
      },
      {
        description:
          "Entre les soirées organisées par des confrères ou des collaborateurs, les dîners du Rotary ou du Lion’s et les soirées chez le fils du maire ou le maire lui-même, je n’arrête pas",
        value: "sociabilite-bourgeoise",
        points: 4,
      },
    ],
  },
  // Hiérarchie sociale
  {
    title: "Votre place dans la hiérarchie sociale",
    srTitle: "Hiérarchie sociale",
    name: "hierarchie-sociale",
    image: HierarchieSocialeImage,
    description: `
    A la télé,  <a class="underline text-blue" href="https://web.archive.org/web/20240720032340/https://www.csa.fr/content/download/16666/310416/version/3/file/barometre_diversite_vague_1_20_oct_09.pdf">70% des personnes qu'on nous montre sont cadres et professions intellectuelles supérieures</a>. Dans la réalité, plus de la moitié d'entre nous sont ouvrières ou employés. On est loin de <i>Plus Belle la Vie</i>.
    `,
    options: [
      {
        description: "Je suis haut fonctionnaire",
        value: "haut-fonctionnaire",
        points: 7,
      },
      {
        description: "Je suis chef d'entreprise, j'ai moins de 11 salariés",
        value: "chef-entreprise-moins-11",
        points: 4,
      },
      {
        description: "Je suis chef d'entreprise, j'ai plus de 11 salariés",
        value: "chef-entreprise-plus-11",
        points: 7,
      },
      {
        description: "Je suis fonctionnaire",
        value: "fonctionnaire",
        points: 0,
      },
      {
        description: "Je suis salarié.e non-cadre",
        value: "non-cadre",
        points: 0,
      },
      {
        description: "Je suis au chômage",
        value: "chomage",
        points: 0,
      },
      {
        description: "Je suis cadre dirigeant.e",
        value: "cadre-dirigeant",
        points: 7,
      },
      {
        description: "Je suis cadre moyen",
        value: "cadre-moyen",
        points: 4,
      },
      {
        description: "Je suis auto-entrepreneuse/auto-entrepreneur",
        value: "autoentrepreneur",
        points: 0,
      },
      {
        description: "Je suis profession libérale",
        value: "liberal",
        points: 7,
      },
    ],
  },
  // Vos opinions politiques
  {
    title: "Vos opinions politiques",
    srTitle: "Opinions politiques",
    name: "politique",
    image: PolitiqueImage,
    description: `
    Les idéaux politiques ne suffisent pas à se classer socialement, mais sont très révélateurs. <a class="underline text-blue" href="https://web.archive.org/web/20240720032340/https://www.lexpress.fr/actualite/politique/lrem/legislatives-les-electeurs-d-en-marche-sont-ils-vraiment-tous-des-cadres_1916848.html">Les électeurs LREM sont majoritairement des cadres</a>, ça alors ! Les ouvriers s'abstiennent <a class="underline text-blue" href="https://web.archive.org/web/20240720032340/https://fr.statista.com/statistiques/717028/abstentionnistes-deuxieme-tour-legislatives-selon-csp-france/">nettement plus que les cadres</a>, seuls 27% des personnes sondées ont confiance dans le gouvernement en 2020 et 69% pensent que "l'économie actuelle profite aux patrons aux dépens de ceux qui travaillent" <a class="underline text-blue" href="https://web.archive.org/web/20240720032340/https://www.sciencespo.fr/cevipof/sites/sciencespo.fr.cevipof/files/OpinionWay%20pour%20le%20CEVIPOF-Barome%CC%80tre%20de%20la%20confiance%20en%20politique%20-%20vague11%20-%20Comparaison-1.pdf">selon le baromètre du CEVIPOF</a>.
    `,
    options: [
      {
        description:
          "Je ne m'intéresse pas à la politique. Je pense que la plupart des politiques s'intéressent à autre chose que mes intérêts. Je m'abstiens le plus souvent",
        value: "abstention",
        points: 0,
      },
      {
        description:
          "Je me sens de gauche mais je n'arrive plus trop à m'y retrouver, difficile de faire le tri dans ce qu'on nous propose",
        value: "gauche-perdu",
        points: 0,
      },
      {
        description:
          "Je me sens profondément de gauche : pour l'intérêt général et la République, je ne rate pas une seule élection !",
        value: "gauche-republicaine",
        points: 2,
      },
      {
        description:
          " Je me sens surtout européen : je suis inquiet de la montée des populismes et je crois en une démocratie responsable et transparente",
        value: "europeiste",
        points: 5,
      },
      {
        description:
          "Je pense qu'il faut secouer ce pays : les Français sont des râleurs, mais il y a des réformes nécessaires à faire si on veut s'en sortir",
        value: "populiste-droite",
        points: 3,
      },
      {
        description:
          "Je suis écologiste : il faut réduire la place de la voiture dans nos vies et se sortir des habitudes quotidiennes qui détruisent la planète",
        value: "ecolo",
        points: 3,
      },
      {
        description:
          "Je pense que le pays va à la dérive, il est temps de fermer les frontières et d'arrêter de se mentir sur l'islam",
        value: "islamophobe",
        points: 3,
      },
      {
        description:
          "Je pense qu'il faut que ça pète. Il faut tout reprendre à zéro !",
        value: "revolutionnaire",
        points: 0,
      },
    ],
  },
  // Scolarité
  {
    title: "Votre scolarité",
    srTitle: "Scolarité",
    name: "scolarite",
    image: ScolariteImage,
    description: `
    En France, <a class="underline text-blue" href="https://web.archive.org/web/20240720032340/https://www.inegalites.fr/niveau-de-diplome-de-la-population">18% de la population a un diplôme supérieur à bac+2</a>. L'éducation reste un énorme marqueur de classe. "l'ascenseur social" est globalement une fable : 75% des enfants de cadres sont diplômés du supérieur, <a class="underline text-blue" href="https://web.archive.org/web/20240720032340/http://classes.blogs.liberation.fr/2014/10/29/pour-reussir-mieux-vaut-etre-enfants-de-cadres-que-douvriers/">contre 22% des enfants d’ouvriers</a>. La bourgeoisie monopolise des grandes écoles qui viennent ensuite légitimer le pouvoir de ses enfants sur nos vies : <a class="underline text-blue" href="https://web.archive.org/web/20240720032340/https://www.inegalites.fr/Des-classes-preparatoires-et-des-grandes-ecoles-toujours-aussi-fermees">L’ENA accueille ainsi 4,4 % de fils d’ouvriers et d’employés </a>(deux catégories qui représentent plus de la moitié de la population).
    `,
    options: [
      {
        description: 'Vous avez un diplôme dit "professionnalisant" (BEP, CAP)',
        value: "bep-cap",
        points: 0,
      },
      {
        description: "Vous avez un diplôme médico-social",
        value: "medico-social",
        points: 0,
      },
      {
        description: "Vous avez un diplôme bac+2 ou bac+3",
        value: "bac-2-3",
        points: 2,
      },
      {
        description:
          "Vous avez un diplôme bac+5 obtenu à l'université publique",
        value: "bac-5-universite",
        points: 4,
      },
      {
        description:
          "Vous avez un diplôme bac+5 obtenu dans une grande école ou une école de commerce",
        value: "bac-5-commerce",
        points: 6,
      },
      {
        description: "Vous n'avez pas de diplôme.",
        value: "pas-diplome",
        points: 0,
      },
      {
        description: "Vous avez le bac",
        value: "bac",
        points: 0,
      },
    ],
  },
  // Patrimoine immobilier
  {
    title: "Votre patrimoine immobilier",
    srTitle: "Patrimoine immobilier",
    name: "immobilier",
    image: ImmobilierImage,
    description: `
    Si 58% des Français sont propriétaires de leur domicile, seuls 13% ont une résidence secondaire, <a class="underline text-blue" href="https://web.archive.org/web/20231128095645/https://www.vousfinancer.com/credit-immobilier/actualites/les-rn-sidences-secondaires-font-elles-encore-rn-ver-les-frann-ais-#:~:text=Les%20r%C3%A9sidences%20secondaires%20repr%C3%A9sentent%2010,8%25%20de%20logements%20vacants).&text=Il%20s'agit%20d'un,observ%C3%A9%20pour%20les%20r%C3%A9sidences%20principales.">héritée dans 26% des cas</a>.
    `,
    options: [
      {
        description: "Je suis locataire",
        value: "locataire",
        points: 0,
      },
      {
        description:
          "Je suis locataire mais je possède une petite résidence secondaire",
        value: "locataire-residence-secondaire",
        points: 2,
      },
      {
        description: "Je suis propriétaire de mon logement",
        value: "proprietaire",
        points: 1,
      },
      {
        description:
          "Je suis propriétaire de mon logement et j’ai une charmante résidence secondaire en Normandie (ou ailleurs)",
        value: "proprietaire-normandie",
        points: 4,
      },
      {
        description:
          "Je suis propriétaire de mon logement, j’ai une charmante résidence secondaire et je loue plusieurs appartements dans une métropole",
        value: "proprietaire-rentier",
        points: 7,
      },
      {
        description:
          "Je suis locataire mais mes parents sont multi-propriétaires, de leur logement comme d'une ou plusieurs résidences secondaires : j'a-dore leur maison dans le Perche !",
        value: "locataire-rentier",
        points: 4,
      },
    ],
  },
  // Loisirs
  {
    title: "Vos loisirs",
    srTitle: "Loisirs",
    name: "loisirs",
    image: LoisirsImage,
    description: `
    Les loisirs sont socialement situés. Saviez-vous que <a class="underline text-blue" href="https://web.archive.org/web/20231128095645/https://www.inegalites.fr/Les-sports-d-hiver-une-pratique-de-privilegies?id_theme=19">seuls 8% des Français partaient au ski au moins une année sur deux ?</a> Et non, ce ne sont pas les plus doués mais les plus riches...
    `,
    options: [
      {
        description:
          "La télévision et internet surtout, et je ne fais pas grand-chose quand j’ai des vacances : je jardine, je bricole ou j’invite des amis, quand j’ai le temps",
        value: "television",
        points: 0,
      },
      {
        description:
          "En semaine la télévision/internet, quelques sorties en famille et entre amis le week-end, les vacances dans la famille ou quelque part en France, de temps en temps à l’étranger. Je fais du sport quand je peux et je cuisine",
        value: "television-plus",
        points: 2,
      },
      {
        description:
          "Je sors pas mal le week-end, j’ai ou j’ai eu une pratique artistique régulière, je pratique la méditation en pleine conscience, je vais au ski en février au moins une fois tous les deux ans, régulièrement on part quelque part en Europe et surtout, j’essaie une fois par an de découvrir un coin du monde, loin des sentiers battus",
        value: "artiste",
        points: 4,
      },
      {
        description:
          "Je m’intéresse à l’art, j’ai quelques belles pièces chez moi, mais j’ai avant tout une passion pour le tennis, la voile, certains arts martiaux… Je voyage beaucoup, en France pour le ski mais surtout dans le monde, j’ai d’ailleurs un fond pour le développement des puits dans un pays d’Afrique et je fais des donations au centre Pompidou pour l’art contemporain",
        value: "collectionneur",
        points: 6,
      },
      {
        description:
          "Je suis un.e geek : rideau tirés, tablette de Milka Oreo à portée de main,",
        value: "geek",
        points: 0,
      },
    ],
  },
  // Croyances personnelles
  {
    title: "Vos croyances personnelles",
    srTitle: "Croyances",
    name: "croyances",
    image: PolitiqueImage,
    description: `
    <i>“Les pensées dominantes ne sont pas autre chose que l'expression idéale des rapports matériels dominants, elles sont ces rapports matériels dominants saisis sous forme d'idées, donc l'expression des rapports qui font d'une classe la classe dominante; autrement dit, ce sont les idées de sa domination.”</i> <br/> <b>Karl Marx, <i>L'Idéologie Allemande</i>, 1848</b>
    `,
    options: [
      {
        description:
          "“Carpe diem”, il faut vivre l’instant présent car on ne sait pas de quoi demain sera fait",
        value: "carpe-diem",
        points: 0,
      },
      {
        description: "La liberté des uns s'arrête où commence celle des autres",
        value: "liberte",
        points: 0,
      },
      {
        description:
          "Quand on veut on peut ! Le travail paie, il faut se bouger",
        value: "liberal",
        points: 3,
      },
      {
        description:
          "Pour une vie pleine de projets et de voyages, contre le petit confort de la routine",
        value: "projets",
        points: 3,
      },
      {
        description:
          "Il y a ceux qui créent des choses et ceux qui ne sont rien",
        value: "macroniste",
        points: 4,
      },
      {
        description:
          "C'est l'hymne de nos campagnes, de nos rivières, de nos montagne, de la vie man, du monde animal",
        value: "babos",
        points: 1,
      },
      {
        description: "Chacun chez soi et les moutons seront bien gardés",
        value: "chacun-chez-soi",
        points: 2,
      },
      {
        description: "Le travail rend libre",
        value: "travail-liberte",
        points: 5,
      },
      {
        description: "Ni dieu ni maître ni croyances personnelles",
        value: "anarchiste",
        points: 0,
      },
    ],
  },
  // Votre patrimoine financier
  {
    title: "Votre patrimoine financier",
    srTitle: "Patrimoine financier",
    name: "patrimoine-financier",
    image: FinancierImage,
    description: `
    Nous ne sommes pas un pays de petits actionnaires nombreux. <a href="https://web.archive.org/web/20231128095645/https://www.insee.fr/fr/statistiques/4265758" class="underline text-blue">Les 10% les plus aisés possèdent à eux seuls la moitié du patrimoine national</a>.
    `,
    options: [
      {
        description:
          "Je consomme tous mes revenus entre le début et la fin du mois",
        value: "fauche",
        points: 0,
      },
      {
        description: "J’ai de l’épargne, un livret A, PEL, ou autre",
        value: "epargne",
        points: 2,
      },
      {
        description:
          "Je possède quelques milliers d’euros d’action, je suis le genre de personne qui écoute les cours de la Bourse à la radio",
        value: "actionnaire",
        points: 4,
      },
      {
        description:
          "J’ai un patrimoine financier conséquent, de mon fait ou par héritage",
        value: "rentier",
        points: 7,
      },
      {
        description: "Je vis comme un hobo mais mes parents sont super riches",
        value: "hobo",
        points: 3,
      },
    ],
  },
];

export const BAREMES = [
  {
    seuil: 20,
    description: "Vous êtes un bourgeois intégral",
  },
  {
    seuil: 15,
    description: "Vous êtes un sous-bourgeois",
  },
  {
    seuil: 10,
    description: "Vous faites partie de la classe laborieuse supérieure",
  },
  {
    seuil: 0,
    description: "Vous faites partie de la classe laborieuse inférieure",
  },
];
