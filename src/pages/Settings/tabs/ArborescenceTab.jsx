// src/pages/Settings/tabs/ArborescenceTab.jsx
import React from "react";
import PropTypes from "prop-types";
import { useAlerts } from "../../../contexts/alerts";
import SettingsTab from "../components/SettingsTab";
import SettingsField from "../components/SettingsField";
import Icon from "../../../components/ui/Icon.jsx";

const ArborescenceTab = ({ settings, onChange }) => {
    const { showSuccess, showWarning, showError } = useAlerts();

    /**
     * Teste l'accessibilité d'une URL d'arborescence
     * @param {string} type - Type d'arborescence ('cpc' ou 'perso')
     */
    const testArborescenceUrl = async (type) => {
        const url =
            type === "cpc"
                ? settings.cpcArborescenceUrl
                : settings.persoArborescenceUrl;

        if (!url) {
            showWarning(
                `Aucune URL définie pour l'arborescence ${type === "cpc" ? "CPC" : "personnelle"}.`
            );
            return;
        }

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            // Vérifier que c'est du JSON valide
            const data = await response.json();

            if (typeof data !== "object") {
                throw new Error(
                    "Le fichier ne contient pas un objet JSON valide."
                );
            }

            showSuccess(
                `L'URL de l'arborescence ${type === "cpc" ? "CPC" : "personnelle"} est valide et accessible.`
            );
        } catch (err) {
            showError(`Erreur lors du test de l'URL: ${err.message}`);
        }
    };

    const arborescenceOptions = [
        { value: "cpc", label: "Arborescence CPC" },
        { value: "perso", label: "Arborescence personnelle" },
    ];

    return (
        <SettingsTab title="Configuration des arborescences">
            <SettingsField
                type="select"
                id="defaultArborescence"
                name="defaultArborescence"
                label="Arborescence par défaut"
                description="L'arborescence qui sera sélectionnée par défaut au chargement de l'application."
                value={settings.defaultArborescence}
                onChange={onChange}
                options={arborescenceOptions}
            />

            <SettingsField
                type="text"
                id="cpcArborescenceUrl"
                name="cpcArborescenceUrl"
                label="URL de l'arborescence CPC (GitHub)"
                description="URL du fichier JSON contenant l'arborescence CPC sur GitHub. Laissez vide pour utiliser l'arborescence par défaut."
                value={settings.cpcArborescenceUrl}
                onChange={onChange}
                placeholder="https://raw.githubusercontent.com/[user]/[repo]/main/arborescence-cpc.json"
            >
                <button
                    type="button"
                    onClick={() => testArborescenceUrl("cpc")}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-r-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-education-500"
                >
                    Tester
                </button>
            </SettingsField>

            <SettingsField
                type="text"
                id="persoArborescenceUrl"
                name="persoArborescenceUrl"
                label="URL de l'arborescence personnelle (GitHub)"
                description="URL du fichier JSON contenant votre arborescence personnelle sur GitHub. Laissez vide pour utiliser l'arborescence par défaut."
                value={settings.persoArborescenceUrl}
                onChange={onChange}
                placeholder="https://raw.githubusercontent.com/[user]/[repo]/main/arborescence-perso.json"
            >
                <button
                    type="button"
                    onClick={() => testArborescenceUrl("perso")}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-r-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-education-500"
                >
                    Tester
                </button>
            </SettingsField>

            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <Icon
                            name="warning"
                            className="h-5 w-5 text-yellow-400"
                        />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                            Format attendu des arborescences
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                            <p>
                                Les arborescences doivent être au format JSON
                                structuré hiérarchiquement :
                            </p>
                            <pre className="mt-1 text-xs bg-yellow-100 p-2 rounded overflow-x-auto">
                                {`{
  "00_Dossier1": {
    "Sous-dossier1": {
      "Dossier-enfant": {}
    },
    "Sous-dossier2": {}
  },
  "01_Dossier2": {}
}`}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </SettingsTab>
    );
};

ArborescenceTab.propTypes = {
    settings: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default ArborescenceTab;
