// src/hooks/classifier/utils.js
import { crcnDomains } from "../../constants/crcnDomains";

/**
 * Calcule un score de confiance pour un pattern trouvé
 * @param {string} content - Contenu du document
 * @param {string} pattern - Pattern à rechercher
 * @returns {number} Score de confiance (0-100)
 */
export const calculateConfidence = (content, pattern) => {
    // Fréquence d'apparition du pattern
    const regex = new RegExp(pattern.toLowerCase(), "g");
    const occurrences = (content.match(regex) || []).length;

    // Position dans le texte (début = plus important)
    const position = content.indexOf(pattern.toLowerCase());
    const positionScore =
        position === -1
            ? 0
            : Math.max(0, 100 - (position / content.length) * 100);

    // Longueur du pattern (plus long = plus spécifique)
    const lengthScore = Math.min(100, (pattern.length / 10) * 100);

    // Score final combiné
    const score = occurrences * 30 + positionScore * 0.4 + lengthScore * 0.3;
    return Math.min(100, Math.round(score));
};

/**
 * Génère une explication pédagogique pour la classification
 * @param {string} pattern - Pattern trouvé
 * @param {string} category - Catégorie associée
 * @param {object|null} crcnDomain - Domaine CRCN associé
 * @returns {string} Explication formatée
 */
export const generateExplanation = (pattern, category, crcnDomain) => {
    let explanation = `Le classement est suggéré car le document mentionne "${pattern}"`;

    if (category) {
        explanation += ` qui est associé à la catégorie "${category}"`;
    }

    if (crcnDomain) {
        explanation += ` (CRCN Domaine ${crcnDomain.id}: ${crcnDomain.name})`;
    }

    return explanation;
};

/**
 * Trouve les domaines CRCN associés à un pattern
 * @param {string} pattern - Pattern à analyser
 * @returns {object|null} Domaine CRCN associé ou null
 */
export const findCRCNDomain = (pattern) => {
    const patternLower = pattern.toLowerCase();

    // Rechercher dans les domaines CRCN
    for (const [domainId, domain] of Object.entries(crcnDomains)) {
        const found = domain.keywords.some((keyword) =>
            patternLower.includes(keyword.toLowerCase())
        );

        if (found) {
            return {
                id: domainId,
                name: domain.name,
            };
        }
    }

    return null;
};

/**
 * Trouve les chemins dans l'arborescence correspondant à une catégorie
 * @param {object} arborescence - Arborescence de dossiers
 * @param {string} category - Catégorie à rechercher
 * @returns {Array<string>} Chemins correspondants
 */
export const findPathsInArborescence = (arborescence, category) => {
    const paths = [];
    const categoryLower = category.toLowerCase();

    // Fonction récursive pour parcourir l'arborescence
    const traverseArborescence = (node, currentPath = "") => {
        if (!node) return;

        // Si c'est un objet avec des enfants
        if (typeof node === "object" && !Array.isArray(node)) {
            Object.entries(node).forEach(([key, value]) => {
                const newPath = currentPath ? `${currentPath}/${key}` : key;

                // Vérifier si la clé correspond à la catégorie
                if (key.toLowerCase().includes(categoryLower)) {
                    paths.push(newPath);
                }

                // Continuer à parcourir
                traverseArborescence(value, newPath);
            });
        }
    };

    traverseArborescence(arborescence);
    return paths;
};

/**
 * Extrait tous les chemins d'une arborescence
 * @param {object} arborescence - Arborescence de dossiers
 * @returns {Array<string>} Liste de tous les chemins
 */
export const getAllPaths = (arborescence) => {
    const paths = [];

    const traverseArborescence = (node, currentPath = "") => {
        if (!node) return;

        if (typeof node === "object" && !Array.isArray(node)) {
            Object.entries(node).forEach(([key, value]) => {
                const newPath = currentPath ? `${currentPath}/${key}` : key;
                paths.push(newPath);
                traverseArborescence(value, newPath);
            });
        }
    };

    traverseArborescence(arborescence);
    return paths;
};
