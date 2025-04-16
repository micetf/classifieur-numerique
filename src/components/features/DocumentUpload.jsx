import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import Alert from "../ui/Alert";

/**
 * Composant pour gérer l'upload de documents
 */
const DocumentUpload = ({ onUpload }) => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

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
        setError(null);

        if (!file) {
            setFile(null);
            return;
        }

        // Vérifier le type de fichier
        if (!isFileTypeAllowed(file)) {
            setError(
                `Type de fichier non autorisé. Veuillez utiliser un fichier PDF ou ODT.`
            );
            setFile(null);
            return;
        }

        // Vérifier la taille du fichier (max 10 Mo)
        if (file.size > 10 * 1024 * 1024) {
            setError(
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
            setError("Veuillez sélectionner un fichier.");
            return;
        }

        setIsLoading(true);
        setError(null);

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
            setError(`Erreur lors du traitement du fichier: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Upload de document</h2>

            {error && (
                <Alert
                    message={error}
                    type="error"
                    onClose={() => setError(null)}
                />
            )}

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
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            ></path>
                        </svg>
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
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Traitement...
                            </>
                        ) : (
                            "Analyser"
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
