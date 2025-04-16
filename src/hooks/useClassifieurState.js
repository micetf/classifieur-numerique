// src/components/ClassifieurNumerique/useClassifieurState.js
import { useState, useEffect, useCallback } from "react";
import DOMPurify from "dompurify";
import { saveToHistory } from "../services/indexedDBService";

/**
 * Hook personnalisé pour gérer l'état du classifieur
 * @param {object} arborescence - Arborescence actuelle
 * @param {string} arborescenceType - Type d'arborescence (cpc ou perso)
 * @param {function} classifyContent - Fonction de classification
 * @param {function} detectRgpdIssues - Fonction de détection RGPD
 * @param {function} generateCommand - Fonction de génération de commandes
 */
const useClassifieurState = (
    arborescence,
    arborescenceType,
    classifyContent,
    detectRgpdIssues,
    generateCommand
) => {
    // États du processus
    const [currentStep, setCurrentStep] = useState(1);
    const [inputType, setInputType] = useState("upload");
    const [documentData, setDocumentData] = useState(null);
    const [description, setDescription] = useState("");
    const [classificationResult, setClassificationResult] = useState(null);
    const [generatedCommand, setGeneratedCommand] = useState("");
    const [rgpdAlert, setRgpdAlert] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Gestionnaire pour l'upload de document
    const handleDocumentUpload = useCallback(
        (fileData) => {
            // Sanitize des données
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
        },
        [detectRgpdIssues]
    );

    // Gestionnaire pour la saisie de description
    const handleDescriptionSubmit = useCallback(
        (formData) => {
            const sanitizedDescription = DOMPurify.sanitize(
                formData.description
            );
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
        },
        [detectRgpdIssues]
    );

    // Effectuer la classification quand on arrive à l'étape 3
    useEffect(() => {
        const performClassification = async () => {
            if (currentStep === 3) {
                const contentToClassify =
                    inputType === "upload"
                        ? documentData?.content || documentData?.name || ""
                        : description;

                if (contentToClassify && arborescence) {
                    setIsProcessing(true);

                    try {
                        const result = await classifyContent(
                            contentToClassify,
                            arborescence
                        );
                        setClassificationResult(result);
                    } catch (error) {
                        console.error(
                            "Erreur lors de la classification:",
                            error
                        );
                        setRgpdAlert({
                            title: "Erreur",
                            message:
                                "La classification a échoué. Veuillez réessayer.",
                            type: "error",
                        });
                    } finally {
                        setIsProcessing(false);
                    }
                }
            }
        };

        performClassification();
    }, [
        currentStep,
        documentData,
        description,
        arborescence,
        inputType,
        classifyContent,
    ]);

    // Gestionnaire pour la génération de commande
    const handleGenerateCommand = useCallback(
        (selectedPath, fileName, isAIGenerated = false) => {
            const sourceFileName =
                inputType === "upload"
                    ? documentData.name
                    : "document_description.txt";

            const command = generateCommand(
                selectedPath,
                sourceFileName,
                fileName
            );
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
                aiAssisted: isAIGenerated && classificationResult?.aiGenerated,
            };

            saveToHistory(historyItem);

            // Passer à l'étape finale
            setCurrentStep(4);
        },
        [
            inputType,
            documentData?.name,
            generateCommand,
            arborescenceType,
            classificationResult?.aiGenerated,
        ]
    );

    // Réinitialiser le processus
    const resetProcess = useCallback(() => {
        setCurrentStep(1);
        setDocumentData(null);
        setDescription("");
        setClassificationResult(null);
        setGeneratedCommand("");
        setRgpdAlert(null);
    }, []);

    // Sélectionner la méthode d'entrée et aller à l'étape 2
    const selectInputMethod = useCallback((method) => {
        setInputType(method);
        setCurrentStep(2);
    }, []);

    return {
        // États
        currentStep,
        inputType,
        documentData,
        description,
        classificationResult,
        generatedCommand,
        rgpdAlert,
        isProcessing,

        // Actions
        setCurrentStep,
        setRgpdAlert,
        handleDocumentUpload,
        handleDescriptionSubmit,
        handleGenerateCommand,
        resetProcess,
        selectInputMethod,
    };
};

export default useClassifieurState;
