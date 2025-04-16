# Classifieur Numérique CPC-NE

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

> Application web pour le classement intelligent des documents pédagogiques selon l'arborescence CPC ou personnelle.

## 🚀 Présentation

Le **Classifieur Numérique CPC-NE** est un outil développé spécifiquement pour les Conseillers Pédagogiques de Circonscription chargés du Numérique Éducatif (CPC-NE). Il permet d'organiser efficacement les documents pédagogiques en :

1. Analysant automatiquement le contenu ou la description des documents
2. Proposant un classement dans l'arborescence officielle ou personnelle
3. Générant les commandes Linux sécurisées pour le rangement des fichiers

Cette application répond aux exigences du CRCN (Cadre de Référence des Compétences Numériques) et respecte les normes RGPD.

## ✨ Fonctionnalités

- 📄 **Upload de documents** (PDF, ODT) ou saisie de descriptions textuelles
- 🔍 **Classification intelligente** basée sur des patterns et mots-clés pédagogiques
- 🌳 **Support multiple d'arborescences** (CPC officielle et personnelle)
- 🖥️ **Génération de commandes Linux** pédagogiques et sécurisées
- 📝 **Historique des opérations** sauvegardé localement
- 🔒 **Détection RGPD** pour les contenus sensibles
- 📱 **Progressive Web App** fonctionnant hors-ligne

## 🛠️ Technologies

- **Frontend**: React 19, Tailwind CSS 4, React Router DOM
- **Stockage**: IndexedDB (local, sans serveur)
- **Build**: Vite 5
- **Sécurité**: DOMPurify, validation des commandes
- **Accessibilité**: Conforme RGAA niveau AA

## 📦 Installation

```bash
# Cloner le dépôt
git clone https://github.com/[user]/classifieur-numerique.git

# Installer les dépendances
cd classifieur-numerique
npm install

# Lancer en développement
npm run dev

# Construire pour production
npm run build
```

Pour des instructions détaillées, consultez notre [Guide d'installation](./INSTALLATION.md).

## 📝 Utilisation

1. **Sélectionnez l'arborescence** à utiliser (CPC ou Personnelle)
2. **Choisissez la méthode d'entrée**:
    - Upload d'un document (PDF/ODT)
    - Description textuelle
3. **Validez ou ajustez** la classification proposée
4. **Générez et copiez** les commandes Linux
5. **Exécutez** ces commandes pour ranger votre document

## 🧩 Structure du projet

```
classifieur-numerique/
├── src/
│   ├── components/         # Composants React
│   ├── hooks/              # Hooks personnalisés
│   ├── services/           # Services (arborescence, IndexedDB)
│   ├── constants/          # Constantes et règles
│   ├── pages/              # Pages de l'application
│   └── utils/              # Fonctions utilitaires
├── public/                 # Fichiers statiques
└── ...
```

## 📋 Conformité

- ✅ **RGAA**: Niveau AA (Accessibilité)
- ✅ **RGPD**: Traitement local des données
- ✅ **CRCN**: Aligné sur les domaines de compétences numériques
- ✅ **Éduscol**: Format de documentation conforme
- ✅ **NF Z44-022**: Standard d'archivage

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à:

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Committer vos changements (`git commit -am 'Ajout de fonctionnalité X'`)
4. Push (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request

## 📜 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Contact

Pour toute question ou suggestion, contactez l'équipe CPC-NE Ardèche.
