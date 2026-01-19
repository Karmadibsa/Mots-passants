import React, { useState } from 'react';
import { CATEGORIES } from '../utils/gameData';

export default function SetupScreen({ onStart, onOpenTeamGenerator }) {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [teams, setTeams] = useState({ 1: 'Équipe 1', 2: 'Équipe 2' });
    const [durationMode, setDurationMode] = useState('average'); // quick, average, long, custom
    const [customCount, setCustomCount] = useState(50);

    const toggleCategory = (id) => {
        if (selectedCategories.includes(id)) {
            setSelectedCategories(prev => prev.filter(c => c !== id));
        } else {
            setSelectedCategories(prev => [...prev, id]);
        }
    };

    const randomizeTeamNames = () => {
        let availableNames = [];

        // If no category selected, use all potentially? Or just warn?
        const sourceIds = selectedCategories.length > 0 ? selectedCategories : Object.keys(CATEGORIES);

        sourceIds.forEach(id => {
            if (CATEGORIES[id].teamNames) {
                availableNames = [...availableNames, ...CATEGORIES[id].teamNames];
            }
        });

        if (availableNames.length < 2) {
            // Fallback if lists don't have enough names
            availableNames = ["Les Vainqueurs", "Les Outsiders", "Les Champions", "Les Challengers", "Team A", "Team B"];
        }

        // Shuffle and pick 2
        const shuffled = [...availableNames].sort(() => Math.random() - 0.5);
        setTeams({ 1: shuffled[0], 2: shuffled[1] });
    };

    const handleStart = () => {
        if (selectedCategories.length === 0) return alert("Choisis au moins une liste !");

        let limit = 40;
        if (durationMode === 'quick') limit = 20;
        if (durationMode === 'average') limit = 40;
        if (durationMode === 'long') limit = 60;
        if (durationMode === 'custom') limit = customCount;
        if (durationMode === 'all') limit = 'all';

        onStart(selectedCategories, teams, limit);
    };

    // Calculate total words available based on selection
    const totalWordsAvailable = selectedCategories.reduce((acc, catId) => acc + CATEGORIES[catId].data.length, 0);

    return (
        <div className="flex flex-col h-full p-6 space-y-6 animate-slide-up bg-game-dark text-white overflow-hidden">
            {/* Title */}
            <div className="text-center space-y-2 mt-4">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-game-primary via-blue-200 to-game-secondary filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transform -rotate-1">
                    MOTS PASSANTS
                </h1>
                <p className="text-gray-400 text-xs uppercase tracking-[0.2em] font-bold">Le jeu qui va vite !</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-8 pr-2 -mr-2 scrollbar-hide py-2">

                {/* Teams Section */}
                <div className="space-y-3 bg-game-surface/50 p-4 rounded-2xl border border-white/5 shadow-lg">
                    <div className="flex justify-between items-center">
                        <h2 className="text-sm font-bold text-game-primary uppercase tracking-wider flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            Vos Équipes
                        </h2>
                        <div className="flex gap-3">
                            <button onClick={randomizeTeamNames} className="p-2 rounded-full bg-white/5 hover:bg-game-primary hover:text-white transition-colors" title="Noms aléatoires">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {[1, 2].map(num => (
                            <div key={num} className="relative group">
                                <input
                                    type="text"
                                    value={teams[num]}
                                    onChange={(e) => setTeams({ ...teams, [num]: e.target.value })}
                                    className="w-full bg-game-dark border border-white/10 focus:border-game-primary rounded-xl px-3 py-3 text-white placeholder-gray-600 outline-none transition-all font-bold text-center text-sm shadow-inner"
                                    placeholder={`Nom Équipe ${num}`}
                                />
                            </div>
                        ))}
                    </div>
                    {/* Link to Player Generator */}
                    <div className="text-center">
                        <button onClick={onOpenTeamGenerator} className="text-[10px] text-gray-500 hover:text-game-primary transition-colors underline decoration-dotted">
                            Générer les équipes depuis une liste de joueurs
                        </button>
                    </div>
                </div>

                {/* Categories Section (Moved up as it affects team names) */}
                <div className="space-y-3">
                    <h2 className="text-sm font-bold text-game-primary uppercase tracking-wider flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        Les Listes
                    </h2>
                    <div className="grid grid-cols-1 gap-3">
                        {Object.values(CATEGORIES).map((cat) => {
                            const isSelected = selectedCategories.includes(cat.id);
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => toggleCategory(cat.id)}
                                    className={`
                    relative w-full p-4 rounded-2xl flex items-center gap-4 transition-all duration-200 border
                    ${isSelected
                                            ? `bg-game-surface border-game-primary shadow-[0_0_15px_rgba(14,165,233,0.3)] text-white`
                                            : 'bg-game-surface/30 border-white/5 text-gray-500 hover:bg-game-surface/50'}
                  `}
                                >
                                    <span className={`text-3xl filter drop-shadow-md transition-transform duration-300 ${isSelected ? 'scale-110' : 'grayscale opacity-50'}`}>{cat.icon}</span>
                                    <div className="text-left flex-1">
                                        <h3 className={`font-bold text-base leading-tight ${isSelected ? 'text-white' : 'text-gray-400'}`}>{cat.name}</h3>
                                        <p className={`text-xs mt-1 font-mono ${isSelected ? 'text-game-primary' : 'text-gray-600'}`}>{cat.data.length} cartes</p>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-game-primary border-game-primary' : 'border-gray-700 bg-game-dark'}`}>
                                        {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Game Mode */}
                <div className="space-y-3 pb-24">
                    <h2 className="text-sm font-bold text-game-primary uppercase tracking-wider flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Durée
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { id: 'quick', label: 'Rapide', count: 20 },
                            { id: 'average', label: 'Moyenne', count: 40 },
                            { id: 'long', label: 'Longue', count: 60 },
                            { id: 'all', label: 'Totale', count: '∞' },
                        ].map((mode) => (
                            <button
                                key={mode.id}
                                onClick={() => setDurationMode(mode.id)}
                                className={`py-3 rounded-xl text-xs font-bold transition-all border ${durationMode === mode.id
                                        ? 'bg-game-surface border-game-primary text-white shadow-lg'
                                        : 'bg-game-dark border-white/10 text-gray-500 hover:border-white/20'
                                    }`}
                            >
                                {mode.label} <span className={`block mt-1 ${durationMode === mode.id ? 'text-game-primary' : 'text-gray-600'}`}>{mode.count} mots</span>
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setDurationMode('custom')}
                        className={`w-full py-3 rounded-xl text-xs font-bold transition-all border ${durationMode === 'custom'
                                ? 'bg-game-surface border-game-primary text-game-primary'
                                : 'bg-game-dark border-transparent text-gray-500'
                            }`}
                    >
                        Personnalisée
                    </button>

                    {durationMode === 'custom' && (
                        <div className="bg-game-surface p-4 rounded-xl animate-pop border border-white/10">
                            <div className="flex justify-between text-xs text-gray-400 mb-2 font-bold uppercase">
                                <span>Cartes</span>
                                <span className="text-white">{customCount}</span>
                            </div>
                            <input
                                type="range"
                                min="10"
                                max={Math.min(100, totalWordsAvailable || 100)}
                                step="5"
                                value={customCount}
                                onChange={(e) => setCustomCount(Number(e.target.value))}
                                className="w-full accent-game-primary h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    )}
                </div>

            </div>

            {/* Start Button */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-game-dark via-game-dark/95 to-transparent z-10 safe-area-bottom">
                <button
                    onClick={handleStart}
                    disabled={selectedCategories.length === 0}
                    className="w-full bg-gradient-to-r from-game-primary to-game-secondary text-white font-black text-xl py-4 rounded-2xl shadow-lg shadow-game-primary/30 transform transition-all active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                >
                    LANCER LA PARTIE
                </button>
            </div>
        </div>
    );
}
