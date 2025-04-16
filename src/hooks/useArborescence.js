import { useState, useCallback } from "react";
import arborescenceLoader from "../services/arborescenceLoader";

export const useArborescence = () => {
    const [arborescence, setArborescence] = useState(null);
    const [arborescenceType, setArborescenceType] = useState("cpc");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paths, setPaths] = useState([]);

    /**
     * Charge une arborescence depuis GitHub
     * @param {string} type - Type d'arborescence ('cpc' ou 'perso')
     */
    const loadArborescence = useCallback(async (type) => {
        setLoading(true);
        setError(null);

        try {
            const loadedArborescence =
                await arborescenceLoader.loadArborescenceFromGitHub(type);
            setArborescence(loadedArborescence);
            setArborescenceType(type);

            // Générer la liste des chemins complets
            const pathsList =
                arborescenceLoader.hierarchyToPaths(loadedArborescence);
            setPaths(pathsList);
        } catch (err) {
            setError(
                `Erreur lors du chargement de l'arborescence: ${err.message}`
            );

            // Utiliser l'arborescence par défaut en cas d'erreur
            setArborescence(arborescenceLoader.DEFAULT_ARBORESCENCES[type]);

            // Générer la liste des chemins complets depuis l'arborescence par défaut
            const pathsList = arborescenceLoader.hierarchyToPaths(
                arborescenceLoader.DEFAULT_ARBORESCENCES[type]
            );
            setPaths(pathsList);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Change le type d'arborescence et charge la nouvelle
     * @param {string} type - Type d'arborescence ('cpc' ou 'perso')
     */
    const switchArborescenceType = useCallback(
        (type) => {
            if (type !== arborescenceType) {
                loadArborescence(type);
            }
        },
        [arborescenceType, loadArborescence]
    );

    /**
     * Recherche dans l'arborescence selon un terme
     * @param {string} searchTerm - Terme de recherche
     * @returns {array} Chemins correspondants
     */
    const searchInArborescence = useCallback(
        (searchTerm) => {
            if (!searchTerm || !paths.length) return [];

            const searchTermLower = searchTerm.toLowerCase();
            return paths.filter((path) =>
                path.toLowerCase().includes(searchTermLower)
            );
        },
        [paths]
    );

    /**
     * Obtient un sous-arborescence à partir d'un chemin
     * @param {string} path - Chemin dans l'arborescence
     * @returns {object} Sous-arborescence
     */
    const getSubArborescence = useCallback(
        (path) => {
            if (!path || !arborescence) return {};

            const segments = path.split("/");
            let current = arborescence;

            for (const segment of segments) {
                if (current[segment]) {
                    current = current[segment];
                } else {
                    return {};
                }
            }

            return current;
        },
        [arborescence]
    );

    return {
        arborescence,
        arborescenceType,
        loading,
        error,
        paths,
        loadArborescence,
        switchArborescenceType,
        searchInArborescence,
        getSubArborescence,
    };
};

export default useArborescence;
