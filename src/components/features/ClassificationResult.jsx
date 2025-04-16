import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { getDateForFilename } from "../../utils/dateUtils.js";

/**
 * Composant pour afficher les résultats de classification et permettre
 * la sélection d'une suggestion ou la modification manuelle du chemin
 */
const ClassificationResult = ({
    result,
    onPathSelected,
    onBack,
    isAIEnabled,
}) => {
    const [selectedPath, setSelectedPath] = useState(
        result?.suggestions?.length > 0 ? result.suggestions[0].path : ""
    );
    const [customFileName, setCustomFileName] = useState("");
    const [showAllMatches, setShowAllMatches] = useState(false);

    // Extrait le nom de fichier de base depuis le contenu original
    // ou génère un nom par défaut
    const generateDefaultFileName = useCallback(() => {
        const dateStr = getDateForFilename();

        // Essayer d'extraire un nom de fichier du contenu original
        let baseName = "document";

        if (
            result.originalContent &&
            typeof result.originalContent === "string"
        ) {
            // Extraire les premiers mots significatifs du contenu
            const words = result.originalContent
                .split(/\s+/)
                .filter((w) => w.length > 3)
                .slice(0, 3)
                .join("_");

            if (words) {
                baseName = words;
            }
        }

        return `${dateStr}_${baseName}_v1.pdf`;
    }, [result.originalContent]);

    // Initialiser le nom de fichier personnalisé si vide
    React.useEffect(() => {
        if (!customFileName) {
            setCustomFileName(generateDefaultFileName());
        }
    }, [customFileName, generateDefaultFileName, result]);

    // Gestionnaire pour la sélection d'un chemin suggéré
    const handlePathSelection = (path) => {
        setSelectedPath(path);
    };

    // Gestionnaire pour le changement manuel du chemin
    const handlePathChange = (e) => {
        setSelectedPath(e.target.value);
    };

    // Gestionnaire pour le changement du nom de fichier
    const handleFileNameChange = (e) => {
        setCustomFileName(e.target.value);
    };

    // Gestionnaire pour la soumission du formulaire
    const handleSubmit = (e) => {
        e.preventDefault();
        onPathSelected(selectedPath, customFileName);
    };

    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">
                Résultats de classification
                {isAIEnabled && result.aiGenerated && (
                    <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        Assistée par IA
                    </span>
                )}
            </h2>

            {/* Si aucun résultat n'est trouvé */}
            {(!result ||
                !result.suggestions ||
                result.suggestions.length === 0) && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg
                                className="h-5 w-5 text-yellow-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                Aucune classification automatique n'a pu être
                                déterminée. Veuillez sélectionner manuellement
                                un emplacement pour ce document.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Suggestions de classification */}
            {result && result.suggestions && result.suggestions.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">
                        Suggestions de classification
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Sélectionnez l'emplacement le plus approprié pour ce
                        document ou personnalisez le chemin.
                    </p>

                    <div className="space-y-3">
                        {result.suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                    selectedPath === suggestion.path
                                        ? "border-education-500 bg-education-50"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() =>
                                    handlePathSelection(suggestion.path)
                                }
                            >
                                <div className="flex items-start">
                                    <div
                                        className={`flex-shrink-0 h-5 w-5 mt-0.5 ${
                                            selectedPath === suggestion.path
                                                ? "text-education-600"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        {selectedPath === suggestion.path ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 000-12 6 6 0 000 12z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <p className="text-sm font-medium text-gray-900">
                                            {suggestion.path}
                                        </p>
                                        <div className="mt-1">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <svg
                                                        className="h-4 w-4 text-gray-400"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                                <p className="ml-1 text-xs text-gray-600">
                                                    {suggestion.explanation}
                                                    {isAIEnabled &&
                                                        suggestion.aiGenerated && (
                                                            <span className="ml-1 text-xs text-blue-600">
                                                                (Suggestion IA)
                                                            </span>
                                                        )}
                                                </p>
                                            </div>
                                            {suggestion.crcnDomain && (
                                                <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    CRCN{" "}
                                                    {suggestion.crcnDomain.id}
                                                </div>
                                            )}
                                            <div className="mt-1 inline-flex items-center ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Confiance:{" "}
                                                {suggestion.confidence}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Voir toutes les correspondances */}
                        {result.allMatches &&
                            result.allMatches.length >
                                result.suggestions.length && (
                                <div className="mt-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowAllMatches(!showAllMatches)
                                        }
                                        className="text-education-600 hover:text-education-700 text-sm font-medium focus:outline-none"
                                    >
                                        {showAllMatches
                                            ? "Masquer les résultats supplémentaires"
                                            : `Voir ${result.allMatches.length - result.suggestions.length} résultats supplémentaires`}
                                    </button>

                                    {showAllMatches && (
                                        <div className="mt-3 space-y-3">
                                            {result.allMatches
                                                .slice(
                                                    result.suggestions.length
                                                )
                                                .map((match, index) => (
                                                    <div
                                                        key={
                                                            index +
                                                            result.suggestions
                                                                .length
                                                        }
                                                        className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300"
                                                        onClick={() =>
                                                            handlePathSelection(
                                                                match.path
                                                            )
                                                        }
                                                    >
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {match.path}
                                                        </p>
                                                        <p className="text-xs text-gray-600 mt-1">
                                                            {match.explanation}
                                                        </p>
                                                        <div className="mt-1 flex items-center space-x-2">
                                                            {match.crcnDomain && (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                    CRCN{" "}
                                                                    {
                                                                        match
                                                                            .crcnDomain
                                                                            .id
                                                                    }
                                                                </span>
                                                            )}
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                Confiance:{" "}
                                                                {
                                                                    match.confidence
                                                                }
                                                                %
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </div>
                            )}
                    </div>
                </div>
            )}

            {/* Formulaire pour personnaliser le chemin et le nom de fichier */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="customPath"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Chemin de destination
                    </label>
                    <input
                        type="text"
                        id="customPath"
                        value={selectedPath}
                        onChange={handlePathChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-education-500 focus:ring-education-500"
                        placeholder="Exemple: 00_Ressources-pedagogiques-numeriques/ApplicationsEducatives/Robotique"
                        required
                    />
                </div>

                <div>
                    <label
                        htmlFor="customFileName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Nom du fichier
                    </label>
                    <input
                        type="text"
                        id="customFileName"
                        value={customFileName}
                        onChange={handleFileNameChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-education-500 focus:ring-education-500"
                        placeholder="AAAA-MM-JJ_Nom_Description_v1.ext"
                        required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Le format recommandé est :
                        Date_Sujet_Précision_Version.extension
                    </p>
                </div>

                <div className="flex justify-between pt-2">
                    <button
                        type="button"
                        onClick={onBack}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-education-500"
                    >
                        Retour
                    </button>

                    <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-education-600 hover:bg-education-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-education-500"
                    >
                        Générer les commandes
                    </button>
                </div>
            </form>
        </div>
    );
};

ClassificationResult.propTypes = {
    result: PropTypes.shape({
        suggestions: PropTypes.array,
        allMatches: PropTypes.array,
        originalContent: PropTypes.string,
        isAIEnabled: PropTypes.bool,
    }),
    onPathSelected: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
};

ClassificationResult.defaultProps = {
    isAIEnabled: false,
};

export default ClassificationResult;
