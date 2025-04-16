export const validateClassifierInput = (content, arborescence) => {
    if (!content || !arborescence) {
        return {
            isValid: false,
            defaultResult: {
                suggestions: [],
                allMatches: [],
                originalContent: content || "",
            },
        };
    }
    return { isValid: true };
};
