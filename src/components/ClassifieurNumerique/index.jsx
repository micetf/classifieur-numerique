// src/components/ClassifieurNumerique/index.jsx
import React, { useCallback } from "react";
import { useArborescence } from "../../hooks/useArborescence";
import { useClassifier } from "../../hooks/useClassifier";
import { useCommandGenerator } from "../../hooks/useCommandGenerator";
import DocumentUpload from "../features/DocumentUpload";
import DescriptionForm from "../features/DescriptionForm";
import ClassificationResult from "../features/ClassificationResult";
import CommandGenerator from "../features/CommandGenerator";
import Alert from "../ui/Alert";
import useClassifieurState from "../../hooks/useClassifieurState";
import ArborescenceSelector from "./ArborescenceSelector";
import AISwitchControl from "./AISwitchControl";
import ProcessSteps from "./ProcessSteps";
import StatusIndicator from "./StatusIndicator";

/**
 * Composant principal du classifieur numérique
 * Intègre la classification IA et par règles
 */
const ClassifieurNumerique = () => {
    // Hooks personnalisés
    const {
        arborescence,
        arborescenceType,
        loadArborescence,
        switchArborescenceType,
    } = useArborescence();

    const {
        classifyContent,
        detectRgpdIssues,
        isUsingAI,
        toggleAI,
        apiKey,
        setAIApiKey,
    } = useClassifier();

    const { generateCommand } = useCommandGenerator();

    // Hook d'état principal du composant
    const {
        currentStep,
        inputType,
        classificationResult,
        generatedCommand,
        rgpdAlert,
        isProcessing,
        setCurrentStep,
        setRgpdAlert,
        handleDocumentUpload,
        handleDescriptionSubmit,
        handleGenerateCommand,
        resetProcess,
        selectInputMethod,
    } = useClassifieurState(
        arborescence,
        arborescenceType,
        classifyContent,
        detectRgpdIssues,
        generateCommand
    );

    // Effet au chargement initial du composant
    React.useEffect(() => {
        // Charger l'arborescence par défaut (CPC)
        loadArborescence("cpc");
    }, [loadArborescence]);

    // Gestionnaire pour changement de type d'arborescence
    const handleArborescenceChange = useCallback(
        (type) => {
            switchArborescenceType(type);

            // Si on a déjà effectué une classification, relancer la classification
            if (currentStep >= 3) {
                setCurrentStep(2); // Retourner à l'étape précédente pour relancer la classification
            }
        },
        [currentStep, switchArborescenceType, setCurrentStep]
    );

    // Gestionnaire pour la configuration de la clé API
    const handleConfigureAPIKey = useCallback(() => {
        const newKey = prompt("Entrez votre clé API Claude:", apiKey || "");

        if (newKey !== null) {
            setAIApiKey(newKey);
            if (newKey) {
                setRgpdAlert({
                    title: "Configuration IA",
                    message: "Clé API enregistrée avec succès.",
                    type: "success",
                });
            }
        }
    }, [apiKey, setAIApiKey, setRgpdAlert]);

    // Rendu du composant
    return (
        <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-education-700 mb-6">
                Classifieur Numérique CPC-NE
            </h1>

            {/* Panneau de configuration */}
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Sélecteur d'arborescence */}
                    <ArborescenceSelector
                        arborescenceType={arborescenceType}
                        onArborescenceChange={handleArborescenceChange}
                    />

                    {/* Contrôles IA */}
                    <AISwitchControl
                        isUsingAI={isUsingAI}
                        onToggleAI={toggleAI}
                        apiKey={apiKey}
                        onConfigureAPIKey={handleConfigureAPIKey}
                    />
                </div>
            </div>

            {/* Alerte RGPD si nécessaire */}
            {rgpdAlert && (
                <Alert
                    title={rgpdAlert.title}
                    message={rgpdAlert.message}
                    type={rgpdAlert.type}
                    onClose={() => setRgpdAlert(null)}
                />
            )}

            {/* Étapes du processus */}
            <ProcessSteps currentStep={currentStep} />

            {/* Contenu basé sur l'étape actuelle */}
            {currentStep === 1 && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Sélectionnez votre méthode d'entrée
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => selectInputMethod("upload")}
                            className="p-6 border-2 border-gray-200 rounded-lg hover:border-education-500 hover:bg-education-50 transition-colors"
                        >
                            <h3 className="text-lg font-medium mb-2">
                                Upload de document
                            </h3>
                            <p className="text-gray-600">
                                Téléchargez un document PDF ou ODT pour analyse
                                automatique
                            </p>
                        </button>

                        <button
                            onClick={() => selectInputMethod("description")}
                            className="p-6 border-2 border-gray-200 rounded-lg hover:border-education-500 hover:bg-education-50 transition-colors"
                        >
                            <h3 className="text-lg font-medium mb-2">
                                Description textuelle
                            </h3>
                            <p className="text-gray-600">
                                Décrivez le contenu du document à classer
                            </p>
                        </button>
                    </div>
                </div>
            )}

            {currentStep === 2 && inputType === "upload" && (
                <DocumentUpload onUpload={handleDocumentUpload} />
            )}

            {currentStep === 2 && inputType === "description" && (
                <DescriptionForm onSubmit={handleDescriptionSubmit} />
            )}

            {currentStep === 3 && (
                <StatusIndicator
                    isProcessing={isProcessing}
                    isUsingAI={isUsingAI}
                />
            )}

            {currentStep === 3 && !isProcessing && classificationResult && (
                <ClassificationResult
                    result={classificationResult}
                    onPathSelected={(path, fileName) =>
                        handleGenerateCommand(
                            path,
                            fileName,
                            classificationResult.aiGenerated
                        )
                    }
                    onBack={() => setCurrentStep(2)}
                    isAIEnabled={isUsingAI}
                />
            )}

            {currentStep === 4 && generatedCommand && (
                <CommandGenerator
                    command={generatedCommand}
                    onBack={() => setCurrentStep(3)}
                    onReset={resetProcess}
                />
            )}
        </div>
    );
};

export default ClassifieurNumerique;
