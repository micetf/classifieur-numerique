import React, { useState } from "react";
import PropTypes from "prop-types";
import Alert from "../ui/Alert";

/**
 * Composant de formulaire pour saisir une description textuelle
 */
const DescriptionForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        description: "",
        documentType: "document",
        cycle: "",
        matiere: "",
    });

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Options pour les types de documents
    const documentTypes = [
        { id: "document", label: "Document pédagogique" },
        { id: "sequence", label: "Séquence pédagogique" },
        { id: "projet", label: "Projet numérique" },
        { id: "formation", label: "Formation enseignants" },
        { id: "ressource", label: "Ressource numérique" },
        { id: "tutoriel", label: "Tutoriel" },
        { id: "autre", label: "Autre" },
    ];

    // Options pour les cycles
    const cycles = [
        { id: "", label: "Sélectionnez un cycle (optionnel)" },
        { id: "cycle1", label: "Cycle 1 (Maternelle)" },
        { id: "cycle2", label: "Cycle 2 (CP, CE1, CE2)" },
        { id: "cycle3", label: "Cycle 3 (CM1, CM2, 6e)" },
        { id: "cycle4", label: "Cycle 4 (5e, 4e, 3e)" },
        { id: "tous", label: "Tous cycles" },
    ];

    // Options pour les matières
    const matieres = [
        { id: "", label: "Sélectionnez une matière (optionnel)" },
        { id: "francais", label: "Français" },
        { id: "mathematiques", label: "Mathématiques" },
        { id: "sciences", label: "Sciences et Technologie" },
        { id: "histgeo", label: "Histoire-Géographie" },
        { id: "langues", label: "Langues Vivantes" },
        { id: "arts", label: "Arts" },
        { id: "eps", label: "EPS" },
        { id: "emi", label: "Éducation aux Médias et à l'Information" },
        { id: "numerique", label: "Numérique éducatif" },
        { id: "autre", label: "Autre" },
    ];

    /**
     * Gestionnaire de changement des champs du formulaire
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Réinitialiser l'erreur lorsque l'utilisateur modifie le champ en erreur
        if (name === "description" && error) {
            setError(null);
        }
    };

    /**
     * Gestionnaire de soumission du formulaire
     */
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!formData.description.trim()) {
            setError("Veuillez saisir une description.");
            return;
        }

        setIsLoading(true);

        try {
            // Construire une description enrichie avec les métadonnées
            let enrichedDescription = formData.description;

            if (formData.documentType) {
                const typeLabel =
                    documentTypes.find(
                        (type) => type.id === formData.documentType
                    )?.label || formData.documentType;
                enrichedDescription = `Type: ${typeLabel}\n${enrichedDescription}`;
            }

            if (formData.cycle) {
                const cycleLabel =
                    cycles.find((cycle) => cycle.id === formData.cycle)
                        ?.label || formData.cycle;
                enrichedDescription = `${enrichedDescription}\nCycle: ${cycleLabel}`;
            }

            if (formData.matiere) {
                const matiereLabel =
                    matieres.find((matiere) => matiere.id === formData.matiere)
                        ?.label || formData.matiere;
                enrichedDescription = `${enrichedDescription}\nMatière: ${matiereLabel}`;
            }

            onSubmit({
                ...formData,
                description: enrichedDescription,
            });
        } catch (err) {
            setError(
                `Erreur lors du traitement de la description: ${err.message}`
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">
                Description du document
            </h2>

            {error && (
                <Alert
                    message={error}
                    type="error"
                    onClose={() => setError(null)}
                    className="mb-4"
                />
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 mb-6">
                    {/* Type de document */}
                    <div>
                        <label
                            htmlFor="documentType"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Type de document
                        </label>
                        <select
                            id="documentType"
                            name="documentType"
                            value={formData.documentType}
                            onChange={handleChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-education-500 focus:ring-education-500"
                        >
                            {documentTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Description détaillée{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={6}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Décrivez le contenu du document, ses objectifs, son contexte d'utilisation, etc."
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-education-500 focus:ring-education-500"
                            required
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Plus votre description sera détaillée, plus le
                            classement proposé sera pertinent.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Cycle */}
                        <div>
                            <label
                                htmlFor="cycle"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Cycle scolaire
                            </label>
                            <select
                                id="cycle"
                                name="cycle"
                                value={formData.cycle}
                                onChange={handleChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-education-500 focus:ring-education-500"
                            >
                                {cycles.map((cycle) => (
                                    <option key={cycle.id} value={cycle.id}>
                                        {cycle.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Matière */}
                        <div>
                            <label
                                htmlFor="matiere"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Matière
                            </label>
                            <select
                                id="matiere"
                                name="matiere"
                                value={formData.matiere}
                                onChange={handleChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-education-500 focus:ring-education-500"
                            >
                                {matieres.map((matiere) => (
                                    <option key={matiere.id} value={matiere.id}>
                                        {matiere.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-education-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-education-500 ${
                            isLoading
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-education-700"
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Traitement...
                            </>
                        ) : (
                            "Analyser"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

DescriptionForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

export default DescriptionForm;
