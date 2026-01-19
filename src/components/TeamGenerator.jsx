import React, { useState } from 'react';

export default function TeamGenerator({ onBack, onTeamsGenerated }) {
    const [names, setNames] = useState('');

    const handleGenerate = () => {
        const nameList = names.split(/[\n,]+/).map(n => n.trim()).filter(n => n.length > 0);

        if (nameList.length < 2) {
            alert("Il faut au moins 2 joueurs !");
            return;
        }

        // Shuffle
        const shuffled = [...nameList].sort(() => Math.random() - 0.5);

        // Split
        const half = Math.ceil(shuffled.length / 2);
        const team1Members = shuffled.slice(0, half);
        const team2Members = shuffled.slice(half);

        // Auto-name based on first player? Or just keep generic names but show members?
        // Let's pass the members back to the main app setup if needed, 
        // BUT for now, let's just display them here so user can copy/paste or just know.
        // Actually, user wants to create teams. Let's just show the result here clearly.

        onTeamsGenerated(team1Members, team2Members);
    };

    return (
        <div className="flex flex-col h-full bg-game-dark p-6 animate-slide-up">
            <div className="flex items-center mb-6">
                <button
                    onClick={onBack}
                    className="bg-white/10 p-2 rounded-full text-white hover:bg-white/20 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h1 className="flex-1 text-center text-xl font-black text-white uppercase tracking-wider">
                    Générateur d'Équipes
                </h1>
                <div className="w-10"></div> {/* Spacer */}
            </div>

            <div className="space-y-4 flex-1">
                <div className="bg-game-surface p-4 rounded-2xl border border-white/5">
                    <label className="block text-gray-400 text-sm font-bold mb-2 uppercase">Noms des joueurs</label>
                    <textarea
                        value={names}
                        onChange={(e) => setNames(e.target.value)}
                        placeholder="Entrez les prénoms ici (séparés par un saut de ligne ou virgule)..."
                        className="w-full h-40 bg-black/20 text-white rounded-xl p-4 focus:ring-2 focus:ring-game-primary outline-none resize-none"
                    />
                </div>

                <button
                    onClick={handleGenerate}
                    className="w-full bg-gradient-to-r from-game-primary to-game-secondary text-white font-black py-4 rounded-2xl shadow-lg shadow-game-primary/20 hover:scale-[1.02] transition-transform"
                >
                    MÉLANGER ALÉATOIREMENT
                </button>
            </div>
        </div>
    );
}
