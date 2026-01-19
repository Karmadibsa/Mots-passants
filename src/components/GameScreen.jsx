import React, { useState, useEffect } from 'react';

export default function GameScreen({
    currentCard,
    onCorrect,
    onPass,
    onTimeUp,
    duration = 30,
    teamName,
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

    // Initial Auto-Start or Manual Start? Manual is safer for passing phone.
    // Actually, let's make it Manual Start always on this screen for safety.

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

    if (!isActive && timeLeft === duration) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 bg-game-dark animate-pop text-center space-y-8">
                <div>
                    <h2 className="text-gray-400 text-xl font-bold uppercase tracking-widest mb-2">{roundInfo}</h2>
                    <h1 className="text-4xl font-black text-white mb-2">{teamName}</h1>
                    <p className="text-gray-500">Préparez-vous !</p>
                </div>

                <div className="w-48 h-48 rounded-full bg-white/5 border-4 border-white/10 flex items-center justify-center mb-8 relative">
                    <span className="text-6xl font-black text-white">{duration}s</span>
                </div>

                <button
                    onClick={handleStart}
                    className="w-full bg-game-primary text-white font-black text-2xl py-6 rounded-2xl shadow-lg shadow-game-primary/20 animate-bounce"
                >
                    C'EST PARTI !
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-game-dark relative overflow-hidden">
            {/* Top Bar: Timer & Team */}
            <div className="flex px-6 py-6 items-center justify-between z-10">
                <div className="flex flex-col">
                    <span className="text-xs text-game-primary font-bold tracking-widest uppercase">{roundInfo}</span>
                    <span className="text-lg font-bold text-white">{teamName}</span>
                </div>
                <div className={`relative flex items-center justify-center w-16 h-16 rounded-2xl font-mono font-bold text-2xl transition-colors duration-300 ${isCriticalTime ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 text-white'}`}>
                    {timeLeft}
                    <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 36 36">
                        <path
                            className={`${isCriticalTime ? 'text-white' : 'text-game-primary'} transition-all duration-1000 ease-linear`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeDasharray={`${timerProgress}, 100`}
                        />
                    </svg>
                </div>
            </div>

            {/* Card Area */}
            <div className="flex-1 flex items-center justify-center p-6 z-10">
                <div className="w-full aspect-[3/4] max-h-[60vh] bg-white rounded-3xl shadow-2xl flex items-center justify-center p-8 text-center transform transition-all animate-pop">
                    <span className="text-4xl md:text-5xl font-black text-game-dark leading-tight select-none">
                        {currentCard}
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-4 p-6 pb-8 safe-area-bottom z-10">
                <button
                    onClick={() => handleAction(() => {
                        if (navigator.vibrate) navigator.vibrate(50);
                        onPass();
                    })}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold text-xl py-6 rounded-2xl transition-all active:scale-95"
                >
                    PASSER
                </button>
                <button
                    onClick={() => handleAction(() => {
                        if (navigator.vibrate) navigator.vibrate(50);
                        onCorrect();
                    })}
                    className="bg-safe-success hover:bg-emerald-600 text-white font-bold text-xl py-6 rounded-2xl shadow-lg shadow-safe-success/20 transition-all active:scale-95"
                >
                    TROUVÉ
                </button>
            </div>

            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-game-primary/10 to-game-dark pointer-events-none" />
        </div>
    );
}
