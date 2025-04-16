// src/pages/Settings/Settings.jsx
import React, { useState, useEffect } from "react";
import { settingsService } from "../../services/settingsService";
import { useAlerts } from "../../contexts/alerts";

// Import des onglets
import GeneralTab from "./tabs/GeneralTab";
import ArborescenceTab from "./tabs/ArborescenceTab";
import ClassificationTab from "./tabs/ClassificationTab";
import CommandsTab from "./tabs/CommandsTab";
import DataTab from "./tabs/DataTab";
import Icon from "../../components/ui/Icon";

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
    const { showSuccess, showError } = useAlerts();

    // Charger les paramètres depuis le localStorage au chargement
    useEffect(() => {
        const savedSettings = settingsService.getSettings();
        setSettings(savedSettings);
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
            settingsService.updateSettings(settings);
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
            settingsService.updateSettings(defaultSettings);
            showSuccess("Les paramètres ont été réinitialisés avec succès.");

            // Propager les changements
            window.dispatchEvent(
                new CustomEvent("settings-updated", {
                    detail: { settings: defaultSettings },
                })
            );
        }
    };

    // Composant de navigation par onglets
    const renderTabNav = () => (
        <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                    onClick={() => setActiveTab("general")}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "general"
                            ? "border-education-500 text-education-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                    aria-current={activeTab === "general" ? "page" : undefined}
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
                    aria-current={activeTab === "commands" ? "page" : undefined}
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
    );

    // Rendu du contenu de l'onglet actif
    const renderActiveTab = () => {
        switch (activeTab) {
            case "general":
                return (
                    <GeneralTab settings={settings} onChange={handleChange} />
                );
            case "arborescence":
                return (
                    <ArborescenceTab
                        settings={settings}
                        onChange={handleChange}
                    />
                );
            case "classification":
                return (
                    <ClassificationTab
                        settings={settings}
                        onChange={handleChange}
                    />
                );
            case "commands":
                return (
                    <CommandsTab settings={settings} onChange={handleChange} />
                );
            case "data":
                return <DataTab />;
            default:
                return (
                    <GeneralTab settings={settings} onChange={handleChange} />
                );
        }
    };

    // Boutons d'action
    const renderActionButtons = () => (
        <div className="mt-8 flex justify-end space-x-3">
            <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-education-500"
            >
                <Icon name="reset" className="h-4 w-4 mr-2" />
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
                            className="h-4 w-4 mr-2 animate-spin"
                        />
                        Enregistrement...
                    </>
                ) : (
                    <>
                        <Icon name="save" className="h-4 w-4 mr-2" />
                        Enregistrer
                    </>
                )}
            </button>
        </div>
    );

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Paramètres
            </h1>

            {/* Navigation par onglets */}
            {renderTabNav()}

            {/* Contenu des onglets */}
            <div className="space-y-6">{renderActiveTab()}</div>

            {/* Boutons d'action */}
            {renderActionButtons()}
        </div>
    );
};

export default Settings;
