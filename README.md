# MOTS PASSANTS

Bienvenue sur le jeu **Mots Passants** ! Ce projet est une version web moderne et stylée du célèbre jeu "Time's Up".

## 🎮 Comment Jouer ?

1.  **Configuration** :
    *   Choisissez vos équipes (ou utilisez le générateur aléatoire).
    *   Sélectionnez un ou plusieurs thèmes (Geek, Friends, Harry Potter, etc.).
    *   Choisissez la durée de la partie (Nombre de cartes).
2.  **Jeu** :
    *   **Tour 1** : Décrivez le mot sans le prononcer.
    *   **Tour 2** : Un seul mot pour faire deviner.
    *   **Tour 3** : Mimez le mot sans parler.
3.  **But** : Faire deviner le maximum de mots en 30 secondes !

## 🛠️ Ajouter une nouvelle liste de mots

Vous pouvez facilement ajouter vos propres thèmes au jeu. Suivez ces étapes :

### 1. Créer le fichier JSON

Créez un nouveau fichier dans le dossier `src/data/`. Par exemple : `src/data/MaSuperListe.json`.

Le fichier doit respecter ce format exact :

```json
{
  "words": [
    "Mot 1",
    "Mot 2",
    "Mot 3"
  ],
  "teamNames": [
    "Nom d'équipe cool 1",
    "Nom d'équipe cool 2"
  ]
}
```

### 2. Enregistrer la liste dans le jeu

Ouvrez le fichier `src/utils/gameData.js` et suivez ces 3 étapes :

1.  **Importez votre fichier** en haut du fichier :
    ```javascript
    import maSuperListe from '../data/MaSuperListe.json';
    ```

2.  **Ajoutez la configuration** dans l'objet `CATEGORIES` :
    ```javascript
    export const CATEGORIES = {
      // ... autres catégories ...
      maSuperListe: {
        id: 'maSuperListe',       // Identifiant unique
        name: "Ma Super Liste",   // Nom affiché à l'écran
        data: maSuperListe.words, // Lien vers les mots
        teamNames: maSuperListe.teamNames, // Lien vers les noms d'équipes
        color: "from-pink-500 to-rose-500", // Couleurs du dégradé (voir documentation Tailwind CSS)
        icon: "🚀"                // Emoji affiché
      }
    };
    ```

3.  **Sauvegardez !** Le jeu se mettra à jour automatiquement.

## 🚀 Installation & Développement

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Construire pour la production
npm run build
```

Amusez-vous bien ! 🎉
