// src/components/ClassifieurNumerique/ArborescenceSelector.jsx
import React from "react";
import PropTypes from "prop-types";

/**
 * Composant pour sélectionner le type d'arborescence
 */
const ArborescenceSelector = ({ arborescenceType, onArborescenceChange }) => {
    return (
        <div className="flex-1">
            <label
                htmlFor="arborescence-select"
                className="block mb-2 font-medium"
            >
                Sélectionner l'arborescence :
            </label>
            <select
                id="arborescence-select"
                value={arborescenceType}
                onChange={(e) => onArborescenceChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-education-500 focus:border-education-500"
            >
                <option value="cpc">Arborescence CPC</option>
                <option value="perso">Arborescence Personnelle</option>
            </select>
        </div>
    );
};

ArborescenceSelector.propTypes = {
    arborescenceType: PropTypes.string.isRequired,
    onArborescenceChange: PropTypes.func.isRequired,
};

export default ArborescenceSelector;
