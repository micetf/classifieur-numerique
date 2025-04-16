/**
 * Service pour gérer le stockage local avec IndexedDB
 */

const DB_NAME = "ClassifieurNumeriqueCPC";
const DB_VERSION = 1;
const HISTORY_STORE = "history";

/**
 * Initialise la base de données IndexedDB
 * @returns {Promise<IDBDatabase>} Instance de la base de données
 */
const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            reject(
                `Erreur d'ouverture de la base de données: ${event.target.error}`
            );
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // Créer le store pour l'historique s'il n'existe pas
            if (!db.objectStoreNames.contains(HISTORY_STORE)) {
                const historyStore = db.createObjectStore(HISTORY_STORE, {
                    keyPath: "id",
                    autoIncrement: true,
                });

                // Créer des index pour faciliter les recherches
                historyStore.createIndex("date", "date", { unique: false });
                historyStore.createIndex("sourceType", "sourceType", {
                    unique: false,
                });
                historyStore.createIndex(
                    "arborescenceType",
                    "arborescenceType",
                    { unique: false }
                );
            }
        };
    });
};

/**
 * Sauvegarde une opération dans l'historique
 * @param {object} item - Élément à sauvegarder dans l'historique
 * @returns {Promise<number>} ID de l'élément créé
 */
export const saveToHistory = async (item) => {
    try {
        const db = await initDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([HISTORY_STORE], "readwrite");
            const store = transaction.objectStore(HISTORY_STORE);

            // Ajouter la date si elle n'existe pas
            if (!item.date) {
                item.date = new Date();
            }

            const request = store.add(item);

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(
                    `Erreur lors de la sauvegarde dans l'historique: ${event.target.error}`
                );
            };
        });
    } catch (error) {
        console.error("Erreur lors de la sauvegarde dans l'historique:", error);
        return null;
    }
};

/**
 * Récupère tous les éléments de l'historique
 * @returns {Promise<Array>} Tableau des éléments de l'historique
 */
export const getHistoryItems = async () => {
    try {
        const db = await initDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([HISTORY_STORE], "readonly");
            const store = transaction.objectStore(HISTORY_STORE);
            const request = store.getAll();

            request.onsuccess = (event) => {
                // Trier par date décroissante
                const items = event.target.result;
                items.sort((a, b) => new Date(b.date) - new Date(a.date));
                resolve(items);
            };

            request.onerror = (event) => {
                reject(
                    `Erreur lors de la récupération de l'historique: ${event.target.error}`
                );
            };
        });
    } catch (error) {
        console.error("Erreur lors de la récupération de l'historique:", error);
        return [];
    }
};

/**
 * Supprime un élément de l'historique
 * @param {number} id - ID de l'élément à supprimer
 * @returns {Promise<boolean>} Succès de la suppression
 */
export const deleteHistoryItem = async (id) => {
    try {
        const db = await initDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([HISTORY_STORE], "readwrite");
            const store = transaction.objectStore(HISTORY_STORE);
            const request = store.delete(id);

            request.onsuccess = () => {
                resolve(true);
            };

            request.onerror = (event) => {
                reject(
                    `Erreur lors de la suppression de l'élément d'historique: ${event.target.error}`
                );
            };
        });
    } catch (error) {
        console.error(
            "Erreur lors de la suppression de l'élément d'historique:",
            error
        );
        return false;
    }
};

/**
 * Efface tout l'historique
 * @returns {Promise<boolean>} Succès de l'opération
 */
export const clearHistory = async () => {
    try {
        const db = await initDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([HISTORY_STORE], "readwrite");
            const store = transaction.objectStore(HISTORY_STORE);
            const request = store.clear();

            request.onsuccess = () => {
                resolve(true);
            };

            request.onerror = (event) => {
                reject(
                    `Erreur lors de l'effacement de l'historique: ${event.target.error}`
                );
            };
        });
    } catch (error) {
        console.error("Erreur lors de l'effacement de l'historique:", error);
        return false;
    }
};

/**
 * Recherche des éléments dans l'historique
 * @param {string} searchTerm - Terme de recherche
 * @returns {Promise<Array>} Éléments correspondants
 */
export const searchHistory = async (searchTerm) => {
    try {
        const allItems = await getHistoryItems();

        if (!searchTerm) {
            return allItems;
        }

        const searchTermLower = searchTerm.toLowerCase();

        return allItems.filter(
            (item) =>
                (item.sourceName &&
                    item.sourceName.toLowerCase().includes(searchTermLower)) ||
                (item.targetPath &&
                    item.targetPath.toLowerCase().includes(searchTermLower)) ||
                (item.targetName &&
                    item.targetName.toLowerCase().includes(searchTermLower))
        );
    } catch (error) {
        console.error("Erreur lors de la recherche dans l'historique:", error);
        return [];
    }
};

export default {
    saveToHistory,
    getHistoryItems,
    deleteHistoryItem,
    clearHistory,
    searchHistory,
};
