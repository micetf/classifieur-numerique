// src/hooks/classifier/index.js
import { classifyWithRules } from "./ruleBasedClassifier";
import { classifyWithAI } from "./aiClassifier";
import { rgpdKeywords } from "../../constants/rgpdKeywords";

/**
 * Fonction principale de classification qui utilise l'IA ou les règles
 * selon les préférences et la disponibilité
 * @param {string} content - Contenu à classifier
 * @param {object} arborescence - Arborescence dans laquelle classifier
 * @param {boolean} useAI - Utiliser l'IA si disponible
 * @param {string} apiKey - Clé API pour l'IA
 * @returns {Promise<object>} Résultat de la classification
 */
export const classifyContent = async (
    content,
    arborescence,
    useAI = false,
    apiKey = ""
) => {
    // Validation des entrées
    if (!content || !arborescence) {
        return {
            suggestions: [],
            allMatches: [],
            originalContent: content || "",
        };
    }

    try {
        let result;

        // Utiliser l'IA si elle est activée et une clé API est disponible
        if (useAI && apiKey) {
            try {
                console.log("Tentative de classification par IA...");
                result = await classifyWithAI(content, arborescence, apiKey);

                if (result) {
                    console.log("Classification IA réussie");
                } else {
                    console.log(
                        "Classification IA échouée, fallback vers règles"
                    );
                }
            } catch (error) {
                console.error("Erreur lors de la classification IA:", error);
                result = null;
            }
        } else {
            console.log(
                useAI
                    ? "Clé API manquante, utilisation des règles standards"
                    : "IA désactivée, utilisation des règles standards"
            );
        }

        // Si l'IA échoue ou est désactivée, utiliser la méthode basée sur les règles
        if (!result) {
            result = classifyWithRules(content, arborescence);
        }

        return result;
    } catch (error) {
        console.error("Erreur générale lors de la classification:", error);
        // En cas d'erreur, retourner un résultat vide mais valide
        return {
            suggestions: [],
            allMatches: [],
            originalContent: content,
        };
    }
};

/**
 * Détecte les problèmes RGPD potentiels dans un contenu
 * @param {string} content - Contenu à analyser
 * @returns {Array<string>} Termes sensibles détectés
 */
export const detectRgpdIssues = (content) => {
    if (!content) return [];

    const contentLower = content.toLowerCase();
    const detectedTerms = [];

    rgpdKeywords.forEach((keyword) => {
        if (contentLower.includes(keyword.toLowerCase())) {
            detectedTerms.push(keyword);
        }
    });

    return detectedTerms;
};

export { classifyWithRules, classifyWithAI };
