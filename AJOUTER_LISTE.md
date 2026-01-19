# Guide d'Ajout de Nouvelle Liste

Ce guide est spécifiquement conçu pour vous aider à ajouter rapidement une nouvelle catégorie de mots au jeu.

## Étape 1 : Créer le fichier de données

1.  Allez dans le dossier `src/data`.
2.  Créez un nouveau fichier `.json`. Par exemple `Sport.json`.
3.  Copiez-collez ce modèle à l'intérieur :

```json
{
    "words": [
        "Football",
        "Tennis",
        "Zinedine Zidane",
        "Paris Saint-Germain"
    ],
    "teamNames": [
        "Les Champions",
        "FC Gagnants",
        "Les Athlètes"
    ]
}
```

## Étape 2 : Connecter la liste au jeu

1.  Ouvrez le fichier `src/utils/gameData.js`.
2.  Ajoutez l'importation tout en haut :
    ```javascript
    import sport from '../data/Sport.json';
    ```
3.  Ajoutez le bloc de configuration dans la liste `CATEGORIES` :
    ```javascript
    sport: { 
        id: 'sport',
        name: "Sport", 
        data: sport.words,             // Référence aux mots
        teamNames: sport.teamNames,    // Référence aux équipes
        color: "from-blue-500 to-blue-700", // Choisissez une couleur
        icon: "⚽"                      // Choisissez un emoji
    },
    ```

**C'est tout !** Votre nouvelle liste est maintenant jouable.
