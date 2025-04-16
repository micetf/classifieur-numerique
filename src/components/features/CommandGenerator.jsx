import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import Alert from "../ui/Alert";

/**
 * Composant pour afficher et gérer les commandes Linux générées
 */
const CommandGenerator = ({ command, onBack, onReset }) => {
    const [copied, setCopied] = useState(false);
    const [showInfo, setShowInfo] = useState(true);
    const commandRef = useRef(null);

    // Fonction pour copier la commande dans le presse-papier
    const copyToClipboard = () => {
        if (commandRef.current) {
            const textToCopy = commandRef.current.textContent;

            navigator.clipboard
                .writeText(textToCopy)
                .then(() => {
                    setCopied(true);
                    // Réinitialiser l'indicateur de copie après 2 secondes
                    setTimeout(() => setCopied(false), 2000);
                })
                .catch((err) => {
                    console.error(
                        "Erreur lors de la copie dans le presse-papier:",
                        err
                    );
                });
        }
    };

    // Mettre en évidence la syntaxe de la commande
    const highlightCommand = (text) => {
        if (!text) return "";

        // Détection des commentaires, commandes et options
        const highlightedText = text
            // Mettre en évidence les commentaires (lignes commençant par #)
            .replace(/(^#.*$)/gm, '<span class="text-gray-500">$1</span>')
            // Mettre en évidence les commandes Linux (comme mkdir, mv)
            .replace(
                /^(mkdir|mv)(\s+)/gm,
                '<span class="text-blue-600 font-semibold">$1</span>$2'
            )
            // Mettre en évidence les options (comme -p, -v)
            .replace(
                /(\s)(-[a-z]+)(\s)/g,
                '$1<span class="text-green-600">$2</span>$3'
            )
            // Mettre en évidence les chemins complets entre guillemets
            .replace(
                /(")([^"]+)(")/g,
                '$1<span class="text-yellow-600">$2</span>$3'
            );

        return highlightedText;
    };

    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">
                Commandes Linux générées
            </h2>

            {showInfo && (
                <Alert
                    title="Instructions"
                    message="Voici les commandes Linux générées pour créer le dossier et déplacer le fichier. Vous pouvez les copier et les exécuter dans un terminal Linux ou utiliser ces commandes comme référence pour organiser vos fichiers."
                    type="info"
                    onClose={() => setShowInfo(false)}
                    className="mb-4"
                />
            )}

            {/* Affichage de la commande */}
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <button
                        onClick={copyToClipboard}
                        className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                    >
                        {copied ? "Copié!" : "Copier"}
                    </button>
                </div>

                <pre
                    ref={commandRef}
                    className="text-gray-300 text-sm font-mono whitespace-pre-wrap overflow-x-auto"
                    dangerouslySetInnerHTML={{
                        __html: highlightCommand(command),
                    }}
                ></pre>
            </div>

            {/* Instructions d'exécution */}
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
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                            Rappel important :
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                            <p>Ces commandes vont :</p>
                            <ol className="mt-1 ml-4 list-decimal space-y-1">
                                <li>
                                    Créer le chemin de dossiers s'il n'existe
                                    pas déjà.
                                </li>
                                <li>
                                    Déplacer le fichier source vers ce dossier
                                    tout en le renommant.
                                </li>
                            </ol>
                            <p className="mt-2">
                                Assurez-vous que le fichier source existe à
                                l'emplacement spécifié et que vous avez les
                                droits nécessaires pour exécuter ces commandes.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-between pt-2">
                <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-education-500"
                >
                    Retour
                </button>

                <div className="space-x-3">
                    <button
                        type="button"
                        onClick={copyToClipboard}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-education-500"
                    >
                        {copied ? (
                            <>
                                <svg
                                    className="h-4 w-4 mr-1.5 text-green-500"
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
                                Copié
                            </>
                        ) : (
                            <>
                                <svg
                                    className="h-4 w-4 mr-1.5 text-gray-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                                    <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                                </svg>
                                Copier
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={onReset}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-education-600 hover:bg-education-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-education-500"
                    >
                        <svg
                            className="h-4 w-4 mr-1.5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Nouveau classement
                    </button>
                </div>
            </div>
        </div>
    );
};

CommandGenerator.propTypes = {
    command: PropTypes.string.isRequired,
    onBack: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
};

export default CommandGenerator;
