export const formatDate = (dateString, options = {}) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short",
        ...options,
    }).format(date);
};

export const getDateForFilename = () => {
    const today = new Date();
    return today.toISOString().slice(0, 10).replace(/-/g, "-");
};
