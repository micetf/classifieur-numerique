import { useState } from "react";
import { patternRules } from "../constants/patternRules";
import { rgpdKeywords } from "../constants/rgpdKeywords";
import { crcnDomains } from "../constants/crcnDomains";

/**
 * Hook personnalisé pour la classification de documents
 */
export const useClassifier = () => {
    const [classifications, setClassifications] = useState([]);

    /**
     * Calcule un score de confiance pour un pattern trouvé
     */
    function calculateConfidence(content, pattern) {
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
        const score =
            occurrences * 30 + positionScore * 0.4 + lengthScore * 0.3;
        return Math.min(100, score);
    }

    /**
     * Génère une explication pédagogique pour la classification
     */
    function generateExplanation(pattern, category, crcnDomain) {
        let explanation = `Le classement est suggéré car le document mentionne "${pattern}"`;

        if (category) {
            explanation += ` qui est associé à la catégorie "${category}"`;
        }

        if (crcnDomain) {
            explanation += ` (CRCN Domaine ${crcnDomain.id}: ${crcnDomain.name})`;
        }

        return explanation;
    }

    /**
     * Trouve les domaines CRCN associés à un pattern
     */
    function findCRCNDomain(pattern) {
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
    }

    /**
     * Trouve les chemins dans l'arborescence correspondant à une catégorie
     */
    function findPathsInArborescence(arborescence, category) {
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
    }

    /**
     * Analyse un contenu et retourne les chemins de classification suggérés
     */
    function classifyContent(content, arborescence) {
        if (!content || !arborescence) {
            return {
                suggestions: [],
                allMatches: [],
                originalContent: content || "",
            };
        }

        const contentLower = content.toLowerCase();
        const matches = [];

        // Parcourir les règles de pattern pour trouver des correspondances
        Object.entries(patternRules).forEach(([category, patterns]) => {
            patterns.forEach((pattern) => {
                if (contentLower.includes(pattern.toLowerCase())) {
                    // Trouver les chemins correspondants dans l'arborescence
                    const paths = findPathsInArborescence(
                        arborescence,
                        category
                    );

                    // Pour chaque chemin trouvé, ajouter une correspondance
                    paths.forEach((path) => {
                        // Déterminer les domaines CRCN concernés
                        const crcnDomain = findCRCNDomain(pattern);

                        matches.push({
                            path,
                            pattern,
                            category,
                            confidence: calculateConfidence(
                                contentLower,
                                pattern
                            ),
                            explanation: generateExplanation(
                                pattern,
                                category,
                                crcnDomain
                            ),
                            crcnDomain,
                        });
                    });
                }
            });
        });

        // Trier par niveau de confiance
        matches.sort((a, b) => b.confidence - a.confidence);

        // Grouper par chemin pour éviter les doublons
        const uniquePaths = [];
        const result = matches.filter((match) => {
            if (!uniquePaths.includes(match.path)) {
                uniquePaths.push(match.path);
                return true;
            }
            return false;
        });

        setClassifications(result);

        return {
            suggestions: result.slice(0, 3), // Top 3 suggestions
            allMatches: result,
            originalContent: content,
        };
    }

    /**
     * Détecte les problèmes RGPD potentiels dans un contenu
     */
    function detectRgpdIssues(content) {
        if (!content) return [];

        const contentLower = content.toLowerCase();
        const detectedTerms = [];

        rgpdKeywords.forEach((keyword) => {
            if (contentLower.includes(keyword.toLowerCase())) {
                detectedTerms.push(keyword);
            }
        });

        return detectedTerms;
    }

    // Retourner les fonctions et l'état
    return {
        classifyContent,
        detectRgpdIssues,
        classifications,
    };
};

export default useClassifier;
