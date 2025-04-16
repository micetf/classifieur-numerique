// src/pages/Settings/components/SettingsField.jsx
import React from "react";
import PropTypes from "prop-types";

/**
 * Composant réutilisable pour un champ de paramètre
 * Gère l'affichage des champs checkbox, select et text avec leurs labels et descriptions
 */
const SettingsField = ({
    type = "text",
    id,
    name,
    label,
    description,
    value,
    onChange,
    placeholder,
    options = [],
    className = "",
    children,
    ...props
}) => {
    // Rendu d'un champ checkbox
    if (type === "checkbox") {
        return (
            <div className={`flex items-start ${className}`}>
                <div className="flex items-center h-5">
                    <input
                        type="checkbox"
                        id={id}
                        name={name}
                        checked={value}
                        onChange={onChange}
                        className="h-4 w-4 text-education-600 border-gray-300 rounded focus:ring-education-500"
                        {...props}
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor={id} className="font-medium text-gray-700">
                        {label}
                    </label>
                    {description && (
                        <p className="text-gray-500">{description}</p>
                    )}
                </div>
            </div>
        );
    }

    // Rendu d'un champ select
    if (type === "select") {
        return (
            <div className={className}>
                <label
                    htmlFor={id}
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    {label}
                </label>
                <select
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-education-500 focus:ring-education-500"
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {description && (
                    <p className="mt-1 text-xs text-gray-500">{description}</p>
                )}
            </div>
        );
    }

    // Rendu pour un champ texte par défaut
    return (
        <div className={className}>
            <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-700 mb-1"
            >
                {label}
            </label>
            <div className="flex">
                <input
                    type={type}
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-education-500 focus:ring-education-500"
                    {...props}
                />
                {children}
            </div>
            {description && (
                <p className="mt-1 text-xs text-gray-500">{description}</p>
            )}
        </div>
    );
};

SettingsField.propTypes = {
    type: PropTypes.string,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.number,
    ]),
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ),
    className: PropTypes.string,
    children: PropTypes.node,
};

export default SettingsField;
