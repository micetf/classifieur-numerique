// src/pages/Settings/tabs/CommandsTab.jsx

import React from "react";
import PropTypes from "prop-types";
import SettingsTab from "../components/SettingsTab";
import SettingsField from "../components/SettingsField";

/**
 * Onglet de configuration des options liées aux commandes système
 * @param {Object} props
 * @param {Object} props.settings - Les paramètres actuels
 * @param {Function} props.onChange - Callback de modification d'un paramètre
 */
const CommandsTab = ({ settings, onChange }) => {
    return (
        <SettingsTab title="Commandes système">
            <SettingsField
                label="Validation des commandes"
                description="Vérifie la syntaxe et la sécurité des commandes avant exécution."
            >
                <input
                    type="checkbox"
                    name="commandValidationEnabled"
                    checked={settings.commandValidationEnabled}
                    onChange={onChange}
                    className="form-checkbox h-5 w-5 text-education-600"
                />
            </SettingsField>

            <SettingsField
                label="Historique des commandes"
                description="Conserve un historique des 50 dernières commandes générées."
            >
                <input
                    type="number"
                    name="commandHistorySize"
                    value={settings.commandHistorySize}
                    onChange={onChange}
                    min="0"
                    max="100"
                    className="form-input mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-education-500 focus:ring-education-500"
                />
            </SettingsField>

            <SettingsField
                label="Mode expert"
                description="Affiche les options avancées de personnalisation des commandes."
            >
                <input
                    type="checkbox"
                    name="expertModeEnabled"
                    checked={settings.expertModeEnabled}
                    onChange={onChange}
                    className="form-checkbox h-5 w-5 text-education-600"
                />
            </SettingsField>
        </SettingsTab>
    );
};

CommandsTab.propTypes = {
    settings: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default CommandsTab;
