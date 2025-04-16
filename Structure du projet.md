# Structure du projet Classifieur Numérique

```
classifieur-numerique/
├── src/
│   ├── App.jsx                   # Point d'entrée principal
│   ├── main.jsx                  # Initialisation de React
│   ├── components/               # Composants réutilisables
│   │   ├── ui/                   # Composants UI génériques
│   │   │   ├── Button.jsx
│   │   │   ├── Alert.jsx
│   │   │   ├── Dropdown.jsx
│   │   │   └── ...
│   │   ├── layout/               # Composants de mise en page
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Footer.jsx
│   │   └── features/             # Composants spécifiques aux fonctionnalités
│   │       ├── DocumentUpload.jsx
│   │       ├── DescriptionForm.jsx
│   │       ├── ClassificationResult.jsx
│   │       ├── CommandGenerator.jsx
│   │       └── ...
│   ├── hooks/                    # Custom hooks
│   │   ├── useArborescence.js    # Gestion des arborescences
│   │   ├── useClassifier.js      # Logique de classification
│   │   └── useCommandGenerator.js # Génération des commandes Linux
│   ├── services/                 # Services et API
│   │   ├── arborescenceLoader.js # Chargement des arborescences depuis GitHub
│   │   ├── documentAnalyzer.js   # Analyse des documents
│   │   ├── rgpdValidator.js      # Validation RGPD
│   │   └── indexedDBService.js   # Gestion de l'historique local
│   ├── utils/                    # Fonctions utilitaires
│   │   ├── fileHelpers.js        # Gestion des fichiers
│   │   ├── dateFormatter.js      # Formatage des dates
│   │   ├── sanitizer.js          # Nettoyage des entrées (DOMPurify)
│   │   └── patternMatcher.js     # Détection de patterns dans les documents
│   ├── constants/                # Constantes et configurations
│   │   ├── patternRules.js       # Règles de classification
│   │   ├── rgpdKeywords.js       # Mots-clés RGPD
│   │   └── crcnDomains.js        # Domaines CRCN
│   ├── context/                  # Contextes React
│   │   ├── ArborescenceContext.jsx # Contexte pour les arborescences
│   │   └── HistoryContext.jsx    # Contexte pour l'historique
│   ├── pages/                    # Pages de l'application
│   │   ├── Home.jsx              # Page d'accueil
│   │   ├── Classification.jsx    # Page de classification
│   │   ├── Settings.jsx          # Page de paramètres
│   │   └── History.jsx           # Page d'historique
│   ├── assets/                   # Ressources statiques
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/
│   └── config/                   # Configurations de l'application
│       └── routes.jsx            # Configuration des routes
└── public/                       # Fichiers publics
    ├── favicon.ico
    ├── manifest.json             # Manifest pour PWA
    ├── robots.txt
    └── service-worker.js         # Service worker pour PWA
```

## Organisation des fonctionnalités principales

### 1. Module de classification

- `DocumentUpload.jsx` : Interface d'upload de fichiers
- `DescriptionForm.jsx` : Formulaire pour saisir une description
- `documentAnalyzer.js` : Service d'analyse de documents
- `patternMatcher.js` : Utilitaire de détection de patterns
- `ClassificationResult.jsx` : Affichage des résultats de classification

### 2. Gestion des arborescences

- `arborescenceLoader.js` : Service de chargement depuis GitHub
- `useArborescence.js` : Hook personnalisé pour la gestion des arborescences
- `ArborescenceContext.jsx` : Contexte pour partager l'état des arborescences

### 3. Générateur de commandes Linux

- `CommandGenerator.jsx` : Interface de génération de commandes
- `useCommandGenerator.js` : Hook pour la logique de génération
- `CommandPreview.jsx` : Affichage et copie des commandes générées

### 4. Stockage local

- `indexedDBService.js` : Service de gestion d'IndexedDB
- `HistoryContext.jsx` : Contexte pour l'historique des opérations
- `History.jsx` : Page d'affichage de l'historique
