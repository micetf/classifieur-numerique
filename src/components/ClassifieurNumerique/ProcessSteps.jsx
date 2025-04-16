// src/components/ClassifieurNumerique/ProcessSteps.jsx
import React from "react";
import PropTypes from "prop-types";

/**
 * Composant pour afficher les étapes du processus de classification
 */
const ProcessSteps = ({ currentStep }) => {
    const steps = [
        { id: 1, name: "Choix méthode" },
        { id: 2, name: "Saisie/Upload" },
        { id: 3, name: "Classification" },
        { id: 4, name: "Commandes" },
    ];

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                {steps.map((step) => (
                    <div
                        key={step.id}
                        className={`flex-1 border-t-4 ${
                            currentStep >= step.id
                                ? "border-education-500"
                                : "border-gray-200"
                        }`}
                    >
                        <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                currentStep >= step.id
                                    ? "bg-education-500 text-white"
                                    : "bg-gray-200 text-gray-600"
                            } -mt-4 mx-auto`}
                        >
                            {step.id}
                        </div>
                        <p className="text-xs text-center mt-1">{step.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

ProcessSteps.propTypes = {
    currentStep: PropTypes.number.isRequired,
};

export default ProcessSteps;
