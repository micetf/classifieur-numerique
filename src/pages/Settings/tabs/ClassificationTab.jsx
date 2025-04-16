// src/pages/Settings/tabs/ClassificationTab.jsx

import React from "react";
import PropTypes from "prop-types";
import SettingsTab from "../components/SettingsTab";
import SettingsField from "../components/SettingsField";

/**
 * Onglet de configuration des options de classification.
 * @param {Object} props
 * @param {Object} props.settings - Les paramètres actuels
 * @param {Function} props.onChange - Callback de modification d'un paramètre
 */
const ClassificationTab = ({ settings, onChange }) => {
    return (
        <SettingsTab title="Classification">
            <SettingsField
                label="Enregistrement automatique de l'historique"
                description="Enregistre toutes les opérations de classification dans l'historique."
            >
                <input
                    type="checkbox"
                    name="autoSaveHistory"
                    checked={settings.autoSaveHistory}
                    onChange={onChange}
                    className="form-checkbox h-5 w-5 text-education-600"
                />
            </SettingsField>

            <SettingsField
                label="Validation automatique"
                description="Sélectionne automatiquement la première suggestion de classification."
            >
                <input
                    type="checkbox"
                    name="autoValidation"
                    checked={settings.autoValidation}
                    onChange={onChange}
                    className="form-checkbox h-5 w-5 text-education-600"
                />
            </SettingsField>

            <SettingsField
                label="Détection RGPD"
                description="Active la détection des termes sensibles liés au RGPD dans les documents."
            >
                <input
                    type="checkbox"
                    name="rgpdDetectionEnabled"
                    checked={settings.rgpdDetectionEnabled}
                    onChange={onChange}
                    className="form-checkbox h-5 w-5 text-education-600"
                />
            </SettingsField>

            <SettingsField
                label="Validation des commandes"
                description="Vérifie la sécurité des commandes Linux générées avant de les afficher."
            >
                <input
                    type="checkbox"
                    name="commandValidationEnabled"
                    checked={settings.commandValidationEnabled}
                    onChange={onChange}
                    className="form-checkbox h-5 w-5 text-education-600"
                />
            </SettingsField>
        </SettingsTab>
    );
};

ClassificationTab.propTypes = {
    settings: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default ClassificationTab;
