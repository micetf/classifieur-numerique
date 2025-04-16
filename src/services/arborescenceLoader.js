/**
 * Service pour charger et gérer les arborescences depuis GitHub
 */

// URLs des arborescences (à configurer selon votre repository)
const ARBORESCENCE_URLS = {
    cpc: "https://raw.githubusercontent.com/eRUN07N/arborescence/refs/heads/main/arborescence-cpc.json",
    perso: "https://raw.githubusercontent.com/micetf/arborescences/main/arborescence-perso.json",
};

// Arborescences par défaut en cas d'échec de chargement
const DEFAULT_ARBORESCENCES = {
    cpc: {
        "00_Ressources-pedagogiques-numeriques": {
            ApplicationsEducatives: {
                Robotique: {
                    Tutoriels: {},
                    Séquences: {},
                    Projets: {},
                },
                Programmation: {
                    Scratch: {},
                    Python: {},
                },
            },
            OutilsNumeriques: {
                ENT: {},
                Tablettes: {},
                TBI: {},
            },
        },
        "00_Projets-numeriques": {
            Experimentations: {
                KitRobotiqueCM: {
                    StRomainLerps: {},
                    Mauves: {},
                },
                ClassesMobiles: {},
            },
            FormationEnseignants: {
                Webinaires: {},
                Présentiel: {},
            },
        },
    },
    perso: {
        "01_Ressources": {
            Tutoriels: {},
            Modèles: {},
            Références: {},
        },
        "02_Projets": {
            EnCours: {},
            Terminés: {},
            Idées: {},
        },
    },
};

// Cache des arborescences déjà chargées
let arborescenceCache = {};

/**
 * Charge une arborescence depuis GitHub
 * @param {string} type - Type d'arborescence ('cpc' ou 'perso')
 * @returns {Promise<object>} Arborescence chargée
 */
export const loadArborescenceFromGitHub = async (type) => {
    // Si elle est déjà en cache, la retourner
    if (arborescenceCache[type]) {
        return arborescenceCache[type];
    }

    try {
        // Récupérer l'URL correspondante
        const url = ARBORESCENCE_URLS[type];
        if (!url) {
            throw new Error(`Type d'arborescence inconnu: ${type}`);
        }

        // Charger l'arborescence depuis GitHub
        const response = await fetch(url);

        // Vérifier si la requête a réussi
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        // Parser le JSON
        const arborescence = await response.json();

        // Mettre en cache
        arborescenceCache[type] = arborescence;

        return arborescence;
    } catch (error) {
        console.error(
            `Erreur lors du chargement de l'arborescence ${type}:`,
            error
        );

        // En cas d'erreur, utiliser l'arborescence par défaut
        return DEFAULT_ARBORESCENCES[type];
    }
};

/**
 * Convertit une arborescence plate (format MD) en structure hiérarchique
 * @param {string} markdownContent - Contenu Markdown de l'arborescence
 * @returns {object} Arborescence au format hiérarchique
 */
export const convertMarkdownToHierarchy = (markdownContent) => {
    if (!markdownContent) return {};

    const lines = markdownContent.split("\n").filter((line) => line.trim());
    const hierarchy = {};

    lines.forEach((line) => {
        // Compter le nombre d'espaces ou de tabulations pour déterminer le niveau
        const indentation = line.search(/\S|$/);
        const level = Math.floor(indentation / 2);
        const name = line.trim();

        // Ajouter au bon niveau dans la hiérarchie
        let current = hierarchy;
        for (let i = 0; i < level; i++) {
            const lastKey = Object.keys(current).pop();
            if (lastKey) {
                current = current[lastKey];
            }
        }

        current[name] = {};
    });

    return hierarchy;
};

/**
 * Convertit une arborescence hiérarchique en liste de chemins plats
 * @param {object} hierarchy - Arborescence au format hiérarchique
 * @returns {array} Liste des chemins complets
 */
export const hierarchyToPaths = (hierarchy) => {
    const paths = [];

    const traverse = (node, currentPath = "") => {
        if (!node || typeof node !== "object") return;

        Object.keys(node).forEach((key) => {
            const newPath = currentPath ? `${currentPath}/${key}` : key;
            paths.push(newPath);
            traverse(node[key], newPath);
        });
    };

    traverse(hierarchy);
    return paths;
};

export default {
    loadArborescenceFromGitHub,
    convertMarkdownToHierarchy,
    hierarchyToPaths,
    DEFAULT_ARBORESCENCES,
};
