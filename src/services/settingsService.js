// src/services/settingsService.js
export const settingsService = {
    getSettings() {
        try {
            const savedSettings = localStorage.getItem("classifieurSettings");
            return savedSettings ? JSON.parse(savedSettings) : {};
        } catch (error) {
            console.error("Erreur lors du chargement des paramètres:", error);
            return {};
        }
    },

    updateSettings(newSettings) {
        try {
            const currentSettings = this.getSettings();
            const updatedSettings = { ...currentSettings, ...newSettings };
            localStorage.setItem(
                "classifieurSettings",
                JSON.stringify(updatedSettings)
            );
            return true;
        } catch (error) {
            console.error(
                "Erreur lors de la sauvegarde des paramètres:",
                error
            );
            return false;
        }
    },
};
