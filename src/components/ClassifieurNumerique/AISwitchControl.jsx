// src/components/ClassifieurNumerique/AISwitchControl.jsx
import React from "react";
import PropTypes from "prop-types";

/**
 * Composant de contrôle pour activer/désactiver l'IA et configurer la clé API
 */
const AISwitchControl = ({
    isUsingAI,
    onToggleAI,
    apiKey,
    onConfigureAPIKey,
}) => {
    return (
        <div className="flex-1">
            <div className="flex flex-col items-end">
                <div className="flex items-center mb-2">
                    <span className="mr-3 text-sm font-medium">
                        Classification IA :
                    </span>
                    <button
                        onClick={onToggleAI}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                            isUsingAI ? "bg-education-600" : "bg-gray-300"
                        }`}
                        aria-pressed={isUsingAI}
                        aria-label="Activer/désactiver la classification par IA"
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                isUsingAI ? "translate-x-6" : "translate-x-1"
                            }`}
                        />
                    </button>
                </div>

                {isUsingAI && (
                    <button
                        onClick={onConfigureAPIKey}
                        className="text-sm text-education-600 hover:text-education-800"
                    >
                        {apiKey ? "Modifier la clé API" : "Définir la clé API"}
                    </button>
                )}
            </div>
        </div>
    );
};

AISwitchControl.propTypes = {
    isUsingAI: PropTypes.bool.isRequired,
    onToggleAI: PropTypes.func.isRequired,
    apiKey: PropTypes.string,
    onConfigureAPIKey: PropTypes.func.isRequired,
};

export default AISwitchControl;
