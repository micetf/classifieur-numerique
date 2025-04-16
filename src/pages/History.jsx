import React, { useState, useEffect } from "react";
import {
    getHistoryItems,
    deleteHistoryItem,
    clearHistory,
    searchHistory,
} from "../services/indexedDBService";
import Alert from "../components/ui/Alert";
import Icon from "../components/ui/Icon.jsx";

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
                            <Icon name="clearSearch" className="h-5 w-5" />
                        </button>
                    )}
                </div>
                <button
                    onClick={handleSearch}
                    className="bg-education-600 hover:bg-education-700 text-white px-4 py-2 rounded-r-md"
                >
                    <Icon name="search" className="h-5 w-5" />
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
                    <Icon
                        name="loading"
                        className="h-8 w-8 text-education-600"
                    />
                </div>
            ) : historyItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <Icon
                        name="emptyHistory"
                        className="h-12 w-12 mx-auto mb-4"
                    />

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
                                                <Icon
                                                    name="copy"
                                                    className="h-5 w-5"
                                                />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(item.id)
                                                }
                                                disabled={isDeleting}
                                                className="text-red-600 hover:text-red-900"
                                                title="Supprimer"
                                            >
                                                <Icon
                                                    name="delete"
                                                    className="h-5 w-5"
                                                />
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
