import { useCallback } from "react";
import DOMPurify from "dompurify";

export const useCommandGenerator = () => {
    /**
     * Génère des commandes Linux pour créer le dossier et déplacer le fichier
     * @param {string} targetPath - Chemin cible dans l'arborescence
     * @param {string} sourceFileName - Nom du fichier source
     * @param {string} targetFileName - Nom du fichier cible (peut être le même que source)
     * @returns {string} Commandes Linux générées avec commentaires
     */
    const generateCommand = useCallback(
        (targetPath, sourceFileName, targetFileName) => {
            // Sanitiser les entrées
            const sanitizedPath = DOMPurify.sanitize(targetPath);
            const sanitizedSource = DOMPurify.sanitize(sourceFileName);
            let sanitizedTarget = DOMPurify.sanitize(
                targetFileName || sourceFileName
            );

            // Si aucun nom cible n'est fourni, créer un nom basé sur la date
            if (!targetFileName) {
                const today = new Date();
                const dateStr = today
                    .toISOString()
                    .slice(0, 10)
                    .replace(/-/g, "-");
                const baseName = sourceFileName
                    .split(".")
                    .slice(0, -1)
                    .join(".");
                const extension = sourceFileName.split(".").pop();

                sanitizedTarget = `${dateStr}_${baseName}_v1.${extension}`;
            }

            // Échapper les caractères spéciaux pour la ligne de commande
            const escapePath = (path) => `"${path.replace(/"/g, '\\"')}"`;
            const escapedPath = escapePath(sanitizedPath);
            const escapedSource = escapePath(sanitizedSource);
            const escapedTarget = escapePath(
                `${sanitizedPath}/${sanitizedTarget}`
            );

            // Construire les commandes
            let commands = [];

            // Commande pour créer le dossier
            commands.push(`# Création dossier cible (si nécessaire)`);
            commands.push(`mkdir -p ${escapedPath}`);
            commands.push(``);

            // Commande pour déplacer et renommer le fichier
            commands.push(`# Déplacement et renommage CRCN`);
            commands.push(`mv -v ${escapedSource} ${escapedTarget}`);

            return commands.join("\n");
        },
        []
    );

    /**
     * Valide une commande Linux pour s'assurer qu'elle est sécurisée
     * @param {string} command - Commande à valider
     * @returns {object} Résultat de la validation avec messages d'erreur si nécessaire
     */
    const validateCommand = useCallback((command) => {
        const dangerousPatterns = [
            /rm\s+(-rf?|--force)\s+/i, // Commandes de suppression forcée
            />\s*\/dev\//i, // Écriture dans /dev
            />\s*\/etc\//i, // Écriture dans /etc
            /;\s*rm/i, // Chaînage avec suppression
            /&\s*rm/i, // Chaînage avec suppression
            /|\s*rm/i, // Pipe vers suppression
            /sudo/i, // Commandes sudo
            /su\s+-/i, // Switch user
            /chmod\s+777/i, // Permissions trop ouvertes
            /dd\s+if=/i, // dd commande
            /:(){ :|:& };:/i, // Fork bomb
        ];

        const errors = [];

        // Vérifier la présence de patterns dangereux
        dangerousPatterns.forEach((pattern) => {
            if (pattern.test(command)) {
                errors.push(
                    `La commande contient un motif potentiellement dangereux: ${pattern}`
                );
            }
        });

        // Vérifier que seules mkdir et mv sont utilisées
        const commandsUsed = command.match(/^\s*([a-z]+)\s+/gm) || [];
        const allowedCommands = ["mkdir", "mv", "#"];

        commandsUsed.forEach((cmd) => {
            const trimmedCmd = cmd.trim();
            if (
                !allowedCommands.some((allowed) =>
                    trimmedCmd.startsWith(allowed)
                )
            ) {
                errors.push(`Commande non autorisée: ${trimmedCmd}`);
            }
        });

        return {
            isValid: errors.length === 0,
            errors,
        };
    }, []);

    /**
     * Génère une commande Linux complète avec validation
     * @param {string} targetPath - Chemin cible
     * @param {string} sourceFileName - Nom du fichier source
     * @param {string} targetFileName - Nom du fichier cible
     * @returns {object} Commande générée et résultat de validation
     */
    const generateAndValidateCommand = useCallback(
        (targetPath, sourceFileName, targetFileName) => {
            const command = generateCommand(
                targetPath,
                sourceFileName,
                targetFileName
            );
            const validation = validateCommand(command);

            return {
                command,
                validation,
            };
        },
        [generateCommand, validateCommand]
    );

    return {
        generateCommand,
        validateCommand,
        generateAndValidateCommand,
    };
};

export default useCommandGenerator;
