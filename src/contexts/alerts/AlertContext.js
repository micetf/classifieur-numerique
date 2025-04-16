import { createContext, useContext } from "react";

// Création du contexte avec une valeur par défaut vide
const AlertContext = createContext({
    addAlert: () => {},
    removeAlert: () => {},
    showSuccess: () => {},
    showError: () => {},
    showWarning: () => {},
    showInfo: () => {},
    clearAlerts: () => {},
});

/**
 * Hook personnalisé pour utiliser le contexte d'alertes
 * @returns {Object} Méthodes et état du contexte d'alertes
 */
export const useAlerts = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error(
            "useAlerts doit être utilisé au sein d'un AlertProvider"
        );
    }
    return context;
};

export default AlertContext;
