import React, { useState } from 'react';
import SetupScreen from './components/SetupScreen';
import GameScreen from './components/GameScreen';
import TeamGenerator from './components/TeamGenerator';
import { CATEGORIES, ROUNDS } from './utils/gameData';

export default function App() {
    // Screens: 'setup', 'team_generator', 'transition', 'game', 'gameover'
    const [screen, setScreen] = useState('setup');

    // Game Configuration
    const [teams, setTeams] = useState({ 1: 'Les Vainqueurs', 2: 'Les Outsiders' });
    const [activeCategories, setActiveCategories] = useState([]);

    // Game State
    const [round, setRound] = useState(1);
    const [currentTeam, setCurrentTeam] = useState(1);
    const [scores, setScores] = useState({ 1: 0, 2: 0 });
    const [previousRoundScores, setPreviousRoundScores] = useState({ 1: 0, 2: 0 }); // To calc delta
    const [globalDeck, setGlobalDeck] = useState([]);
    const [roundDeck, setRoundDeck] = useState([]);
    const [skippedDeck, setSkippedDeck] = useState([]); // Cards passed during the current turn

    // Helper functions
    const shuffle = (array) => {
        return [...array].sort(() => Math.random() - 0.5);
    };

    const handleStartGame = (categoryIds, teamNames, cardLimit) => {
        setTeams(teamNames);
        setActiveCategories(categoryIds);

        // Create the deck
        let finalDeck = [];

        if (typeof cardLimit === 'number') {
            const numCategories = categoryIds.length;
            const wordsPerCategory = Math.ceil(cardLimit / numCategories);

            // Pick equally from each category
            let pool = [];
            categoryIds.forEach(id => {
                const catWords = shuffle(CATEGORIES[id].data); // Shuffle source
                pool = [...pool, ...catWords.slice(0, wordsPerCategory)];
            });

            // Reshuffle the combined pool
            const shuffledPool = shuffle(pool);

            // Trim to exact limit (in case ceil gave a few too many)
            finalDeck = shuffledPool.slice(0, cardLimit);
        } else {
            // 'all' case: just combine everything
            let allWords = [];
            categoryIds.forEach(id => {
                allWords = [...allWords, ...CATEGORIES[id].data];
            });
            finalDeck = shuffle(allWords);
        }

        setGlobalDeck(finalDeck);
        setRoundDeck(shuffle(finalDeck));
        setScores({ 1: 0, 2: 0 });
        setPreviousRoundScores({ 1: 0, 2: 0 });
        setRound(1);
        setCurrentTeam(1);
        setScreen('transition');
    };

    const handleTeamsGenerated = (team1Members, team2Members) => {
        alert(`Équipe 1: ${team1Members.join(', ')}\n\nÉquipe 2: ${team2Members.join(', ')}`);
        setScreen('setup');
    };

    const currentRoundInfo = ROUNDS.find(r => r.id === round);

    const handleTurnEnd = () => {
        // Recombine skipped cards into the round deck
        const nextRoundDeck = shuffle([...roundDeck, ...skippedDeck]);
        setRoundDeck(nextRoundDeck);
        setSkippedDeck([]); // Clear skipped pile

        // Switch Team
        const nextTeam = currentTeam === 1 ? 2 : 1;
        setCurrentTeam(nextTeam);
        setScreen('transition');
    };

    const handleRoundEnd = () => {
        setScreen('round_recap');
    };

    const confirmNextRound = () => {
        // Update previous scores baseline for the NEXT round
        setPreviousRoundScores(scores);

        if (round >= 3) {
            setScreen('gameover');
        } else {
            setRound(r => r + 1);
            // Reset deck for next round with ALL cards
            setRoundDeck(shuffle(globalDeck));
            // Usually switch team back to 1 or keep logic
            setCurrentTeam(currentTeam === 1 ? 2 : 1);
            setScreen('transition');
        }
    };

    const handleCorrect = () => {
        // Current Card is always roundDeck[0]
        const currentCard = roundDeck[0];
        const newDeck = roundDeck.slice(1); // Remove top card

        setScores(prev => ({ ...prev, [currentTeam]: prev[currentTeam] + 1 }));
        setRoundDeck(newDeck);

        // Check if Round Over (active deck empty AND no skipped cards left)
        if (newDeck.length === 0 && skippedDeck.length === 0) {
            handleRoundEnd();
        } else if (newDeck.length === 0) {
            handleTurnEnd();
        }
    };

    const handlePass = () => {
        if (roundDeck.length === 0) return;

        // Move top card to skipped pile
        const [card, ...rest] = roundDeck;
        setSkippedDeck(prev => [...prev, card]);
        setRoundDeck(rest);

        // If that was the last card, turn ends (or we could reshuffle skipped if rules say so, but user implies "don't come back")
        if (rest.length === 0) {
            handleTurnEnd();
        }
    };

    // --- RENDERERS ---

    if (screen === 'team_generator') {
        return <TeamGenerator onBack={() => setScreen('setup')} onTeamsGenerated={handleTeamsGenerated} />;
    }

    if (screen === 'setup') {
        return <SetupScreen onStart={handleStartGame} onOpenTeamGenerator={() => setScreen('team_generator')} />;
    }

    if (screen === 'round_recap') {
        const roundScore1 = scores[1] - previousRoundScores[1];
        const roundScore2 = scores[2] - previousRoundScores[2];

        return (
            <div className="flex flex-col h-screen bg-game-bg p-8 items-center justify-center animate-pop text-center relative overflow-hidden">
                {/* Blobs */}
                <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-game-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-96 h-96 bg-game-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 w-full max-w-sm">
                    <h2 className="text-gray-500 font-bold text-xs tracking-[0.2em] uppercase mb-4">Fin de la manche</h2>
                    <h1 className="text-4xl font-black text-game-text mb-8">{currentRoundInfo?.name}</h1>

                    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-orange-100 border border-white space-y-6 mb-8">
                        <div className="flex justify-between items-center">
                            <div className="text-left w-1/2 pr-4 border-r border-gray-100">
                                <p className="text-game-primary font-bold text-xs uppercase truncate mb-1">{teams[1]}</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-4xl font-black text-game-text">{scores[1]}</p>
                                    <span className="text-sm font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">+{roundScore1}</span>
                                </div>
                            </div>
                            <div className="text-right w-1/2 pl-4">
                                <p className="text-violet-600 font-bold text-xs uppercase truncate mb-1">{teams[2]}</p>
                                <div className="flex items-baseline justify-end gap-2">
                                    <span className="text-sm font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">+{roundScore2}</span>
                                    <p className="text-4xl font-black text-game-text">{scores[2]}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-600 text-sm font-medium mb-8 bg-white/50 p-4 rounded-xl">
                        {round < 3 ? "Préparez-vous pour la manche suivante !" : "Voyons qui a gagné..."}
                    </p>

                    <button
                        onClick={confirmNextRound}
                        className="w-full bg-game-text text-white font-black py-4 px-8 rounded-full shadow-lg hover:scale-105 transition-transform hover:shadow-xl hover:bg-black"
                    >
                        {round < 3 ? "Manche Suivante" : "Voir les résultats"}
                    </button>
                </div>
            </div>
        );
    }

    if (screen === 'gameover') {
        const winner = scores[1] > scores[2] ? teams[1] : scores[2] > scores[1] ? teams[2] : "Égalité";
        return (
            <div className="flex flex-col h-full bg-game-bg p-8 items-center justify-center animate-pop text-center">
                <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-game-primary to-game-secondary mb-8 drop-shadow-sm">
                    FIN DE PARTIE
                </h1>
                <div className="space-y-6 w-full max-w-sm">
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-orange-100 animate-bounce-slow">
                        <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Vainqueur</h2>
                        <p className="text-4xl font-black text-game-text mt-2">{winner}</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1 bg-white/60 p-4 rounded-2xl border border-white">
                            <p className="text-game-primary font-bold text-sm truncate">{teams[1]}</p>
                            <p className="text-3xl font-black text-game-text">{scores[1]}</p>
                        </div>
                        <div className="flex-1 bg-white/60 p-4 rounded-2xl border border-white">
                            <p className="text-game-secondary font-bold text-sm truncate">{teams[2]}</p>
                            <p className="text-3xl font-black text-game-text">{scores[2]}</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setScreen('setup')}
                    className="mt-12 bg-game-primary text-white font-black py-4 px-12 rounded-full shadow-lg hover:scale-105 transition-transform hover:shadow-xl"
                >
                    Rejouer
                </button>
            </div>
        );
    }

    if (screen === 'transition') {
        return (
            <div className="flex flex-col h-screen bg-game-bg p-6 relative overflow-hidden">
                {/* Blobs */}
                <div className="absolute top-[-20%] right-[-20%] w-96 h-96 bg-violet-200/40 rounded-full blur-3xl pointer-events-none"></div>

                {/* Score Header */}
                <div className="relative z-10 shrink-0 mb-2">
                    <div className="flex justify-between items-center px-4">
                        <div className="text-center">
                            <p className="text-orange-500 font-bold text-xs uppercase truncate max-w-[100px]">{teams[1]}</p>
                            <p className="text-3xl font-black text-game-text">{scores[1]}</p>
                        </div>
                        <div className="text-xl font-black text-game-accent bg-white/50 px-3 py-1 rounded-full shadow-sm">VS</div>
                        <div className="text-center">
                            <p className="text-violet-600 font-bold text-xs uppercase truncate max-w-[100px]">{teams[2]}</p>
                            <p className="text-3xl font-black text-game-text">{scores[2]}</p>
                        </div>
                    </div>
                </div>

                {/* Main Content - Auto Expand */}
                <div className="relative z-10 flex-1 flex flex-col mb-6">
                    <div className="flex-1 bg-white mx-2 p-8 rounded-[2.5rem] shadow-2xl shadow-orange-100/80 border border-white text-center flex flex-col items-center justify-center space-y-8 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                        <div>
                            <h2 className="text-gray-500 font-bold text-xs tracking-[0.2em] uppercase mb-4">Au tour de</h2>
                            <h1 className="text-6xl font-black text-game-text break-words leading-tight">{teams[currentTeam]}</h1>
                        </div>

                        <div className="w-32 h-2 bg-gray-100 rounded-full"></div>

                        <div className="w-full">
                            <span className="bg-game-primary/10 text-game-text px-6 py-3 rounded-2xl text-xl font-black uppercase mb-4 inline-block tracking-widest border-2 border-game-primary/20">
                                {currentRoundInfo?.name || "Tour"}
                            </span>
                            <p className="text-gray-500 text-lg font-medium leading-relaxed px-4">{currentRoundInfo?.desc || ""}</p>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={() => setScreen('game')}
                    className="w-full relative z-10 shrink-0 bg-gradient-to-r from-game-primary to-game-secondary text-white font-black text-2xl py-8 rounded-[2rem] shadow-xl shadow-orange-300/30 transform hover:scale-[1.02] transition-all hover:shadow-orange-400/40"
                >
                    Je fais deviner !
                </button>
            </div>
        );
    }

    // GAME SCREEN
    return (
        <div className='h-full relative'>
            <button
                onClick={() => {
                    if (confirm("Quitter la partie ?")) setScreen('setup');
                }}
                className="absolute top-6 left-6 z-50 bg-white/40 p-2 rounded-full text-game-text hover:bg-white hover:text-red-500 transition-colors shadow-sm backdrop-blur-sm"
                aria-label="Quitter la partie"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <GameScreen
                currentCard={roundDeck[0]}
                onCorrect={handleCorrect}
                onPass={handlePass}
                onTimeUp={handleTurnEnd}
                duration={30}
                teamName={teams[currentTeam]}
                teamId={currentTeam}
                roundInfo={currentRoundInfo?.name || "Jeu"}
            />
        </div>
    );
}
