import React, { useState } from 'react';
import { CATEGORIES } from '../utils/gameData';

export default function SetupScreen({ onStart, onOpenTeamGenerator }) {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [teams, setTeams] = useState({ 1: 'Les Vainqueurs', 2: 'Les Outsiders' });
    const [durationMode, setDurationMode] = useState('average'); // quick (20), average (40), long (60), custom
    const [customCount, setCustomCount] = useState(50);

    const toggleCategory = (id) => {
        if (selectedCategories.includes(id)) {
            setSelectedCategories(prev => prev.filter(c => c !== id));
        } else {
            setSelectedCategories(prev => [...prev, id]);
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

    return (
        <div className="flex flex-col h-full p-6 space-y-6 animate-slide-up bg-game-dark text-white overflow-hidden">
            <div className="text-center space-y-1 mt-4">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-game-primary via-blue-400 to-game-secondary filter drop-shadow-lg transform -rotate-2">
                    MOTS PASSANTS
                </h1>
                <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Le jeu qui va vite !</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-8 pr-2 -mr-2 scrollbar-hide">

                {/* Teams Section */}
                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <h2 className="text-sm font-bold text-game-primary uppercase tracking-wider">Vos Équipes</h2>
                        <button onClick={onOpenTeamGenerator} className="text-xs text-game-secondary font-bold hover:text-white underline">
                            Générateur Aléatoire
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {[1, 2].map(num => (
                            <div key={num} className="relative group">
                                <input
                                    type="text"
                                    value={teams[num]}
                                    onChange={(e) => setTeams({ ...teams, [num]: e.target.value })}
                                    className="w-full bg-game-surface border-2 border-white/5 focus:border-game-primary rounded-xl px-3 py-3 text-white placeholder-gray-500 outline-none transition-all font-bold text-center text-sm"
                                    placeholder={`Nom Équipe ${num}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Game Mode */}
                <div className="space-y-3">
                    <h2 className="text-sm font-bold text-game-primary uppercase tracking-wider">Durée de la partie</h2>
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
                                className={`py-3 rounded-xl text-sm font-bold transition-all border-2 ${durationMode === mode.id
                                    ? 'bg-game-primary border-game-primary text-white shadow-lg shadow-game-primary/20'
                                    : 'bg-game-surface border-transparent text-gray-400 hover:border-gray-600'
                                    }`}
                            >
                                {mode.label} <span className="opacity-60 text-xs block">{mode.count} mots</span>
                            </button>
                        ))}
                    </div>

                    {/* Custom Option */}
                    <button
                        onClick={() => setDurationMode('custom')}
                        className={`w-full py-3 rounded-xl text-sm font-bold transition-all border-2 ${durationMode === 'custom'
                            ? 'bg-game-surface border-game-primary text-game-primary'
                            : 'bg-game-surface border-transparent text-gray-400'
                            }`}
                    >
                        Personnalisée
                    </button>

                    {durationMode === 'custom' && (
                        <div className="bg-game-surface p-4 rounded-xl animate-pop">
                            <label className="text-xs text-gray-400 mb-2 block uppercase font-bold">Nombre de cartes</label>
                            <input
                                type="range"
                                min="10"
                                max={Math.min(100, totalWordsAvailable || 100)}
                                step="5"
                                value={customCount}
                                onChange={(e) => setCustomCount(Number(e.target.value))}
                                className="w-full accent-game-primary h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="text-center font-black text-2xl text-white mt-2">{customCount}</div>
                        </div>
                    )}
                </div>

                {/* Categories Section */}
                <div className="space-y-3 pb-24">
                    <h2 className="text-sm font-bold text-game-primary uppercase tracking-wider">Les Listes</h2>
                    <div className="grid grid-cols-1 gap-3">
                        {Object.values(CATEGORIES).map((cat) => {
                            const isSelected = selectedCategories.includes(cat.id);
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => toggleCategory(cat.id)}
                                    className={`
                    relative w-full p-4 rounded-2xl flex items-center gap-4 transition-all duration-200 border-2
                    ${isSelected
                                            ? `bg-game-surface border-game-primary shadow-lg shadow-game-primary/10 text-white`
                                            : 'bg-game-surface border-transparent text-gray-400 hover:border-gray-600'}
                  `}
                                >
                                    <span className="text-3xl filter drop-shadow-md">{cat.icon}</span>
                                    <div className="text-left flex-1">
                                        <h3 className={`font-bold text-base leading-tight ${isSelected ? 'text-white' : 'text-gray-300'}`}>{cat.name}</h3>
                                        <p className={`text-xs mt-1 font-mono ${isSelected ? 'text-game-primary' : 'text-gray-500'}`}>{cat.data.length} cartes</p>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-game-primary border-game-primary' : 'border-gray-600'}`}>
                                        {isSelected && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Start Button */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-game-dark via-game-dark/95 to-transparent z-10 safe-area-bottom">
                <button
                    onClick={handleStart}
                    disabled={selectedCategories.length === 0}
                    className="w-full bg-gradient-to-r from-game-primary to-game-secondary text-white font-black text-xl py-4 rounded-2xl shadow-xl shadow-game-primary/25 transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    LANCER LA PARTIE
                </button>
            </div>
        </div>
    );
}
