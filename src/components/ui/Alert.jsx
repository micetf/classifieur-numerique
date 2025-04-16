import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import Icon from "./Icon";

const ALERT_STYLES = {
    info: {
        container: "bg-blue-50 border-blue-500 text-blue-800",
        icon: "text-blue-500",
        button: "text-blue-500 hover:bg-blue-100",
    },
    success: {
        container: "bg-green-50 border-green-500 text-green-800",
        icon: "text-green-500",
        button: "text-green-500 hover:bg-green-100",
    },
    warning: {
        container: "bg-yellow-50 border-yellow-500 text-yellow-800",
        icon: "text-yellow-500",
        button: "text-yellow-500 hover:bg-yellow-100",
    },
    error: {
        container: "bg-red-50 border-red-500 text-red-800",
        icon: "text-red-500",
        button: "text-red-500 hover:bg-red-100",
    },
};

/**
 * Composant d'alerte pour afficher des messages à l'utilisateur
 */
const Alert = ({
    title,
    message,
    type = "info",
    onClose,
    autoClose = 0,
    className = "",
}) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = useCallback(() => {
        setIsVisible(false);
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    // Fermeture automatique si autoClose > 0
    React.useEffect(() => {
        if (autoClose > 0) {
            const timer = setTimeout(() => {
                handleClose();
            }, autoClose);

            return () => clearTimeout(timer);
        }
    }, [autoClose, handleClose]);

    if (!isVisible) {
        return null;
    }

    // Styles selon le type d'alerte
    const styles = ALERT_STYLES[type] || ALERT_STYLES.info;

    return (
        <div
            className={`border-l-4 p-4 rounded ${styles.container} ${className}`}
            role="alert"
        >
            <div className="flex items-start">
                <div className={`flex-shrink-0 ${styles.icon}`}>
                    <Icon name={type} />
                </div>
                <div className="ml-3">
                    {title && <h3 className="text-lg font-medium">{title}</h3>}
                    <div className="mt-1 text-sm">{message}</div>
                </div>
                <button
                    type="button"
                    className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 ${styles.button} focus:outline-none`}
                    onClick={handleClose}
                    aria-label="Fermer"
                >
                    <Icon name="close" size="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

Alert.propTypes = {
    title: PropTypes.string,
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["info", "success", "warning", "error"]),
    onClose: PropTypes.func,
    autoClose: PropTypes.number,
    className: PropTypes.string,
};

export default Alert;
