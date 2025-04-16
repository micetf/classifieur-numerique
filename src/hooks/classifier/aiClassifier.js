// src/hooks/classifier/aiClassifier.js
import DOMPurify from "dompurify";
import { getAllPaths } from "./utils";

/**
 * Classifie un document en utilisant l'API Claude
 * @param {string} content - Contenu du document à classifier
 * @param {object} arborescence - Arborescence dans laquelle classifier
 * @param {string} apiKey - Clé API pour Claude
 * @returns {Promise<object|null>} Résultat de la classification ou null en cas d'échec
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

        // Obtenir tous les chemins de l'arborescence
        const paths = getAllPaths(arborescence);

        // Construire un prompt simple pour l'IA
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

        // Appel API Claude
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
                model: "claude-3-haiku-20240307", // Modèle rapide et économique
                max_tokens: 1000,
                messages: [{ role: "user", content: prompt }],
            }),
        });

        if (!response.ok) {
            throw new Error(`Erreur API: ${response.status}`);
        }

        const data = await response.json();

        // Extraire et parser la réponse JSON
        const responseText = data.content[0].text;
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
        console.error("Erreur IA:", error);
        return null; // Retourne null pour déclencher le fallback
    }
};
