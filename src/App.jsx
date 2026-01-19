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
    const [globalDeck, setGlobalDeck] = useState([]);
    const [roundDeck, setRoundDeck] = useState([]);

    // Shuffle Helper
    const shuffle = (array) => {
        return [...array].sort(() => Math.random() - 0.5);
    };

    const handleStartGame = (categoryIds, teamNames, cardLimit) => {
        setTeams(teamNames);
        setActiveCategories(categoryIds);

        // Aggregate words
        let allWords = [];
        categoryIds.forEach(id => {
            allWords = [...allWords, ...CATEGORIES[id].data];
        });

        // Shuffle the full list first
        const shuffledWords = shuffle(allWords);

        // Apply limit if needed
        let finalDeck = [];
        if (typeof cardLimit === 'number') {
            // If limit is larger than available, take all available (min takes the smallest)
            finalDeck = shuffledWords.slice(0, Math.min(cardLimit, shuffledWords.length));
        } else {
            // 'all' case
            finalDeck = shuffledWords;
        }

        setGlobalDeck(finalDeck);
        setRoundDeck(shuffle(finalDeck));
        setScores({ 1: 0, 2: 0 });
        setRound(1);
        setCurrentTeam(1);
        setScreen('transition');
    };

    const handleTeamsGenerated = (team1Members, team2Members) => {
        // For now we just use generic names, or we could potentially name them based on members.
        // Let's keep it simple and just return to setup, maybe user can rename teams manually if they want.
        // Or we could auto-fill the team inputs if we passed state back up differently.
        // Since SetupScreen holds its own state, we should probably pass setTeams down or lift state up completely.
        // To keep it simple: We'll just alert the user or maybe start the game directly? 
        // The user asked for a "second page".
        // Let's go back to setup but pre-fill likely isn't easy without lifting state.
        // Actually, let's just make TeamGenerator return the lists and we can maybe alert them or simple navigate back.
        // The requirement was just "create two teams randomly".
        alert(`Équipe 1: ${team1Members.join(', ')}\n\nÉquipe 2: ${team2Members.join(', ')}`);
        setScreen('setup');
    };

    const currentRoundInfo = ROUNDS.find(r => r.id === round);

    const handleTurnEnd = () => {
        // Switch Team
        const nextTeam = currentTeam === 1 ? 2 : 1;
        setCurrentTeam(nextTeam);
        setScreen('transition');
    };

    const handleCorrect = () => {
        // Current Card is always roundDeck[0]
        const currentCard = roundDeck[0];
        const newDeck = roundDeck.slice(1); // Remove top card

        setScores(prev => ({ ...prev, [currentTeam]: prev[currentTeam] + 1 }));
        setRoundDeck(newDeck);

        // Check if Round Over
        if (newDeck.length === 0) {
            handleRoundEnd();
        }
    };

    const handlePass = () => {
        // Move top card to bottom
        const [card, ...rest] = roundDeck;
        setRoundDeck([...rest, card]);
    };

    const handleRoundEnd = () => {
        if (round >= 3) {
            setScreen('gameover');
        } else {
            setRound(r => r + 1);
            // Reset deck for next round
            setRoundDeck(shuffle(globalDeck));
            // Give turn to next team? Or keep same? Usually next team takes over.
            setCurrentTeam(currentTeam === 1 ? 2 : 1);
            setScreen('transition');
        }
    };

    // --- RENDERERS ---

    if (screen === 'team_generator') {
        return <TeamGenerator onBack={() => setScreen('setup')} onTeamsGenerated={handleTeamsGenerated} />;
    }

    if (screen === 'setup') {
        return <SetupScreen onStart={handleStartGame} onOpenTeamGenerator={() => setScreen('team_generator')} />;
    }

    if (screen === 'gameover') {
        const winner = scores[1] > scores[2] ? teams[1] : scores[2] > scores[1] ? teams[2] : "Égalité";
        return (
            <div className="flex flex-col h-full bg-game-dark p-8 items-center justify-center animate-pop text-center">
                <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-game-primary to-game-secondary mb-8">
                    FIN DE PARTIE
                </h1>
                <div className="space-y-6 w-full max-w-sm">
                    <div className="bg-white/10 p-6 rounded-2xl">
                        <h2 className="text-gray-400 text-sm uppercase">Vainqueur</h2>
                        <p className="text-3xl font-bold text-white mt-2">{winner}</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1 bg-white/5 p-4 rounded-xl">
                            <p className="text-game-primary font-bold">{teams[1]}</p>
                            <p className="text-2xl font-black text-white">{scores[1]}</p>
                        </div>
                        <div className="flex-1 bg-white/5 p-4 rounded-xl">
                            <p className="text-game-secondary font-bold">{teams[2]}</p>
                            <p className="text-2xl font-black text-white">{scores[2]}</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setScreen('setup')}
                    className="mt-12 bg-white text-game-dark font-bold py-4 px-12 rounded-full shadow-xl hover:scale-105 transition-transform"
                >
                    Rejouer
                </button>
            </div>
        );
    }

    if (screen === 'transition') {
        return (
            <div className="flex flex-col h-full bg-game-dark p-6 justify-between">
                <div className="mt-8">
                    <div className="flex justify-between items-center mb-8">
                        <div className="text-center">
                            <p className="text-gray-500 text-xs uppercase">{teams[1]}</p>
                            <p className="text-2xl font-bold text-white">{scores[1]}</p>
                        </div>
                        <div className="text-2xl font-black text-gray-700">VS</div>
                        <div className="text-center">
                            <p className="text-gray-500 text-xs uppercase">{teams[2]}</p>
                            <p className="text-2xl font-bold text-white">{scores[2]}</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-game-surface to-game-dark mx-4 p-8 rounded-3xl shadow-2xl border border-white/5 text-center space-y-4">
                        <h2 className="text-game-primary font-black text-sm tracking-widest uppercase">Au tour de</h2>
                        <h1 className="text-4xl font-black text-white break-words">{teams[currentTeam]}</h1>
                        <div className="w-16 h-1 bg-white/10 mx-auto rounded-full my-4"></div>
                        <div>
                            <span className="bg-white/10 text-white px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 inline-block">
                                {currentRoundInfo.name}
                            </span>
                            <p className="text-gray-400 text-sm">{currentRoundInfo.desc}</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setScreen('game')}
                    className="w-full bg-gradient-to-r from-game-primary to-game-secondary text-white font-black text-xl py-5 rounded-2xl shadow-lg shadow-game-primary/20 transform hover:scale-[1.02] transition-all"
                >
                    C'est moi qui fais deviner !
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
                className="absolute top-6 left-6 z-50 bg-white/10 p-2 rounded-full text-white/50 hover:text-white"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <GameScreen
                currentCard={roundDeck[0]}
                onCorrect={handleCorrect}
                onPass={handlePass}
                onTimeUp={handleTurnEnd}
                duration={30}
                teamName={teams[currentTeam]}
                roundInfo={currentRoundInfo.name}
            />
        </div>
    );
}
