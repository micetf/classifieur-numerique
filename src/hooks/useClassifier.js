// src/hooks/useClassifier.js
import { useState, useCallback, useEffect } from "react";
import { classifyContent, detectRgpdIssues } from "./classifier";
import { validateClassifierInput } from "../utils/validationUtils";
import { settingsService } from "../services/settingsService";
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
        const settings = settingsService.getSettings();
        if (settings.useAI !== undefined) {
            setIsUsingAI(settings.useAI);
        }
        if (settings.aiApiKey) {
            setApiKey(settings.aiApiKey);
        }
    }, []);

    /**
     * Wrapper pour la fonction de classification
     */
    const classify = useCallback(
        async (content, arborescence) => {
            const validation = validateClassifierInput(content, arborescence);
            if (!validation.isValid) {
                return validation.defaultResult;
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

        let settings = settingsService.getSettings();
        settings.useAI = newValue;
        settingsService.updateSettings({ useAI: newValue });
    }, [isUsingAI]);

    /**
     * Définit la clé API pour l'IA
     */
    const setAIApiKey = useCallback((key) => {
        setApiKey(key);

        // Sauvegarder la clé API dans localStorage
        let settings = settingsService.getSettings();
        settings.aiApiKey = key;
        settingsService.updateSettings({ apiKey: key });
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
