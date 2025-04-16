// src/pages/Settings/tabs/DataTab.jsx

import React from "react";
import PropTypes from "prop-types";
import SettingsTab from "../components/SettingsTab";
import SettingsField from "../components/SettingsField";
import Icon from "../../../components/ui/Icon.jsx";

/**
 * Onglet de configuration des paramètres de gestion des données
 * @param {Object} props
 * @param {Object} props.settings - Les paramètres actuels
 * @param {Function} props.onChange - Callback de modification d'un paramètre
 * @param {Function} props.onExport - Callback d'export de l'historique
 */
const DataTab = ({ settings, onChange, onExport }) => {
    return (
        <SettingsTab title="Données">
            <SettingsField
                label="Nom/Initiales utilisateur"
                description="Utilisé pour le nommage des fichiers et l'historique."
            >
                <input
                    type="text"
                    name="userNameOrInitials"
                    value={settings.userNameOrInitials}
                    onChange={onChange}
                    className="form-input mt-1 block w-64 rounded-md border-gray-300 shadow-sm focus:border-education-500 focus:ring-education-500"
                    maxLength="20"
                />
            </SettingsField>

            <SettingsField
                label="Modèle de nommage par défaut"
                description="Variables disponibles : YYYY, MM, DD, Nom, Description"
            >
                <input
                    type="text"
                    name="defaultNamingPattern"
                    value={settings.defaultNamingPattern}
                    onChange={onChange}
                    className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-education-500 focus:ring-education-500"
                />
            </SettingsField>

            <SettingsField
                label="Stockage des données"
                description="Localisation et type de stockage des données utilisateur."
            >
                <div className="mt-1 text-sm text-gray-600">
                    <Icon
                        name="database"
                        className="mr-2 inline-block h-5 w-5"
                    />
                    Stockage local (IndexedDB + localStorage)
                </div>
            </SettingsField>

            <SettingsField
                label="Export des données"
                description="Export complet de l'historique au format JSON."
            >
                <button
                    onClick={onExport}
                    className="inline-flex items-center rounded-md bg-education-600 px-4 py-2 text-sm font-medium text-white hover:bg-education-700 focus:outline-none focus:ring-2 focus:ring-education-500 focus:ring-offset-2"
                >
                    <Icon name="download" className="mr-2 h-5 w-5" />
                    Exporter l'historique
                </button>
            </SettingsField>
        </SettingsTab>
    );
};

DataTab.propTypes = {
    settings: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onExport: PropTypes.func.isRequired,
};

export default DataTab;
