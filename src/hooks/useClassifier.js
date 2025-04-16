// src/hooks/useClassifier.js
import { useState, useCallback, useEffect } from "react";
import { classifyContent, detectRgpdIssues } from "./classifier";

/**
 * Hook personnalisé pour la classification de documents
 * Fournit une interface simple pour utiliser les fonctionnalités de classification
 */
export const useClassifier = () => {
    // États
    const [classifications, setClassifications] = useState([]);
    const [isUsingAI, setIsUsingAI] = useState(true);
    const [apiKey, setApiKey] = useState("");

    /**
     * Charger les préférences IA depuis localStorage au chargement
     */
    useEffect(() => {
        try {
            const savedSettings = localStorage.getItem("classifieurSettings");
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                if (settings.useAI !== undefined) {
                    setIsUsingAI(settings.useAI);
                }
                if (settings.aiApiKey) {
                    setApiKey(settings.aiApiKey);
                }
            }
        } catch (error) {
            console.error(
                "Erreur lors du chargement des paramètres IA:",
                error
            );
        }
    }, []);

    /**
     * Wrapper pour la fonction de classification
     */
    const classify = useCallback(
        async (content, arborescence) => {
            if (!content || !arborescence) {
                return {
                    suggestions: [],
                    allMatches: [],
                    originalContent: content || "",
                };
            }

            try {
                // Appeler la fonction de classification du module classifier
                const result = await classifyContent(
                    content,
                    arborescence,
                    isUsingAI,
                    apiKey
                );

                // Mettre à jour l'état des classifications
                setClassifications(result.allMatches || []);

                return result;
            } catch (error) {
                console.error("Erreur lors de la classification:", error);
                return {
                    suggestions: [],
                    allMatches: [],
                    originalContent: content,
                };
            }
        },
        [isUsingAI, apiKey]
    );

    /**
     * Wrapper pour la détection RGPD
     */
    const detectRgpd = useCallback((content) => {
        return detectRgpdIssues(content);
    }, []);

    /**
     * Bascule l'utilisation de l'IA (activation/désactivation)
     */
    const toggleAI = useCallback(() => {
        const newValue = !isUsingAI;
        setIsUsingAI(newValue);

        // Sauvegarder la préférence dans localStorage
        try {
            const savedSettings = localStorage.getItem("classifieurSettings");
            let settings = savedSettings ? JSON.parse(savedSettings) : {};
            settings.useAI = newValue;
            localStorage.setItem(
                "classifieurSettings",
                JSON.stringify(settings)
            );
        } catch (error) {
            console.error(
                "Erreur lors de la sauvegarde du paramètre IA:",
                error
            );
        }
    }, [isUsingAI]);

    /**
     * Définit la clé API pour l'IA
     */
    const setAIApiKey = useCallback((key) => {
        setApiKey(key);

        // Sauvegarder la clé API dans localStorage
        try {
            const savedSettings = localStorage.getItem("classifieurSettings");
            let settings = savedSettings ? JSON.parse(savedSettings) : {};
            settings.aiApiKey = key;
            localStorage.setItem(
                "classifieurSettings",
                JSON.stringify(settings)
            );
        } catch (error) {
            console.error("Erreur lors de la sauvegarde de la clé API:", error);
        }
    }, []);

    // API publique du hook
    return {
        classifyContent: classify,
        detectRgpdIssues: detectRgpd,
        classifications,
        isUsingAI,
        toggleAI,
        apiKey,
        setAIApiKey,
    };
};

export default useClassifier;
