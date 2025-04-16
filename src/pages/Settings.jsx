import React, { useState, useEffect } from "react";
import { useAlerts } from "../contexts/alerts";
import { settingsService } from "../services/settingsService";
import Icon from "../components/ui/Icon.jsx";

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

    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("general");

    // Utiliser le contexte d'alertes
    const { showSuccess, showError, showWarning } = useAlerts();

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

            showSuccess("Les paramètres ont été enregistrés avec succès.");

            // Propager les changements à l'application
            window.dispatchEvent(
                new CustomEvent("settings-updated", {
                    detail: { settings },
                })
            );
        } catch (err) {
            showError(
                `Erreur lors de l'enregistrement des paramètres: ${err.message}`
            );
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

                showSuccess(
                    "Les paramètres ont été réinitialisés avec succès."
                );

                // Propager les changements
                window.dispatchEvent(
                    new CustomEvent("settings-updated", {
                        detail: { settings: defaultSettings },
                    })
                );
            } catch (err) {
                showError(
                    `Erreur lors de la réinitialisation des paramètres: ${err.message}`
                );
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
            showWarning(
                `Aucune URL définie pour l'arborescence ${type === "cpc" ? "CPC" : "personnelle"}.`
            );
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

            showSuccess(
                `L'URL de l'arborescence ${type === "cpc" ? "CPC" : "personnelle"} est valide et accessible.`
            );
        } catch (err) {
            showError(`Erreur lors du test de l'URL: ${err.message}`);
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
                showWarning("Aucun élément dans l'historique à exporter.");
                return;
            }

            const dataStr = JSON.stringify(historyItems, null, 2);
            const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

            const exportFileDefaultName = `classifieur-history-${new Date().toISOString().slice(0, 10)}.json`;

            const linkElement = document.createElement("a");
            linkElement.setAttribute("href", dataUri);
            linkElement.setAttribute("download", exportFileDefaultName);
            linkElement.click();

            showSuccess(
                `${historyItems.length} éléments d'historique exportés avec succès.`
            );
        } catch (err) {
            showError(
                `Erreur lors de l'exportation de l'historique: ${err.message}`
            );
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Paramètres
            </h1>

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
                                        <Icon
                                            name="warning"
                                            className="h-5 w-5 text-yellow-400"
                                        />
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
                                        <Icon
                                            name="info"
                                            className="h-5 w-5 text-blue-400"
                                        />
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
                                        <Icon
                                            name="download"
                                            className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                                        />
                                        Exporter les paramètres
                                    </button>

                                    <div className="relative">
                                        <label
                                            htmlFor="importSettings"
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-education-500 cursor-pointer"
                                        >
                                            <Icon
                                                name="upload"
                                                className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                                            />
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

                                                            showSuccess(
                                                                "Paramètres importés avec succès. N'oubliez pas de les enregistrer !"
                                                            );
                                                        } catch (err) {
                                                            showError(
                                                                `Erreur lors de l'importation des paramètres: ${err.message}`
                                                            );
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
                                        <Icon
                                            name="download"
                                            className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                                        />
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

                                                    showSuccess(
                                                        "Historique effacé avec succès."
                                                    );
                                                }
                                            } catch (err) {
                                                showError(
                                                    `Erreur lors de l'effacement de l'historique: ${err.message}`
                                                );
                                            }
                                        }}
                                    >
                                        <Icon
                                            name="delete"
                                            className="-ml-1 mr-2 h-5 w-5 text-red-500"
                                        />
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
                    <Icon
                        name="refresh"
                        className="-ml-1 mr-2 h-4 w-4 text-gray-500"
                    />
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
                            <Icon
                                name="loading"
                                className="-ml-1 mr-2 h-4 w-4 text-white"
                            />
                            Enregistrement...
                        </>
                    ) : (
                        <>
                            <Icon
                                name="save"
                                className="-ml-1 mr-2 h-4 w-4 text-white"
                            />
                            Enregistrer
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Settings;
