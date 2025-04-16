import React, { useState, useEffect } from "react";
import {
    getHistoryItems,
    deleteHistoryItem,
    clearHistory,
    searchHistory,
} from "../services/indexedDBService";
import Alert from "../components/ui/Alert";

const History = () => {
    const [historyItems, setHistoryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    // Charger l'historique au chargement de la page
    useEffect(() => {
        loadHistory();
    }, []);

    // Charger les éléments d'historique
    const loadHistory = async () => {
        try {
            setLoading(true);
            const items = await getHistoryItems();
            setHistoryItems(items);
            setError(null);
        } catch (err) {
            setError(
                `Erreur lors du chargement de l'historique: ${err.message}`
            );
        } finally {
            setLoading(false);
        }
    };

    // Rechercher dans l'historique
    const handleSearch = async () => {
        try {
            setLoading(true);
            const results = await searchHistory(searchTerm);
            setHistoryItems(results);
        } catch (err) {
            setError(`Erreur lors de la recherche: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Réinitialiser la recherche
    const resetSearch = async () => {
        setSearchTerm("");
        loadHistory();
    };

    // Supprimer un élément de l'historique
    const handleDelete = async (id) => {
        try {
            setIsDeleting(true);
            await deleteHistoryItem(id);
            setHistoryItems((prev) => prev.filter((item) => item.id !== id));
            setAlert({
                message: "Élément supprimé avec succès",
                type: "success",
            });
        } catch (err) {
            setError(`Erreur lors de la suppression: ${err.message}`);
        } finally {
            setIsDeleting(false);
        }
    };

    // Effacer tout l'historique
    const handleClearHistory = async () => {
        if (
            window.confirm(
                "Êtes-vous sûr de vouloir effacer tout l'historique ? Cette action est irréversible."
            )
        ) {
            try {
                setIsDeleting(true);
                await clearHistory();
                setHistoryItems([]);
                setAlert({
                    message: "Historique effacé avec succès",
                    type: "success",
                });
            } catch (err) {
                setError(
                    `Erreur lors de l'effacement de l'historique: ${err.message}`
                );
            } finally {
                setIsDeleting(false);
            }
        }
    };

    // Formater la date pour l'affichage
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("fr-FR", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(date);
    };

    // Copier une commande dans le presse-papier
    const copyCommand = async (command) => {
        try {
            await navigator.clipboard.writeText(command);
            setAlert({
                message: "Commande copiée dans le presse-papier",
                type: "success",
            });
        } catch (err) {
            setError(`Erreur lors de la copie: ${err.message}`);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Historique des opérations
            </h1>

            {alert && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                    autoClose={3000}
                    className="mb-4"
                />
            )}

            {error && (
                <Alert
                    message={error}
                    type="error"
                    onClose={() => setError(null)}
                    className="mb-4"
                />
            )}

            {/* Barre de recherche */}
            <div className="flex mb-6">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Rechercher dans l'historique..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-education-500 focus:ring-education-500"
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />
                    {searchTerm && (
                        <button
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            onClick={resetSearch}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    )}
                </div>
                <button
                    onClick={handleSearch}
                    className="bg-education-600 hover:bg-education-700 text-white px-4 py-2 rounded-r-md"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>

            {/* Actions */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={handleClearHistory}
                    disabled={
                        isDeleting || loading || historyItems.length === 0
                    }
                    className={`text-sm text-red-600 hover:text-red-800 ${
                        isDeleting || loading || historyItems.length === 0
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                    }`}
                >
                    Effacer tout l'historique
                </button>
            </div>

            {/* Liste des éléments d'historique */}
            {loading ? (
                <div className="flex justify-center my-8">
                    <svg
                        className="animate-spin h-8 w-8 text-education-600"
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
                </div>
            ) : historyItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                    </svg>
                    <p className="mt-2 text-sm">
                        Aucun élément dans l'historique
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden shadow-sm border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Date
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Source
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Destination
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Type
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {historyItems.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(item.date)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.sourceName}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div
                                            className="truncate max-w-xs"
                                            title={`${item.targetPath}/${item.targetName}`}
                                        >
                                            {item.targetName}
                                        </div>
                                        <div
                                            className="text-xs text-gray-500 truncate max-w-xs"
                                            title={item.targetPath}
                                        >
                                            {item.targetPath}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                item.arborescenceType === "cpc"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-blue-100 text-blue-800"
                                            }`}
                                        >
                                            {item.arborescenceType === "cpc"
                                                ? "CPC"
                                                : "Personnel"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() =>
                                                    copyCommand(item.command)
                                                }
                                                className="text-education-600 hover:text-education-900"
                                                title="Copier la commande"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                                                    <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(item.id)
                                                }
                                                disabled={isDeleting}
                                                className="text-red-600 hover:text-red-900"
                                                title="Supprimer"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default History;
