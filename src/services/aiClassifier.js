// src/services/aiClassifier.js

import DOMPurify from "dompurify";

/**
 * Service minimal pour la classification de documents par IA
 * Utilise l'API Mistral pour analyser les contenus et suggérer des classifications
 */

/**
 * Classifie un document en utilisant l'API Mistral
 * @param {string} content - Contenu du document à classifier
 * @param {object} arborescence - Arborescence dans laquelle classifier
 * @param {string} apiKey - Clé API pour Mistral
 * @returns {Promise} Résultat de la classification ou null en cas d'échec
 */
export const classifyWithAI = async (content, arborescence, apiKey) => {
    try {
        // Si pas de clé API, retourner null pour utiliser le fallback
        if (!apiKey) {
            console.log("Pas de clé API, utilisation du classifieur standard");
            return null;
        }

        // Sanitize et limiter le contenu pour l'API
        const sanitizedContent = DOMPurify.sanitize(content).substring(0, 8000);

        // Convertir l'arborescence en liste de chemins simplifiée
        const paths = [];
        const processArborescence = (obj, path = "") => {
            for (const key in obj) {
                const currentPath = path ? `${path}/${key}` : key;
                paths.push(currentPath);
                if (obj[key] && typeof obj[key] === "object") {
                    processArborescence(obj[key], currentPath);
                }
            }
        };
        processArborescence(arborescence);

        // Construire le prompt pour Mistral
        const prompt = `
Je vais te donner le contenu d'un document et les chemins d'une arborescence de fichiers.
Suggère 3 chemins où ce document pédagogique serait le mieux classé, avec un niveau de confiance (1-100)
et une brève explication pour chaque suggestion.
Document: "${sanitizedContent}"
Arborescence (chemins disponibles):
${paths.join("\n")}
Réponds avec un format JSON comme ceci:
{
  "suggestions": [
    {
      "path": "chemin/complet",
      "confidence": 85,
      "explanation": "Raison de ce classement",
      "crcnDomain": {"id": "1.2", "name": "Nom du domaine CRCN"},
      "aiGenerated": true
    }
  ]
}
`;

        // Appel API Mistral
        const response = await fetch(
            "https://api.mistral.ai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    model: "mistral-large-latest", // ou un autre modèle Mistral selon ton abonnement
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: 1000,
                    temperature: 0.3,
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`Erreur API Mistral: ${response.status}`);
        }

        const data = await response.json();
        // La réponse Mistral est dans data.choices[0].message.content
        const responseText = data.choices?.[0]?.message?.content;
        if (!responseText) {
            throw new Error("Réponse vide de Mistral");
        }

        // Extraire et parser la réponse JSON
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Format de réponse invalide");
        }
        const result = JSON.parse(jsonMatch[0]);

        // Formater pour correspondre au format attendu par l'application
        return {
            suggestions: result.suggestions.slice(0, 3),
            allMatches: result.suggestions,
            originalContent: content,
            aiGenerated: true,
        };
    } catch (error) {
        console.error("Erreur IA (Mistral):", error);
        return null; // Retourne null pour déclencher le fallback
    }
};

export default { classifyWithAI };
