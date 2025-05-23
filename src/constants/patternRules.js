/**
 * Règles de patterns pour la classification automatique des documents
 * Chaque catégorie contient une liste de mots-clés associés
 */

export const patternRules = {
    // Projets numériques
    robotique: [
        "robot",
        "mbot",
        "thymio",
        "programmation robotique",
        "robots éducatifs",
        "arduino",
        "lego mindstorms",
        "robotique pédagogique",
        "atelier robotique",
    ],

    RGPD: [
        "données",
        "consentement",
        "CNIL",
        "protection des données",
        "confidentialité",
        "données personnelles",
        "droit à l'oubli",
        "traitement des données",
        "obligations RGPD",
    ],

    programmation: [
        "scratch",
        "python",
        "algorithme",
        "code",
        "coding",
        "codage",
        "programmation par blocs",
        "heure de code",
        "semaine du code",
        "coding goûter",
    ],

    tablettes: [
        "tablette",
        "ipad",
        "android",
        "applications mobiles",
        "usages pédagogiques tablettes",
        "classe mobile",
        "mobilité numérique",
        "applications éducatives",
    ],

    formation: [
        "formation",
        "atelier",
        "webinaire",
        "présentiel",
        "animation pédagogique",
        "parcours m@gistère",
        "formation continue",
        "conférence",
        "intervenant",
    ],

    TBI: [
        "tbi",
        "tni",
        "tableau interactif",
        "tableau numérique",
        "écran interactif",
        "activités TBI",
        "logiciels TBI",
        "ressources TBI",
        "promethean",
        "smart board",
    ],

    ENT: [
        "ent",
        "environnement numérique",
        "espace numérique",
        "one",
        "eclat bfc",
        "messagerie",
        "cahier de texte numérique",
        "espace collaboratif",
    ],

    logiciels: [
        "logiciel",
        "application",
        "software",
        "suite bureautique",
        "traitement de texte",
        "libre office",
        "microsoft office",
        "outils numériques",
    ],

    ressources: [
        "ressources",
        "tutoriel",
        "guide",
        "manuel",
        "documentation",
        "supports pédagogiques",
        "fiches",
        "séquences",
        "progression",
    ],

    pédagogie: [
        "pédagogie",
        "didactique",
        "enseignement",
        "apprentissage",
        "séquence",
        "séance",
        "projet",
        "compétences",
        "évaluation",
        "différenciation",
    ],

    // Niveaux scolaires
    maternelle: [
        "maternelle",
        "cycle 1",
        "ps",
        "ms",
        "gs",
        "petite section",
        "moyenne section",
        "grande section",
        "école maternelle",
    ],

    elementaire: [
        "élémentaire",
        "primaire",
        "cycle 2",
        "cycle 3",
        "cp",
        "ce1",
        "ce2",
        "cm1",
        "cm2",
        "école élémentaire",
        "école primaire",
    ],

    college: [
        "collège",
        "6ème",
        "5ème",
        "4ème",
        "3ème",
        "sixième",
        "cinquième",
        "quatrième",
        "troisième",
        "brevet",
        "dnb",
    ],

    // Éducation spécialisée
    inclusionScolaire: [
        "inclusion",
        "handicap",
        "adaptation",
        "différenciation",
        "accessibilité",
        "ULIS",
        "SEGPA",
        "RASED",
        "PAP",
        "PPS",
        "PPRE",
        "dyslexie",
        "dyspraxie",
        "dyscalculie",
    ],

    // Disciplines
    francais: [
        "français",
        "lecture",
        "écriture",
        "grammaire",
        "orthographe",
        "vocabulaire",
        "littérature",
        "production d'écrit",
        "compréhension",
        "fluence",
    ],

    mathematiques: [
        "mathématiques",
        "maths",
        "nombres",
        "calcul",
        "géométrie",
        "problèmes",
        "numération",
        "opérations",
        "mesures",
        "grandeurs",
    ],

    sciencesTechno: [
        "sciences",
        "technologie",
        "expériences",
        "démarche scientifique",
        "physique",
        "chimie",
        "svt",
        "biologie",
        "développement durable",
        "environnement",
    ],

    languesVivantes: [
        "anglais",
        "allemand",
        "espagnol",
        "italien",
        "langue vivante",
        "lve",
        "langues étrangères",
        "bilangue",
        "linguistique",
    ],

    histoireGeo: [
        "histoire",
        "géographie",
        "emc",
        "civique",
        "citoyenneté",
        "temps",
        "espace",
        "chronologie",
        "cartes",
        "repères temporels",
    ],

    artsMusique: [
        "arts",
        "musique",
        "éducation musicale",
        "chant",
        "histoire des arts",
        "arts plastiques",
        "visuel",
        "artistique",
        "œuvres",
    ],

    eps: [
        "eps",
        "sport",
        "éducation physique",
        "motricité",
        "activités physiques",
        "natation",
        "gymnastique",
        "jeux collectifs",
        "athlétisme",
    ],
};

export default patternRules;
