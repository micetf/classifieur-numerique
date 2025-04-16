import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

/**
 * Composant d'alerte pour afficher des messages à l'utilisateur
 */
const Alert = ({ title, message, type = "info", onClose, autoClose = 0 }) => {
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
    const alertStyles = {
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

    const styles = alertStyles[type] || alertStyles.info;

    // Icônes selon le type d'alerte
    const icons = {
        info: (
            <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                ></path>
            </svg>
        ),
        success: (
            <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                ></path>
            </svg>
        ),
        warning: (
            <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                ></path>
            </svg>
        ),
        error: (
            <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                ></path>
            </svg>
        ),
    };

    return (
        <div
            className={`border-l-4 p-4 mb-4 rounded ${styles.container}`}
            role="alert"
        >
            <div className="flex items-start">
                <div className={`flex-shrink-0 ${styles.icon}`}>
                    {icons[type]}
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
                    <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
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
};

export default Alert;
