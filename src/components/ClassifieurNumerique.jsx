import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { useArborescence } from "../hooks/useArborescence";
import { useClassifier } from "../hooks/useClassifier";
import { useCommandGenerator } from "../hooks/useCommandGenerator";
import { saveToHistory } from "../services/indexedDBService";
import DocumentUpload from "./features/DocumentUpload";
import DescriptionForm from "./features/DescriptionForm";
import ClassificationResult from "./features/ClassificationResult";
import CommandGenerator from "./features/CommandGenerator";
import Alert from "./ui/Alert";

const ClassifieurNumerique = () => {
    // État pour gérer les étapes du processus
    const [currentStep, setCurrentStep] = useState(1);
    const [inputType, setInputType] = useState("upload"); // 'upload' ou 'description'
    const [documentData, setDocumentData] = useState(null);
    const [description, setDescription] = useState("");
    const [classificationResult, setClassificationResult] = useState(null);
    const [generatedCommand, setGeneratedCommand] = useState("");
    const [rgpdAlert, setRgpdAlert] = useState(null);

    // Hooks personnalisés
    const {
        arborescence,
        arborescenceType,
        loadArborescence,
        switchArborescenceType,
    } = useArborescence();
    const { classifyContent, detectRgpdIssues } = useClassifier();
    const { generateCommand } = useCommandGenerator();

    // Effet au chargement du composant
    useEffect(() => {
        // Charger l'arborescence par défaut (CPC)
        loadArborescence("cpc");
    }, [loadArborescence]);

    // Gestionnaire pour l'upload de document
    const handleDocumentUpload = (fileData) => {
        // Sanitize des données si nécessaire
        const sanitizedData = {
            ...fileData,
            content: fileData.content
                ? DOMPurify.sanitize(fileData.content)
                : "",
            name: DOMPurify.sanitize(fileData.name),
        };

        setDocumentData(sanitizedData);

        // Vérifier les problèmes RGPD potentiels
        const rgpdIssues = detectRgpdIssues(
            sanitizedData.content || sanitizedData.name
        );
        if (rgpdIssues.length > 0) {
            setRgpdAlert({
                title: "Alerte RGPD",
                message: `Termes sensibles détectés : ${rgpdIssues.join(", ")}`,
                type: "warning",
            });
        } else {
            setRgpdAlert(null);
        }

        // Passer à l'étape suivante
        setCurrentStep(3);
    };

    // Gestionnaire pour la saisie de description
    const handleDescriptionSubmit = (formData) => {
        const sanitizedDescription = DOMPurify.sanitize(formData.description);
        setDescription(sanitizedDescription);

        // Vérifier les problèmes RGPD potentiels
        const rgpdIssues = detectRgpdIssues(sanitizedDescription);
        if (rgpdIssues.length > 0) {
            setRgpdAlert({
                title: "Alerte RGPD",
                message: `Termes sensibles détectés : ${rgpdIssues.join(", ")}`,
                type: "warning",
            });
        } else {
            setRgpdAlert(null);
        }

        // Passer à l'étape suivante
        setCurrentStep(3);
    };

    // Effectuer la classification
    useEffect(() => {
        if (currentStep === 3) {
            const contentToClassify =
                inputType === "upload"
                    ? documentData?.content || documentData?.name || ""
                    : description;

            if (contentToClassify && arborescence) {
                const result = classifyContent(contentToClassify, arborescence);
                setClassificationResult(result);
            }
        }
    }, [
        currentStep,
        documentData,
        description,
        arborescence,
        inputType,
        classifyContent,
    ]);

    // Gestionnaire pour la génération de commande
    const handleGenerateCommand = (selectedPath, fileName) => {
        const sourceFileName =
            inputType === "upload"
                ? documentData.name
                : "document_description.txt";

        const command = generateCommand(selectedPath, sourceFileName, fileName);
        setGeneratedCommand(command);

        // Sauvegarder dans l'historique
        const historyItem = {
            date: new Date(),
            sourceType: inputType,
            sourceName:
                inputType === "upload"
                    ? documentData.name
                    : "Description textuelle",
            targetPath: selectedPath,
            targetName: fileName,
            command: command,
            arborescenceType: arborescenceType,
        };

        saveToHistory(historyItem);

        // Passer à l'étape finale
        setCurrentStep(4);
    };

    // Gestionnaire pour changement de type d'arborescence
    const handleArborescenceChange = (type) => {
        switchArborescenceType(type);
        // Si on a déjà effectué une classification, relancer la classification
        if (currentStep >= 3) {
            const contentToClassify =
                inputType === "upload"
                    ? documentData?.content || documentData?.name || ""
                    : description;

            if (contentToClassify && arborescence) {
                const result = classifyContent(contentToClassify, arborescence);
                setClassificationResult(result);
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-education-700 mb-6">
                Classifieur Numérique CPC-NE
            </h1>

            {/* Sélecteur d'arborescence */}
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
                <label
                    htmlFor="arborescence-select"
                    className="block mb-2 font-medium"
                >
                    Sélectionner l'arborescence :
                </label>
                <select
                    id="arborescence-select"
                    value={arborescenceType}
                    onChange={(e) => handleArborescenceChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-education-500 focus:border-education-500"
                >
                    <option value="cpc">Arborescence CPC</option>
                    <option value="perso">Arborescence Personnelle</option>
                </select>
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
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    {[1, 2, 3, 4].map((step) => (
                        <div
                            key={step}
                            className={`flex-1 border-t-4 ${
                                currentStep >= step
                                    ? "border-education-500"
                                    : "border-gray-200"
                            }`}
                        >
                            <div
                                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                    currentStep >= step
                                        ? "bg-education-500 text-white"
                                        : "bg-gray-200 text-gray-600"
                                } -mt-4 mx-auto`}
                            >
                                {step}
                            </div>
                            <p className="text-xs text-center mt-1">
                                {step === 1 && "Choix méthode"}
                                {step === 2 && "Saisie/Upload"}
                                {step === 3 && "Classification"}
                                {step === 4 && "Commandes"}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contenu en fonction de l'étape actuelle */}
            {currentStep === 1 && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Sélectionnez votre méthode d'entrée
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => {
                                setInputType("upload");
                                setCurrentStep(2);
                            }}
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
                            onClick={() => {
                                setInputType("description");
                                setCurrentStep(2);
                            }}
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

            {currentStep === 3 && classificationResult && (
                <ClassificationResult
                    result={classificationResult}
                    onPathSelected={handleGenerateCommand}
                    onBack={() => setCurrentStep(2)}
                />
            )}

            {currentStep === 4 && generatedCommand && (
                <CommandGenerator
                    command={generatedCommand}
                    onBack={() => setCurrentStep(3)}
                    onReset={() => {
                        setCurrentStep(1);
                        setDocumentData(null);
                        setDescription("");
                        setClassificationResult(null);
                        setGeneratedCommand("");
                        setRgpdAlert(null);
                    }}
                />
            )}
        </div>
    );
};

export default ClassifieurNumerique;
