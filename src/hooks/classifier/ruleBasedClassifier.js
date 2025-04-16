// src/hooks/classifier/ruleBasedClassifier.js
import { patternRules } from "../../constants/patternRules";
import {
    calculateConfidence,
    generateExplanation,
    findCRCNDomain,
    findPathsInArborescence,
} from "./utils";

/**
 * Classification basée sur les règles prédéfinies
 * @param {string} content - Contenu à classifier
 * @param {object} arborescence - Arborescence dans laquelle classifier
 * @returns {object} Résultat de la classification
 */
export const classifyWithRules = (content, arborescence) => {
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
                const paths = findPathsInArborescence(arborescence, category);

                // Pour chaque chemin trouvé, ajouter une correspondance
                paths.forEach((path) => {
                    // Déterminer les domaines CRCN concernés
                    const crcnDomain = findCRCNDomain(pattern);

                    matches.push({
                        path,
                        pattern,
                        category,
                        confidence: calculateConfidence(contentLower, pattern),
                        explanation: generateExplanation(
                            pattern,
                            category,
                            crcnDomain
                        ),
                        crcnDomain,
                        aiGenerated: false, // Marquer comme non généré par IA
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

    return {
        suggestions: result.slice(0, 3), // Top 3 suggestions
        allMatches: result,
        originalContent: content,
    };
};
