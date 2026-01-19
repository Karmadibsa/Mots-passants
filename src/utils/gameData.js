import geek from '../data/geek.json';
import friends from '../data/friends.json';
import harryPotter from '../data/harry_potter.json';
import jeuxSociete from '../data/jeux_societe.json';

export const CATEGORIES = {
    geek: {
        id: 'geek',
        name: "Geek",
        data: geek,
        color: "from-blue-600 to-blue-800",
        icon: "🎮"
    },
    friends: {
        id: 'friends',
        name: "Friends",
        data: friends,
        color: "from-orange-500 to-orange-700",
        icon: "☕"
    },
    harryPotter: {
        id: 'harryPotter',
        name: "Harry Potter",
        data: harryPotter,
        color: "from-red-700 to-red-900",
        icon: "⚡"
    },
    jeuxSociete: {
        id: 'jeuxSociete',
        name: "Jeux de Société",
        data: jeuxSociete,
        color: "from-green-600 to-green-800",
        icon: "🎲"
    }
};

export const ROUNDS = [
    { id: 1, name: "Tour 1 : Description", desc: "Décrivez le mot sans le prononcer" },
    { id: 2, name: "Tour 2 : Un Mot", desc: "Un seul mot pour faire deviner" },
    { id: 3, name: "Tour 3 : Mime", desc: "Mimez le mot sans parler" }
];
