import React, { useState, useEffect } from 'react';

export default function GameScreen({
    currentCard,
    onCorrect,
    onPass,
    onTimeUp,
    duration = 30,
    teamName,
    teamId,
    roundInfo
}) {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isActive, setIsActive] = useState(false); // Waiting for user to tap "GO"

    // Timer logic
    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            onTimeUp();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, onTimeUp]);

    const handleStart = () => {
        setIsActive(true);
    };

    // Prevent rapid double tapping from messing up state
    const [isProcessing, setIsProcessing] = useState(false);

    const handleAction = (action) => {
        if (isProcessing) return;
        setIsProcessing(true);
        action();
        // Small delay to prevent double tap
        setTimeout(() => setIsProcessing(false), 300);
    };

    // Fix crash: Define derived state for UI
    const isCriticalTime = timeLeft <= 5;
    // Calculate progress for the ring (full at start, empty at end)
    const timerProgress = (timeLeft / duration) * 100;

    // Team specific styles
    const teamColorClass = teamId === 1 ? 'text-game-primary' : 'text-game-secondary';

    // Stronger, more visible gradients for clear team distinction
    const teamBgClass = teamId === 1
        ? 'bg-gradient-to-br from-orange-200 via-orange-100 to-white'
        : 'bg-gradient-to-br from-violet-200 via-violet-100 to-white';

    const buttonColorClass = teamId === 1 ? 'bg-game-primary hover:bg-orange-500' : 'bg-game-secondary hover:bg-violet-500';

    if (!isActive && timeLeft === duration) {
        return (
            <div className={`flex flex-col items-center justify-center h-screen p-8 ${teamBgClass} animate-pop text-center space-y-8`}>
                <div className="mt-12">
                    <h2 className="text-2xl font-black uppercase tracking-widest mb-4 text-gray-600">{roundInfo}</h2>
                    <h1 className="text-5xl font-black text-game-text mb-2 drop-shadow-sm">{teamName}</h1>
                    <p className="text-gray-500 font-medium">Préparez-vous à faire deviner !</p>
                </div>

                <div className="w-48 h-48 rounded-full bg-white border-8 border-white shadow-xl flex items-center justify-center mb-8 relative transform hover:scale-105 transition-transform">
                    <span className={`text-7xl font-black ${teamColorClass}`}>{duration}s</span>
                </div>

                <button
                    onClick={handleStart}
                    className={`w-full ${buttonColorClass} text-white font-black text-2xl py-6 rounded-3xl shadow-lg animate-bounce transition-colors`}
                >
                    C'EST PARTI !
                </button>
            </div>
        );
    }

    return (
        <div className={`flex flex-col h-screen ${teamBgClass} relative overflow-hidden transition-colors duration-500`}>
            {/* Top Bar: Timer Only */}
            <div className="flex px-6 py-6 items-center justify-end z-10">
                <div className={`relative flex items-center justify-center w-20 h-20 rounded-full font-mono font-bold text-3xl shadow-md transition-all duration-300 ${isCriticalTime ? 'bg-red-500 text-white scale-110' : 'bg-white text-game-text'}`}>
                    {timeLeft}
                    <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 36 36">
                        <path
                            className={`${isCriticalTime ? 'text-white' : teamColorClass} transition-all duration-1000 ease-linear`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray={`${timerProgress}, 100`}
                        />
                    </svg>
                </div>
            </div>

            {/* Card Area */}
            <div className="flex-1 flex items-center justify-center p-6 z-10 w-full max-w-md mx-auto">
                <div className="w-full aspect-[3/4] max-h-[50vh] bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 flex items-center justify-center p-8 text-center transform transition-all animate-pop border-4 border-white/50">
                    <span className="text-4xl md:text-6xl font-black text-game-text leading-tight select-none break-words">
                        {currentCard}
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-6 p-6 pb-[calc(6rem+env(safe-area-inset-bottom))] z-10 max-w-lg mx-auto w-full">
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => handleAction(() => {
                            if (navigator.vibrate) navigator.vibrate(50);
                            onPass();
                        })}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold text-xl py-6 rounded-3xl transition-all active:scale-95 shadow-md flex flex-col items-center justify-center shadow-red-200"
                    >
                        <span className="text-sm uppercase tracking-wider mb-1 opacity-80">Je passe</span>
                        PASSER
                    </button>
                    <button
                        onClick={() => handleAction(() => {
                            if (navigator.vibrate) navigator.vibrate(50);
                            onCorrect();
                        })}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold text-xl py-6 rounded-3xl shadow-lg shadow-green-200 transition-all active:scale-95 flex flex-col items-center justify-center"
                    >
                        <span className="text-sm uppercase tracking-wider mb-1 opacity-80 animate-pulse">Bravo !</span>
                        TROUVÉ
                    </button>
                </div>

                {/* Info Footer */}
                <div className="text-center space-y-1">
                    <span className="text-xs font-black tracking-widest uppercase text-gray-500 block">{roundInfo}</span>
                    <span className="text-xl font-black text-game-text truncate max-w-full block">{teamName}</span>
                </div>
            </div>

            {/* Background Decor - Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className={`absolute top-[-10%] left-[-10%] w-96 h-96 ${teamId === 1 ? 'bg-orange-300' : 'bg-purple-300'} rounded-full mix-blend-multiply filter blur-3xl animate-blob`}></div>
                <div className={`absolute top-[-10%] right-[-10%] w-96 h-96 ${teamId === 1 ? 'bg-yellow-300' : 'bg-fuchsia-300'} rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000`}></div>
            </div>
        </div>
    );
}
