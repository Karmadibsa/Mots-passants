import geek from '../data/geek.json';
import friends from '../data/friends.json';
import harryPotter from '../data/harry_potter.json';
import jeuxSociete from '../data/jeux_societe.json';
import pharmacie from '../data/Pharmacie.json';
import rappeurs from '../data/rappeurs.json';
import couleurs from '../data/couleurs.json';
import cuisine from '../data/cuisine.json';
import jeuxVideo from '../data/jeux_video.json';
import sport from '../data/sport.json';
import mix from '../data/mix.json';

export const CATEGORIES = {
    mix: {
        id: 'mix',
        name: "Classique",
        data: mix.words,
        teamNames: mix.teamNames,
        color: "from-purple-500 to-indigo-600",
        icon: "🌟"
    },
    geek: {
        id: 'geek',
        name: "Geek",
        data: geek.words,
        teamNames: geek.teamNames,
        color: "from-blue-600 to-blue-800",
        icon: "🎮"
    },
    friends: {
        id: 'friends',
        name: "Friends",
        data: friends.words,
        teamNames: friends.teamNames,
        color: "from-orange-500 to-orange-700",
        icon: "☕"
    },
    harryPotter: {
        id: 'harryPotter',
        name: "Harry Potter",
        data: harryPotter.words,
        teamNames: harryPotter.teamNames,
        color: "from-red-700 to-red-900",
        icon: "⚡"
    },
    jeuxSociete: {
        id: 'jeuxSociete',
        name: "Jeux de Société",
        data: jeuxSociete.words,
        teamNames: jeuxSociete.teamNames,
        color: "from-green-600 to-green-800",
        icon: "🎲"
    },
    pharmacie: {
        id: 'pharmacie',
        name: "Pharmacie",
        data: pharmacie.words,
        teamNames: pharmacie.teamNames,
        color: "from-teal-500 to-teal-700",
        icon: "💊"
    },
    rappeurs: {
        id: 'rappeurs',
        name: "Rap FR",
        data: rappeurs.words,
        teamNames: rappeurs.teamNames,
        color: "from-yellow-400 to-orange-500",
        icon: "🎤"
    },
    couleurs: {
        id: 'couleurs',
        name: "Couleurs",
        data: couleurs.words,
        teamNames: couleurs.teamNames,
        color: "from-pink-400 to-purple-500",
        icon: "🎨"
    },
    cuisine: {
        id: 'cuisine',
        name: "Cuisine",
        data: cuisine.words,
        teamNames: cuisine.teamNames,
        color: "from-red-400 to-yellow-500",
        icon: "🍔"
    },
    jeuxVideo: {
        id: 'jeuxVideo',
        name: "Jeux Vidéo",
        data: jeuxVideo.words,
        teamNames: jeuxVideo.teamNames,
        color: "from-indigo-500 to-blue-600",
        icon: "🕹️"
    },
    sport: {
        id: 'sport',
        name: "Sport",
        data: sport.words,
        teamNames: sport.teamNames,
        color: "from-green-400 to-teal-500",
        icon: "⚽"
    }
};

export const ROUNDS = [
    { id: 1, name: "Tour 1 : Description", desc: "Décrivez le mot sans le prononcer" },
    { id: 2, name: "Tour 2 : Un Mot", desc: "Un seul mot pour faire deviner" },
    { id: 3, name: "Tour 3 : Mime", desc: "Mimez le mot sans parler" }
];
