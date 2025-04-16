# Guide d'installation et démarrage

Ce guide vous aidera à installer et configurer le Classifieur Numérique CPC-NE sur votre machine.

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés :

- [Node.js](https://nodejs.org/) (version 18 ou supérieure)
- [npm](https://www.npmjs.com/) (généralement installé avec Node.js)
- [Git](https://git-scm.com/) (optionnel, pour le clonage du dépôt)

## Installation

### Étape 1: Cloner ou télécharger le projet

```bash
# Cloner le dépôt avec Git
git clone https://github.com/[user]/classifieur-numerique.git

# Accéder au répertoire du projet
cd classifieur-numerique
```

### Étape 2: Installer les dépendances

```bash
# Installer toutes les dépendances nécessaires
npm install
```

Cette commande va installer toutes les bibliothèques requises, notamment :

- React et React DOM
- React Router
- Tailwind CSS
- DOMPurify
- Autres dépendances

### Étape 3: Configurer les URLs des arborescences

Vous devez configurer les URLs des arborescences dans le fichier `src/services/arborescenceLoader.js` :

```javascript
// URLs des arborescences (à configurer selon votre repository)
const ARBORESCENCE_URLS = {
    cpc: "https://raw.githubusercontent.com/[user]/[repo]/main/arborescence-cpc.json",
    perso: "https://raw.githubusercontent.com/[user]/[repo]/main/arborescence-perso.json",
};
```

Remplacez `[user]` et `[repo]` par les informations correspondant à votre dépôt GitHub.

## Démarrage en développement

Pour lancer l'application en mode développement :

```bash
npm run dev
```

Cette commande démarre un serveur de développement avec rechargement à chaud (hot-reload). L'application sera accessible à l'adresse [http://localhost:5173](http://localhost:5173) par défaut.

## Build pour la production

Pour créer une version optimisée pour la production :

```bash
npm run build
```

Cette commande génère les fichiers optimisés dans le dossier `dist/`. Vous pouvez ensuite déployer ce dossier sur n'importe quel serveur web.

## Prévisualisation de la version de production

Pour prévisualiser localement la version de production :

```bash
npm run preview
```

Cette commande démarre un serveur local pour tester la version de production.

## Structure des arborescences

Les arborescences doivent être au format JSON et suivre cette structure :

```json
{
    "00_Ressources-pedagogiques-numeriques": {
        "ApplicationsEducatives": {
            "Robotique": {
                "Tutoriels": {},
                "Séquences": {}
            }
        }
    },
    "00_Projets-numeriques": {
        "Experimentations": {}
    }
}
```

Vous pouvez également utiliser un format Markdown pour vos arborescences, qui sera automatiquement converti en JSON :

```markdown
00_Ressources-pedagogiques-numeriques
ApplicationsEducatives
Robotique
Tutoriels
Séquences
00_Projets-numeriques
Experimentations
```

## Dépannage

### Erreur "Module not found"

Si vous rencontrez une erreur de type "Module not found", assurez-vous d'avoir exécuté `npm install` et que toutes les dépendances sont correctement installées.

### Problème d'accès aux arborescences

Si l'application ne parvient pas à charger les arborescences depuis GitHub :

1. Vérifiez les URLs dans `arborescenceLoader.js`
2. Assurez-vous que les fichiers JSON sont accessibles publiquement
3. Vérifiez que le format des fichiers est correct

### Problèmes avec IndexedDB

Si l'historique ne fonctionne pas correctement :

1. Ouvrez les outils de développement du navigateur (F12)
2. Accédez à l'onglet "Application" puis "IndexedDB"
3. Vérifiez que la base de données "ClassifieurNumeriqueCPC" existe
4. Si nécessaire, supprimez la base pour la recréer

## Support et contribution

Pour signaler un bug ou proposer une amélioration, veuillez ouvrir une issue sur le dépôt GitHub du projet.
