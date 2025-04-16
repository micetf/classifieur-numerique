// src/pages/Settings/tabs/GeneralTab.jsx
import React from "react";
import PropTypes from "prop-types";
import SettingsTab from "../components/SettingsTab";
import SettingsField from "../components/SettingsField";

const GeneralTab = ({ settings, onChange }) => {
    return (
        <SettingsTab title="Options générales">
            <SettingsField
                type="checkbox"
                id="autoSaveHistory"
                name="autoSaveHistory"
                label="Sauvegarder automatiquement l'historique"
                description="Enregistre toutes les opérations de classification dans l'historique."
                value={settings.autoSaveHistory}
                onChange={onChange}
            />

            <SettingsField
                type="checkbox"
                id="showExplanations"
                name="showExplanations"
                label="Afficher les explications"
                description="Affiche les explications pédagogiques pour les suggestions de classification."
                value={settings.showExplanations}
                onChange={onChange}
            />

            <SettingsField
                type="checkbox"
                id="darkMode"
                name="darkMode"
                label="Mode sombre"
                description="Activer le thème sombre pour l'interface (nécessite un rechargement)."
                value={settings.darkMode}
                onChange={onChange}
            />

            <SettingsField
                type="text"
                id="userNameOrInitials"
                name="userNameOrInitials"
                label="Nom ou initiales"
                description="Ces informations peuvent être utilisées dans le nommage des fichiers."
                value={settings.userNameOrInitials}
                onChange={onChange}
                placeholder="Vos initiales ou nom (optionnel)"
            />
        </SettingsTab>
    );
};

GeneralTab.propTypes = {
    settings: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default GeneralTab;
