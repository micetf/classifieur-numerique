// src/components/ClassifieurNumerique/StatusIndicator.jsx
import React from "react";
import PropTypes from "prop-types";

/**
 * Composant pour afficher l'indicateur de traitement/chargement
 */
const StatusIndicator = ({ isProcessing, isUsingAI }) => {
    if (!isProcessing) return null;

    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-education-600 mb-4"></div>
            <p className="text-lg text-gray-700">
                {isUsingAI
                    ? "L'IA analyse votre document..."
                    : "Classification en cours..."}
            </p>
        </div>
    );
};

StatusIndicator.propTypes = {
    isProcessing: PropTypes.bool.isRequired,
    isUsingAI: PropTypes.bool.isRequired,
};

export default StatusIndicator;
