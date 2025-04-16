import React, { useState, useEffect } from "react";
import Alert from "../components/ui/Alert";
import { settingsService } from "../services/settingsService";

const Settings = () => {
    const [settings, setSettings] = useState({
        cpcArborescenceUrl: "",
        persoArborescenceUrl: "",
        defaultArborescence: "cpc",
        autoSaveHistory: true,
        autoValidation: false,
        rgpdDetectionEnabled: true,
        commandValidationEnabled: true,
        defaultNamingPattern: "YYYY-MM-DD_Nom_Description_v1",
        userNameOrInitials: "",
        darkMode: false,
        showExplanations: true,
    });

    const [alert, setAlert] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("general");

    // Charger les paramètres depuis le localStorage au chargement
    useEffect(() => {
        const settings = settingsService.getSettings();
        setSettings(settings);
    }, []);

    // Mettre à jour un paramètre
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Enregistrer les paramètres
    const handleSave = () => {
        setIsSaving(true);

        try {
            localStorage.setItem(
                "classifieurSettings",
                JSON.stringify(settings)
            );

            setAlert({
                type: "success",
                message: "Les paramètres ont été enregistrés avec succès.",
            });

            // Propager les changements à l'application
            // Cela pourrait être fait via un contexte global ou un gestionnaire d'état
            // Pour l'instant, on utilise un événement personnalisé
            window.dispatchEvent(
                new CustomEvent("settings-updated", {
                    detail: { settings },
                })
            );
        } catch (err) {
            setAlert({
                type: "error",
                message: `Erreur lors de l'enregistrement des paramètres: ${err.message}`,
            });
        } finally {
            setIsSaving(false);
        }
    };

    // Réinitialiser les paramètres
    const handleReset = () => {
        if (
            window.confirm(
                "Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?"
            )
        ) {
            const defaultSettings = {
                cpcArborescenceUrl: "",
                persoArborescenceUrl: "",
                defaultArborescence: "cpc",
                autoSaveHistory: true,
                autoValidation: false,
                rgpdDetectionEnabled: true,
                commandValidationEnabled: true,
                defaultNamingPattern: "YYYY-MM-DD_Nom_Description_v1",
                userNameOrInitials: "",
                darkMode: false,
                showExplanations: true,
            };

            setSettings(defaultSettings);

            try {
                localStorage.setItem(
                    "classifieurSettings",
                    JSON.stringify(defaultSettings)
                );

                setAlert({
                    type: "success",
                    message:
                        "Les paramètres ont été réinitialisés avec succès.",
                });

                // Propager les changements
                window.dispatchEvent(
                    new CustomEvent("settings-updated", {
                        detail: { settings: defaultSettings },
                    })
                );
            } catch (err) {
                setAlert({
                    type: "error",
                    message: `Erreur lors de la réinitialisation des paramètres: ${err.message}`,
                });
            }
        }
    };

    // Fonction pour tester les URLs d'arborescence
    const testArborescenceUrl = async (type) => {
        const url =
            type === "cpc"
                ? settings.cpcArborescenceUrl
                : settings.persoArborescenceUrl;

        if (!url) {
            setAlert({
                type: "warning",
                message: `Aucune URL définie pour l'arborescence ${type === "cpc" ? "CPC" : "personnelle"}.`,
            });
            return;
        }

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            // Vérifier que c'est du JSON valide
            const data = await response.json();

            if (typeof data !== "object") {
                throw new Error(
                    "Le fichier ne contient pas un objet JSON valide."
                );
            }

            setAlert({
                type: "success",
                message: `L'URL de l'arborescence ${type === "cpc" ? "CPC" : "personnelle"} est valide et accessible.`,
            });
        } catch (err) {
            setAlert({
                type: "error",
                message: `Erreur lors du test de l'URL: ${err.message}`,
            });
        }
    };

    // Fonction pour exporter l'historique
    const exportHistory = async () => {
        try {
            // Importer dynamiquement le service
            const { getHistoryItems } = await import(
                "../services/indexedDBService"
            );

            const historyItems = await getHistoryItems();

            if (historyItems.length === 0) {
                setAlert({
                    type: "warning",
                    message: "Aucun élément dans l'historique à exporter.",
                });
                return;
            }

            const dataStr = JSON.stringify(historyItems, null, 2);
            const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

            const exportFileDefaultName = `classifieur-history-${new Date().toISOString().slice(0, 10)}.json`;

            const linkElement = document.createElement("a");
            linkElement.setAttribute("href", dataUri);
            linkElement.setAttribute("download", exportFileDefaultName);
            linkElement.click();

            setAlert({
                type: "success",
                message: `${historyItems.length} éléments d'historique exportés avec succès.`,
            });
        } catch (err) {
            setAlert({
                type: "error",
                message: `Erreur lors de l'exportation de l'historique: ${err.message}`,
            });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Paramètres
            </h1>

            {alert && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                    autoClose={5000}
                    className="mb-4"
                />
            )}

            {/* Onglets de navigation */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab("general")}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "general"
                                ? "border-education-500 text-education-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                        aria-current={
                            activeTab === "general" ? "page" : undefined
                        }
                    >
                        Général
                    </button>
                    <button
                        onClick={() => setActiveTab("arborescence")}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "arborescence"
                                ? "border-education-500 text-education-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                        aria-current={
                            activeTab === "arborescence" ? "page" : undefined
                        }
                    >
                        Arborescences
                    </button>
                    <button
                        onClick={() => setActiveTab("classification")}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "classification"
                                ? "border-education-500 text-education-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                        aria-current={
                            activeTab === "classification" ? "page" : undefined
                        }
                    >
                        Classification
                    </button>
                    <button
                        onClick={() => setActiveTab("commands")}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "commands"
                                ? "border-education-500 text-education-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                        aria-current={
                            activeTab === "commands" ? "page" : undefined
                        }
                    >
                        Commandes
                    </button>
                    <button
                        onClick={() => setActiveTab("data")}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "data"
                                ? "border-education-500 text-education-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                        aria-current={activeTab === "data" ? "page" : undefined}
                    >
                        Données
                    </button>
                </nav>
            </div>

            {/* Contenu des onglets */}
            <div className="space-y-6">
                {/* Onglet Général */}
                {activeTab === "general" && (
                    <div>
                        <h2 className="text-lg font-medium text-gray-900 mb-3">
                            Options générales
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        type="checkbox"
                                        id="autoSaveHistory"
                                        name="autoSaveHistory"
                                        checked={settings.autoSaveHistory}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-education-600 border-gray-300 rounded focus:ring-education-500"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label
                                        htmlFor="autoSaveHistory"
                                        className="font-medium text-gray-700"
                                    >
                                        Sauvegarder automatiquement l'historique
                                    </label>
                                    <p className="text-gray-500">
                                        Enregistre toutes les opérations de
                                        classification dans l'historique.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        type="checkbox"
                                        id="showExplanations"
                                        name="showExplanations"
                                        checked={settings.showExplanations}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-education-600 border-gray-300 rounded focus:ring-education-500"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label
                                        htmlFor="showExplanations"
                                        className="font-medium text-gray-700"
                                    >
                                        Afficher les explications
                                    </label>
                                    <p className="text-gray-500">
                                        Affiche les explications pédagogiques
                                        pour les suggestions de classification.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        type="checkbox"
                                        id="darkMode"
                                        name="darkMode"
                                        checked={settings.darkMode}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-education-600 border-gray-300 rounded focus:ring-education-500"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label
                                        htmlFor="darkMode"
                                        className="font-medium text-gray-700"
                                    >
                                        Mode sombre
                                    </label>
                                    <p className="text-gray-500">
                                        Activer le thème sombre pour l'interface
                                        (nécessite un rechargement).
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="userNameOrInitials"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Nom ou initiales
                                </label>
                                <input
                                    type="text"
                                    id="userNameOrInitials"
                                    name="userNameOrInitials"
                                    value={settings.userNameOrInitials}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-education-500 focus:ring-education-500"
                                    placeholder="Vos initiales ou nom (optionnel)"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Ces informations peuvent être utilisées dans
                                    le nommage des fichiers.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Onglet Arborescences */}
                {activeTab === "arborescence" && (
                    <div>
                        <h2 className="text-lg font-medium text-gray-900 mb-3">
                            Configuration des arborescences
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="defaultArborescence"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Arborescence par défaut
                                </label>
                                <select
                                    id="defaultArborescence"
                                    name="defaultArborescence"
                                    value={settings.defaultArborescence}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-education-500 focus:ring-education-500"
                                >
                                    <option value="cpc">
                                        Arborescence CPC
                                    </option>
                                    <option value="perso">
                                        Arborescence personnelle
                                    </option>
                                </select>
                                <p className="mt-1 text-xs text-gray-500">
                                    L'arborescence qui sera sélectionnée par
                                    défaut au chargement de l'application.
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="cpcArborescenceUrl"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    URL de l'arborescence CPC (GitHub)
                                </label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        id="cpcArborescenceUrl"
                                        name="cpcArborescenceUrl"
                                        value={settings.cpcArborescenceUrl}
                                        onChange={handleChange}
                                        placeholder="https://raw.githubusercontent.com/[user]/[repo]/main/arborescence-cpc.json"
                                        className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-education-500 focus:ring-education-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            testArborescenceUrl("cpc")
                                        }
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-r-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-education-500"
                                    >
                                        Tester
                                    </button>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    URL du fichier JSON contenant l'arborescence
                                    CPC sur GitHub. Laissez vide pour utiliser
                                    l'arborescence par défaut.
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="persoArborescenceUrl"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    URL de l'arborescence personnelle (GitHub)
                                </label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        id="persoArborescenceUrl"
                                        name="persoArborescenceUrl"
                                        value={settings.persoArborescenceUrl}
                                        onChange={handleChange}
                                        placeholder="https://raw.githubusercontent.com/[user]/[repo]/main/arborescence-perso.json"
                                        className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-education-500 focus:ring-education-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            testArborescenceUrl("perso")
                                        }
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-r-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-education-500"
                                    >
                                        Tester
                                    </button>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    URL du fichier JSON contenant votre
                                    arborescence personnelle sur GitHub. Laissez
                                    vide pour utiliser l'arborescence par
                                    défaut.
                                </p>
                            </div>

                            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
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
                                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-yellow-800">
                                            Format attendu des arborescences
                                        </h3>
                                        <div className="mt-2 text-sm text-yellow-700">
                                            <p>
                                                Les arborescences doivent être
                                                au format JSON structuré
                                                hiérarchiquement :
                                            </p>
                                            <pre className="mt-1 text-xs bg-yellow-100 p-2 rounded overflow-x-auto">
                                                {`{
  "00_Dossier1": {
    "Sous-dossier1": {
      "Dossier-enfant": {}
    },
    "Sous-dossier2": {}
  },
  "01_Dossier2": {}
}`}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Onglet Classification */}
                {activeTab === "classification" && (
                    <div>
                        <h2 className="text-lg font-medium text-gray-900 mb-3">
                            Options de classification
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        type="checkbox"
                                        id="autoValidation"
                                        name="autoValidation"
                                        checked={settings.autoValidation}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-education-600 border-gray-300 rounded focus:ring-education-500"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label
                                        htmlFor="autoValidation"
                                        className="font-medium text-gray-700"
                                    >
                                        Validation automatique
                                    </label>
                                    <p className="text-gray-500">
                                        Sélectionne automatiquement la première
                                        suggestion de classification.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        type="checkbox"
                                        id="rgpdDetectionEnabled"
                                        name="rgpdDetectionEnabled"
                                        checked={settings.rgpdDetectionEnabled}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-education-600 border-gray-300 rounded focus:ring-education-500"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label
                                        htmlFor="rgpdDetectionEnabled"
                                        className="font-medium text-gray-700"
                                    >
                                        Détection RGPD
                                    </label>
                                    <p className="text-gray-500">
                                        Active la détection des termes sensibles
                                        liés au RGPD dans les documents.
                                    </p>
                                </div>
                            </div>

                            {/* Ajouter d'autres options de classification ici si nécessaire */}
                        </div>
                    </div>
                )}

                {/* Onglet Commandes */}
                {activeTab === "commands" && (
                    <div>
                        <h2 className="text-lg font-medium text-gray-900 mb-3">
                            Génération de commandes
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        type="checkbox"
                                        id="commandValidationEnabled"
                                        name="commandValidationEnabled"
                                        checked={
                                            settings.commandValidationEnabled
                                        }
                                        onChange={handleChange}
                                        className="h-4 w-4 text-education-600 border-gray-300 rounded focus:ring-education-500"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label
                                        htmlFor="commandValidationEnabled"
                                        className="font-medium text-gray-700"
                                    >
                                        Validation des commandes
                                    </label>
                                    <p className="text-gray-500">
                                        Vérifie la sécurité des commandes Linux
                                        générées avant de les afficher.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="defaultNamingPattern"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Modèle de nommage par défaut
                                </label>
                                <input
                                    type="text"
                                    id="defaultNamingPattern"
                                    name="defaultNamingPattern"
                                    value={settings.defaultNamingPattern}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-education-500 focus:ring-education-500"
                                    placeholder="YYYY-MM-DD_Nom_Description_v1"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Format de nommage des fichiers. Utilisez
                                    YYYY-MM-DD pour la date.
                                </p>
                            </div>

                            <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-md">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="h-5 w-5 text-blue-400"
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
                                        <h3 className="text-sm font-medium text-blue-800">
                                            Variables de modèle
                                        </h3>
                                        <div className="mt-2 text-sm text-blue-700">
                                            <ul className="list-disc pl-5">
                                                <li>
                                                    YYYY-MM-DD - Date au format
                                                    année-mois-jour
                                                </li>
                                                <li>
                                                    Nom - Nom du document ou
                                                    sujet principal
                                                </li>
                                                <li>
                                                    Description - Description
                                                    brève ou précision
                                                </li>
                                                <li>v1 - Numéro de version</li>
                                                <li>
                                                    INITIALES - Remplacé par vos
                                                    initiales si définies
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Onglet Données */}
                {activeTab === "data" && (
                    <div>
                        <h2 className="text-lg font-medium text-gray-900 mb-3">
                            Exportation et importation
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-md font-medium text-gray-800 mb-2">
                                    Paramètres
                                </h3>
                                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-education-500"
                                        onClick={() => {
                                            const dataStr = JSON.stringify(
                                                settings,
                                                null,
                                                2
                                            );
                                            const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

                                            const exportFileDefaultName = `classifieur-settings-${new Date().toISOString().slice(0, 10)}.json`;

                                            const linkElement =
                                                document.createElement("a");
                                            linkElement.setAttribute(
                                                "href",
                                                dataUri
                                            );
                                            linkElement.setAttribute(
                                                "download",
                                                exportFileDefaultName
                                            );
                                            linkElement.click();
                                        }}
                                    >
                                        <svg
                                            className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Exporter les paramètres
                                    </button>

                                    <div className="relative">
                                        <label
                                            htmlFor="importSettings"
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-education-500 cursor-pointer"
                                        >
                                            <svg
                                                className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 8.586V16a1 1 0 11-2 0V8.586l-1.293 1.293a1 1 0 01-1.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            Importer les paramètres
                                        </label>
                                        <input
                                            type="file"
                                            id="importSettings"
                                            accept=".json"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader =
                                                        new FileReader();
                                                    reader.onload = (event) => {
                                                        try {
                                                            const importedSettings =
                                                                JSON.parse(
                                                                    event.target
                                                                        .result
                                                                );
                                                            setSettings(
                                                                importedSettings
                                                            );

                                                            setAlert({
                                                                type: "success",
                                                                message:
                                                                    "Paramètres importés avec succès. N'oubliez pas de les enregistrer !",
                                                            });
                                                        } catch (err) {
                                                            setAlert({
                                                                type: "error",
                                                                message: `Erreur lors de l'importation des paramètres: ${err.message}`,
                                                            });
                                                        }
                                                    };
                                                    reader.readAsText(file);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-md font-medium text-gray-800 mb-2">
                                    Historique
                                </h3>
                                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-education-500"
                                        onClick={exportHistory}
                                    >
                                        <svg
                                            className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Exporter l'historique
                                    </button>

                                    <button
                                        type="button"
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-education-500"
                                        onClick={async () => {
                                            try {
                                                // Importer dynamiquement le service
                                                const { clearHistory } =
                                                    await import(
                                                        "../services/indexedDBService"
                                                    );

                                                if (
                                                    window.confirm(
                                                        "Êtes-vous sûr de vouloir effacer tout l'historique ? Cette action est irréversible."
                                                    )
                                                ) {
                                                    await clearHistory();

                                                    setAlert({
                                                        type: "success",
                                                        message:
                                                            "Historique effacé avec succès.",
                                                    });
                                                }
                                            } catch (err) {
                                                setAlert({
                                                    type: "error",
                                                    message: `Erreur lors de l'effacement de l'historique: ${err.message}`,
                                                });
                                            }
                                        }}
                                    >
                                        <svg
                                            className="-ml-1 mr-2 h-5 w-5 text-red-500"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Effacer l'historique
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                                <h3 className="text-md font-medium text-gray-800 mb-2">
                                    Informations sur le stockage local
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Toutes les données sont stockées localement
                                    dans votre navigateur via IndexedDB et
                                    localStorage. Aucune donnée n'est envoyée à
                                    un serveur externe, conformément aux
                                    exigences RGPD.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white p-3 rounded border border-gray-300">
                                        <h4 className="font-medium text-sm text-gray-700">
                                            Paramètres (localStorage)
                                        </h4>
                                        <p className="text-xs text-gray-500">
                                            URLs des arborescences, préférences
                                            utilisateur, options d'affichage
                                        </p>
                                    </div>

                                    <div className="bg-white p-3 rounded border border-gray-300">
                                        <h4 className="font-medium text-sm text-gray-700">
                                            Historique (IndexedDB)
                                        </h4>
                                        <p className="text-xs text-gray-500">
                                            Opérations de classification,
                                            commandes générées, métadonnées des
                                            documents
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Boutons d'action */}
            <div className="mt-8 flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-education-500"
                >
                    Réinitialiser
                </button>

                <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-education-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-education-500 ${
                        isSaving
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-education-700"
                    }`}
                >
                    {isSaving ? (
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
                            Enregistrement...
                        </>
                    ) : (
                        "Enregistrer"
                    )}
                </button>
            </div>
        </div>
    );
};

export default Settings;
