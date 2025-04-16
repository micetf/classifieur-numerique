import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { useAlerts } from "../../contexts/alerts";
import Icon from "../ui/Icon.jsx";

/**
 * Composant pour gérer l'upload de documents
 */
const DocumentUpload = ({ onUpload }) => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    // Utiliser le contexte d'alertes
    const { showError } = useAlerts();

    // Formats de fichiers autorisés
    const ALLOWED_TYPES = [
        "application/pdf",
        "application/vnd.oasis.opendocument.text",
    ];
    const ALLOWED_EXTENSIONS = [".pdf", ".odt"];

    /**
     * Vérifie si le fichier est d'un type autorisé
     */
    const isFileTypeAllowed = (file) => {
        if (!file) return false;

        // Vérifier le type MIME
        if (ALLOWED_TYPES.includes(file.type)) return true;

        // Vérifier l'extension si le type MIME n'est pas reconnu
        const fileName = file.name.toLowerCase();
        return ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));
    };

    /**
     * Extrait le contenu textuel du fichier si possible
     */
    const extractFileContent = async (file) => {
        // Pour les fichiers PDF, nous pourrions utiliser une bibliothèque comme pdf.js
        // Pour les fichiers ODT, nous pourrions extraire le contenu XML
        // Mais pour simplifier, on retourne juste le nom du fichier comme contenu
        return file.name;
    };

    /**
     * Gestionnaire pour le glisser-déposer
     */
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    /**
     * Gestionnaire pour le dépôt de fichier
     */
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };

    /**
     * Gestionnaire pour la sélection de fichier
     */
    const handleFileChange = (file) => {
        if (!file) {
            setFile(null);
            return;
        }

        // Vérifier le type de fichier
        if (!isFileTypeAllowed(file)) {
            showError(
                `Type de fichier non autorisé. Veuillez utiliser un fichier PDF ou ODT.`
            );
            setFile(null);
            return;
        }

        // Vérifier la taille du fichier (max 10 Mo)
        if (file.size > 10 * 1024 * 1024) {
            showError(
                `Fichier trop volumineux. La taille maximale est de 10 Mo.`
            );
            setFile(null);
            return;
        }

        setFile(file);
    };

    /**
     * Gestionnaire pour le clic sur le bouton de sélection de fichier
     */
    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    /**
     * Gestionnaire pour la soumission du formulaire
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            showError("Veuillez sélectionner un fichier.");
            return;
        }

        setIsLoading(true);

        try {
            // Extraire le contenu du fichier si possible
            const content = await extractFileContent(file);

            // Préparer les données du document
            const documentData = {
                name: file.name,
                type: file.type,
                size: file.size,
                content: content,
            };

            // Appeler la fonction de callback
            onUpload(documentData);
        } catch (err) {
            showError(`Erreur lors du traitement du fichier: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Upload de document</h2>

            <form onSubmit={handleSubmit}>
                <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center ${
                        dragActive
                            ? "border-education-500 bg-education-50"
                            : "border-gray-300"
                    }`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.odt,application/pdf,application/vnd.oasis.opendocument.text"
                        onChange={(e) => handleFileChange(e.target.files[0])}
                    />

                    <div className="mb-4">
                        <Icon
                            name="upload"
                            className="h-12 w-12 text-gray-400"
                        />
                    </div>

                    <p className="mb-2 text-sm text-gray-700">
                        <span className="font-semibold">
                            Cliquez pour sélectionner
                        </span>{" "}
                        ou glissez-déposez un fichier
                    </p>
                    <p className="text-xs text-gray-500">
                        PDF ou ODT (10 Mo maximum)
                    </p>

                    {file && (
                        <div className="mt-4 p-3 bg-gray-50 rounded text-left">
                            <p className="text-sm font-medium text-gray-800">
                                {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {(file.size / 1024).toFixed(2)} Ko
                            </p>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleButtonClick}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-education-500"
                    >
                        <Icon
                            name="search"
                            className="h-4 w-4 mr-1.5 text-gray-500"
                        />
                        Parcourir
                    </button>
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={!file || isLoading}
                        className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-education-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-education-500 ${
                            !file || isLoading
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-education-700"
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <Icon name="loading" className="h-4 w-4 mr-2" />
                                Traitement...
                            </>
                        ) : (
                            <>
                                <Icon
                                    name="analyze"
                                    className="h-4 w-4 mr-1.5"
                                />
                                Analyser
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

DocumentUpload.propTypes = {
    onUpload: PropTypes.func.isRequired,
};

export default DocumentUpload;
