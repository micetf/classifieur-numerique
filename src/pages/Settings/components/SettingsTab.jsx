// src/pages/Settings/components/SettingsTab.jsx
import React from "react";
import PropTypes from "prop-types";

/**
 * Composant wrapper pour les onglets de paramètres
 * Fournit une structure commune pour tous les onglets
 */
const SettingsTab = ({ title, children, className = "" }) => {
    return (
        <div className={className}>
            <h2 className="text-lg font-medium text-gray-900 mb-3">{title}</h2>
            <div className="space-y-4">{children}</div>
        </div>
    );
};

SettingsTab.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default SettingsTab;
