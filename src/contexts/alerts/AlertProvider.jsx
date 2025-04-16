import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import AlertContext from "./AlertContext";
import Alert from "../../components/ui/Alert";

/**
 * Fournisseur du contexte d'alertes
 */
const AlertProvider = ({ children }) => {
    // État pour stocker les alertes actives
    const [alerts, setAlerts] = useState([]);

    /**
     * Ajoute une nouvelle alerte
     * @param {string} message - Message de l'alerte
     * @param {string} type - Type d'alerte (info, success, warning, error)
     * @param {string} title - Titre de l'alerte (optionnel)
     * @param {number} autoClose - Délai de fermeture automatique en ms (0 pour désactiver)
     * @returns {string} ID de l'alerte
     */
    const addAlert = useCallback(
        (message, type = "info", title = null, autoClose = 5000) => {
            const id = Date.now().toString();

            setAlerts((currentAlerts) => [
                ...currentAlerts,
                { id, message, type, title, autoClose },
            ]);

            return id;
        },
        []
    );

    /**
     * Supprime une alerte par son ID
     * @param {string} id - ID de l'alerte à supprimer
     */
    const removeAlert = useCallback((id) => {
        setAlerts((currentAlerts) =>
            currentAlerts.filter((alert) => alert.id !== id)
        );
    }, []);

    /**
     * Méthodes raccourcies pour les différents types d'alertes
     */
    const showSuccess = useCallback(
        (message, title, autoClose) =>
            addAlert(message, "success", title, autoClose),
        [addAlert]
    );

    const showError = useCallback(
        (message, title, autoClose) =>
            addAlert(message, "error", title, autoClose),
        [addAlert]
    );

    const showWarning = useCallback(
        (message, title, autoClose) =>
            addAlert(message, "warning", title, autoClose),
        [addAlert]
    );

    const showInfo = useCallback(
        (message, title, autoClose) =>
            addAlert(message, "info", title, autoClose),
        [addAlert]
    );

    /**
     * Supprime toutes les alertes
     */
    const clearAlerts = useCallback(() => {
        setAlerts([]);
    }, []);

    // Valeur du contexte à exposer
    const contextValue = {
        addAlert,
        removeAlert,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        clearAlerts,
    };

    return (
        <AlertContext.Provider value={contextValue}>
            {/* Rendu des enfants */}
            {children}

            {/* Rendu des alertes */}
            <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
                {alerts.map((alert) => (
                    <Alert
                        key={alert.id}
                        title={alert.title}
                        message={alert.message}
                        type={alert.type}
                        onClose={() => removeAlert(alert.id)}
                        autoClose={alert.autoClose}
                    />
                ))}
            </div>
        </AlertContext.Provider>
    );
};

AlertProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AlertProvider;
