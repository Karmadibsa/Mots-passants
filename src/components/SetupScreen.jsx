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

    const randomizeSingleTeamName = (teamId) => {
        let availableNames = [];

        // Use selected categories or all if none selected
        const sourceIds = selectedCategories.length > 0 ? selectedCategories : Object.keys(CATEGORIES);

        sourceIds.forEach(id => {
            if (CATEGORIES[id].teamNames) {
                availableNames = [...availableNames, ...CATEGORIES[id].teamNames];
            }
        });

        if (availableNames.length === 0) {
            availableNames = ["Les Vainqueurs", "Les Outsiders", "Les Champions", "Les Challengers", "Team A", "Team B", "Les Boss", "Les Nullos"];
        }

        // Filter out the OTHER team's name to avoid duplicates
        const otherTeamName = teams[teamId === 1 ? 2 : 1];
        availableNames = availableNames.filter(n => n !== otherTeamName);

        if (availableNames.length > 0) {
            const randomName = availableNames[Math.floor(Math.random() * availableNames.length)];
            setTeams(prev => ({ ...prev, [teamId]: randomName }));
        }
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

    const allSelected = selectedCategories.length === Object.keys(CATEGORIES).length;

    const toggleAllCategories = () => {
        if (selectedCategories.length === Object.keys(CATEGORIES).length) {
            setSelectedCategories([]);
        } else {
            setSelectedCategories(Object.keys(CATEGORIES));
        }
    };

    return (
        <main className="flex flex-col h-full p-6 space-y-6 animate-slide-up bg-game-bg text-game-text overflow-y-auto font-sans relative">
            {/* Background Blobs for Warm Vibe */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-game-secondary/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-game-primary/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            </div>

            {/* Title */}
            <div className="text-center space-y-2 mt-4 z-10 relative">
                <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-game-primary to-game-secondary filter drop-shadow-sm selection:bg-transparent tracking-tighter transform -rotate-2">
                    MOTS<br />PASSANTS
                </h1>
            </div>

            <div className="flex-1 overflow-y-auto space-y-8 pr-1 -mr-1 scrollbar-hide py-2 pb-32 z-10 relative">

                {/* Teams Section */}
                <div className="space-y-4 bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border-2 border-orange-100 shadow-xl shadow-orange-100/50">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-sm font-black text-game-primary uppercase tracking-widest flex items-center gap-2">
                            VOS ÉQUIPES
                        </h2>
                    </div>

                    {/* Team 1 */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black tracking-widest text-game-primary/80 ml-4 uppercase">Équipe 1</label>
                        <div className="relative group">
                            <input
                                type="text"
                                value={teams[1]}
                                onChange={(e) => setTeams({ ...teams, 1: e.target.value })}
                                placeholder="Nom de l'équipe 1"
                                className="w-full bg-white/90 border-2 border-orange-200 rounded-2xl px-4 py-3 text-game-text font-bold shadow-sm placeholder-gray-500 focus:outline-none focus:border-game-primary focus:ring-2 focus:ring-game-primary/20 transition-all"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                                <button
                                    onClick={() => randomizeSingleTeamName(1)}
                                    className="p-1.5 rounded-full bg-orange-100 text-game-primary hover:bg-game-primary hover:text-white transition-colors"
                                    title="Nom aléatoire"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center items-center py-2">
                        <span className="bg-white/50 px-3 py-1 rounded-full text-xs font-black text-gray-600 shadow-sm border border-gray-200">VS</span>
                    </div>

                    {/* Team 2 */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black tracking-widest text-game-secondary/80 ml-4 uppercase">Équipe 2</label>
                        <div className="relative group">
                            <input
                                type="text"
                                value={teams[2]}
                                onChange={(e) => setTeams({ ...teams, 2: e.target.value })}
                                placeholder="Nom de l'équipe 2"
                                className="w-full bg-white/90 border-2 border-orange-200 rounded-2xl px-4 py-3 text-game-text font-bold shadow-sm placeholder-gray-500 focus:outline-none focus:border-game-secondary focus:ring-2 focus:ring-game-secondary/20 transition-all"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                                <button
                                    onClick={() => randomizeSingleTeamName(2)}
                                    className="p-1.5 rounded-full bg-orange-100 text-game-secondary hover:bg-game-secondary hover:text-white transition-colors"
                                    title="Nom aléatoire"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="pt-2 text-center">
                        <button onClick={onOpenTeamGenerator} className="text-xs font-bold text-game-text/70 hover:text-game-primary transition-colors flex items-center justify-center gap-1 mx-auto bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            Générer les équipes depuis une liste
                        </button>
                    </div>
                </div>

                {/* Categories Section */}
                {/* Categories Section */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                        <h2 className="text-sm font-black text-game-primary uppercase tracking-widest">
                            THÈMES
                        </h2>
                        {/* Select All Button - Now outside grid */}
                        <button
                            onClick={toggleAllCategories}
                            className="bg-white border-2 border-gray-200 hover:border-game-primary text-game-text text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm transition-all"
                        >
                            {allSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.values(CATEGORIES).map((cat) => {
                            const isSelected = selectedCategories.includes(cat.id);

                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => toggleCategory(cat.id)}
                                    className={`
                                        relative overflow-hidden rounded-2xl p-3 transition-all duration-300
                                        flex flex-col items-center justify-between text-center group
                                        border-2 shadow-sm h-32
                                        ${isSelected
                                            ? 'bg-white border-game-primary shadow-lg shadow-orange-100 scale-[1.02]'
                                            : 'bg-white/80 border-gray-200 hover:border-gray-300 hover:bg-white'
                                        }
                                    `}
                                >
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center text-xl mb-1 transition-all duration-300
                                        ${isSelected ? 'scale-110 shadow-md' : 'opacity-100 grayscale-[0.3]'}
                                    `}
                                        style={{ backgroundColor: isSelected ? cat.color : '#f3f4f6' }}
                                    >
                                        {cat.icon}
                                    </div>

                                    <div className="space-y-1 w-full">
                                        <span className={`
                                            block text-xs font-black uppercase tracking-wide truncate transition-colors
                                            ${isSelected ? 'text-game-text' : 'text-gray-700'}
                                        `}>
                                            {cat.name}
                                        </span>
                                        <span className={`
                                            text-[10px] font-bold transition-colors
                                            ${isSelected ? 'text-game-primary' : 'text-gray-500'}
                                        `}>
                                            {cat.data.length} mots
                                        </span>
                                    </div>

                                    {/* Selection Indicator */}
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-game-primary border-2 border-white shadow-sm flex items-center justify-center">
                                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Game Mode */}
                <div className="space-y-4">
                    <h2 className="text-sm font-black text-game-primary uppercase tracking-widest px-2">
                        DURÉE
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { id: 'quick', label: 'Rapide', count: 20 },
                            { id: 'average', label: 'Moyenne', count: 40 },
                            { id: 'long', label: 'Longue', count: 60 },
                            { id: 'all', label: 'Totale', count: 'Tout' },
                        ].map((mode) => (
                            <button
                                key={mode.id}
                                onClick={() => setDurationMode(mode.id)}
                                className={`py-4 rounded-2xl text-sm font-bold transition-all border-2 relative overflow-hidden group shadow-sm ${durationMode === mode.id
                                    ? 'bg-white border-game-primary text-game-primary shadow-lg shadow-orange-100'
                                    : 'bg-white/60 border-transparent text-gray-500 hover:bg-white hover:border-gray-200 hover:text-game-text hover:shadow-md'
                                    }`}
                            >
                                <span className="relative z-10">{mode.label}</span>
                                <span className={`block text-[10px] uppercase tracking-wide mt-1 relative z-10 ${durationMode === mode.id ? 'text-game-secondary' : 'opacity-40'}`}>{mode.count} mots</span>
                            </button>
                        ))}
                    </div>

                    {/* Custom Button */}
                    <div className="relative">
                        <button
                            onClick={() => setDurationMode('custom')}
                            className={`w-full py-4 rounded-2xl text-sm font-bold transition-all border-2 shadow-sm ${durationMode === 'custom'
                                ? 'bg-white border-game-primary text-game-primary shadow-lg shadow-orange-100'
                                : 'bg-white/60 border-transparent text-gray-500 hover:bg-white hover:border-gray-200 hover:text-game-text hover:shadow-md'
                                }`}
                        >
                            Personnalisée
                        </button>

                        {durationMode === 'custom' && (
                            <div className="mt-3 bg-white p-6 rounded-[2rem] animate-pop border-2 border-orange-100 shadow-xl shadow-gray-200/50 relative z-20">
                                <div className="flex justify-between items-end mb-4">
                                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Nombre de cartes</label>
                                    <span className="text-4xl font-black text-game-primary">{customCount}</span>
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max={Math.min(100, totalWordsAvailable || 100)}
                                    step="5"
                                    value={customCount}
                                    onChange={(e) => setCustomCount(Number(e.target.value))}
                                    className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-game-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                                />
                                <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-mono font-bold">
                                    <span>10</span>
                                    <span>MAX</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Disclaimer Footer */}
                <div className="text-center pb-8 pt-4">
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Projet Personnel - Beta</p>
                    <p className="text-[9px] text-gray-600 mt-1 font-medium">
                        Rafraîchir la page réinitialise la partie.
                    </p>
                </div>

            </div>

            {/* Start Button */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-game-bg via-game-bg/95 to-transparent z-50 safe-area-bottom pointer-events-none">
                <button
                    onClick={handleStart}
                    disabled={selectedCategories.length === 0}
                    className="w-full pointer-events-auto bg-gradient-to-r from-game-primary to-game-secondary text-white font-black text-xl py-6 rounded-[2rem] shadow-xl shadow-orange-300/50 transform transition-all active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed hover:shadow-2xl hover:shadow-orange-400/40 hover:-translate-y-1 animate-pulse-slow"
                >
                    LANCER LA PARTIE
                </button>
            </div>
        </main>
    );
}
