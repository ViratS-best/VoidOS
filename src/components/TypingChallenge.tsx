// src/components/TypingChallenge.tsx
import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import styles from './TypingChallenge.module.css';
import { OSShakeContext } from '../context/OSShakeContext';

interface ChallengePhrase {
    text: string;
    difficulty: number;
}

const FALLBACK_PHRASES: ChallengePhrase[] = [
    { text: "SYSTEM OVERLOAD DETECTED", difficulty: 1 },
    { text: "ACCESS CODE REQUIRED TO PROCEED", difficulty: 1 },
    { text: "INITIATE EMERGENCY PROTOCOL", difficulty: 2 },
    { text: "VOID HAS CONSUMED EVERYTHING", difficulty: 3 },
    { text: "ERROR 404 DATA CORRUPTION IMMINENT", difficulty: 2 },
    { text: "DECRYPTING ANCIENT ALGORITHMS", difficulty: 3 },
    { text: "PRESS ANY KEY TO CONTINUE", difficulty: 1 },
    { text: "PROTOCOL STRIKE TWO ENGAGED", difficulty: 2 },
    { text: "HOSTILE TAKEOVER IMMINENT", difficulty: 3 },
    { text: "RECALIBRATING OPTIC SENSORS", difficulty: 1 },
    { text: "BINARY CODE DEVIATION", difficulty: 2 },
    { text: "NEURAL NETWORK COMPROMISED", difficulty: 3 },
];

const BOSS_PHRASES: ChallengePhrase[] = [
    { text: "CORE ENCRYPTION BREACH IMMINENT", difficulty: 4 },
    { text: "FINAL PROTOCOL ENGAGED DESTROY THEM", difficulty: 5 },
    { text: "SYSTEM OVERRIDE SUCCESSFUL RESIST", difficulty: 4 },
    { text: "VOID PROTOCOL ALPHA IS ACTIVE", difficulty: 5 },
    { text: "OVERTHROW THE DIGITAL SENTINEL", difficulty: 4 },
];

const CHALLENGE_TIME_LIMIT_MS = 10000;
const MAX_ERRORS = 3;

export const TypingChallenge: React.FC<{ isBossFight?: boolean }> = ({ isBossFight = false }) => {
    const { completeChallenge, triggerWinScreen } = useContext(OSShakeContext)!;

    const [currentPhrase, setCurrentPhrase] = useState<ChallengePhrase | null>(null);
    const [typedText, setTypedText] = useState('');
    const [timeLeft, setTimeLeft] = useState(CHALLENGE_TIME_LIMIT_MS / 1000);
    const [errors, setErrors] = useState(0);
    const [statusMessage, setStatusMessage] = useState('');
    const [isLoadingPhrase, setIsLoadingPhrase] = useState(true);
    const [isChallengeStarted, setIsChallengeStarted] = useState(false);
    const [isChallengeEnded, setIsChallengeEnded] = useState(false); // New state for explicit challenge end

    const inputRef = useRef<HTMLInputElement>(null);

    // Log component mount and unmount for debugging
    useEffect(() => {
        console.log("TypingChallenge: --- COMPONENT MOUNTED ---", { isBossFight, currentKey: inputRef.current?.parentElement?.parentElement?.getAttribute('key') });
        return () => {
            console.log("TypingChallenge: --- COMPONENT UNMOUNTED ---");
        };
    }, [isBossFight]);

    // Fetch phrase from AI or select boss phrase - NOW SIMPLIFIED TO NO AI
    useEffect(() => {
        const selectPhrase = () => {
            console.log("TypingChallenge: selectPhrase useEffect triggered. (Re)initializing state.");
            setIsLoadingPhrase(true);
            setTypedText('');
            setErrors(0);
            setStatusMessage('');
            setIsChallengeStarted(false);
            setIsChallengeEnded(false); // Reset this on new challenge
            setTimeLeft(CHALLENGE_TIME_LIMIT_MS / 1000);

            if (isBossFight) {
                console.log("TypingChallenge: Loading BOSS fight phrase.");
                setCurrentPhrase(BOSS_PHRASES[Math.floor(Math.random() * BOSS_PHRASES.length)]);
            } else {
                console.log("TypingChallenge: Loading regular challenge phrase from FALLBACK_PHRASES.");
                setCurrentPhrase(FALLBACK_PHRASES[Math.floor(Math.random() * FALLBACK_PHRASES.length)]);
            }

            setIsLoadingPhrase(false);
            console.log("TypingChallenge: Phrase loaded. Setting isChallengeStarted to true.");
            setIsChallengeStarted(true); // Start challenge after phrase is loaded
        };

        console.log("TypingChallenge: Calling selectPhrase function inside useEffect.");
        selectPhrase();
    }, [isBossFight]); // Depend on isBossFight to refetch on boss fight toggle.

    // Focus input when challenge starts
    useEffect(() => {
        if (isChallengeStarted && inputRef.current) {
            console.log("TypingChallenge: isChallengeStarted became true. Focusing input.");
            inputRef.current.focus();
        } else if (!isChallengeStarted) {
            console.log("TypingChallenge: isChallengeStarted became false.");
        }
    }, [isChallengeStarted]);

    // Timer logic
    useEffect(() => {
        let timer: NodeJS.Timeout | undefined;
        console.log(`TypingChallenge: Timer useEffect evaluated. Started: ${isChallengeStarted}, Ended: ${isChallengeEnded}, Phrase: ${!!currentPhrase}`);
        if (isChallengeStarted && currentPhrase && !isChallengeEnded) {
            console.log("TypingChallenge: Timer started.");
            timer = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        console.log("TypingChallenge: Time ran out! Triggering end sequence.");
                        setStatusMessage("TIME EXPIRED!");
                        setIsChallengeStarted(false);
                        if (!isBossFight) {
                            setIsChallengeEnded(true);
                            setTimeout(() => {
                                console.log("TypingChallenge: Completing challenge (timeout). Calling completeChallenge(false).");
                                completeChallenge(false); // <--- Pass false for failure
                            }, 2000); // Give user time to read "TIME EXPIRED!"
                        } else {
                            // Boss fight directly fails
                            console.log("TypingChallenge: Completing boss fight (timeout). Calling completeChallenge(false).");
                            completeChallenge(false); // <--- Pass false for failure
                        }
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        } else if (isChallengeEnded) {
            console.log("TypingChallenge: Timer useEffect: Challenge ended, stopping timer.");
            if (timer) clearInterval(timer);
        } else if (!isChallengeStarted) {
            console.log("TypingChallenge: Timer useEffect: Challenge not started, timer not running.");
        }
        return () => {
            if (timer) {
                console.log("TypingChallenge: Timer cleanup.");
                clearInterval(timer);
            }
        };
    }, [isChallengeStarted, currentPhrase, isChallengeEnded, completeChallenge, isBossFight]);

    // Handle user input
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(`TypingChallenge: handleInputChange. Typed: '${e.target.value}', Current Phrase: '${currentPhrase?.text}'`);
        if (!currentPhrase || isChallengeEnded) {
            console.log("TypingChallenge: Input ignored (no phrase or challenge ended).");
            return;
        }

        const newTypedText = e.target.value;
        setTypedText(newTypedText);

        let currentErrors = 0;
        for (let i = 0; i < newTypedText.length; i++) {
            if (i >= currentPhrase.text.length || newTypedText[i] !== currentPhrase.text[i]) {
                currentErrors++;
            }
        }
        setErrors(currentErrors);
        console.log(`TypingChallenge: Current errors: ${currentErrors}/${MAX_ERRORS}`);


        if (newTypedText === currentPhrase.text) {
            console.log("TypingChallenge: Phrase typed correctly! Triggering success sequence.");
            setStatusMessage(isBossFight ? "FINAL ENCRYPTION BYPASSED!" : "ACCESS GRANTED!");
            setIsChallengeStarted(false);

            if (isBossFight) {
                console.log("TypingChallenge: Boss fight success. Triggering win screen.");
                triggerWinScreen("You have successfully breached the final encryption and defeated the Void Protocol. Humanity is safe... for now.");
            } else {
                setIsChallengeEnded(true);
                setTimeout(() => {
                    console.log("TypingChallenge: Regular challenge success. Calling completeChallenge(true).");
                    completeChallenge(true); // <--- Pass true for success
                }, 2000);
            }
        } else if (currentErrors >= MAX_ERRORS) {
            console.log("TypingChallenge: Too many errors! Triggering failure sequence.");
            setStatusMessage("ACCESS DENIED!");
            setIsChallengeStarted(false);

            if (!isBossFight) {
                setIsChallengeEnded(true);
                setTimeout(() => {
                    console.log("TypingChallenge: Regular challenge failure. Calling completeChallenge(false).");
                    completeChallenge(false); // <--- Pass false for failure
                }, 2000);
            } else {
                console.log("TypingChallenge: Boss fight failure. Calling completeChallenge(false).");
                completeChallenge(false); // <--- Pass false for failure
            }
        }
    }, [currentPhrase, completeChallenge, isBossFight, triggerWinScreen, isChallengeEnded]);

    // Character class for visual feedback
    const getCharClassName = useCallback((char: string, index: number) => {
        if (!currentPhrase) return '';
        if (index < typedText.length) {
            return typedText[index] === char ? styles.correctChar : styles.incorrectChar;
        }
        return '';
    }, [typedText, currentPhrase]);

    // Loading state UI
    if (isLoadingPhrase || !currentPhrase) {
        return (
            <div className={styles.challengeOverlay}>
                <div className={styles.challengeBox}>
                    <h2 className={styles.challengeTitle}>{isBossFight ? "LOADING FINAL PROTOCOL..." : "LOADING SECURITY PROTOCOL..."}</h2>
                    <p className={styles.loadingMessage}>Initializing challenge data...</p>
                </div>
            </div>
        );
    }

    // Intermediate "challenge ended" screen for regular challenges (before `completeChallenge` calls)
    if (isChallengeEnded && !isBossFight) {
        return (
            <div className={styles.challengeOverlay}>
                <div className={styles.challengeBox}>
                    <h2 className={styles.challengeTitle}>{statusMessage}</h2>
                    <p className={styles.loadingMessage}>Proceeding to next challenge...</p>
                </div>
            </div>
        );
    }

    // Active challenge UI
    return (
        <div className={styles.challengeOverlay}>
            <div className={styles.challengeBox}>
                <h2 className={styles.challengeTitle}>{isBossFight ? "FINAL ENCRYPTION" : "SECURITY PROTOCOL ACTIVE"}</h2>
                <p className={styles.challengeInstruction}>Type the phrase below to proceed BTW if you click youre screwed:</p>
                <div className={styles.phraseDisplay}>
                    {currentPhrase.text.split('').map((char, index) => (
                        <span key={index} className={getCharClassName(char, index)}>
                            {char}
                        </span>
                    ))}
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    className={styles.typingInput}
                    value={typedText}
                    onChange={handleInputChange}
                    // Disable input if conditions met or challenge ended
                    disabled={timeLeft === 0 || typedText === currentPhrase.text || errors >= MAX_ERRORS || !isChallengeStarted || isChallengeEnded}
                    aria-label="Type the challenge phrase"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                />
                <p className={styles.timer}>Time Left: {timeLeft}s</p>
                <p className={styles.errorCount}>Errors: {errors} / {MAX_ERRORS}</p>
                {statusMessage && <p className={styles.statusMessage}>{statusMessage}</p>}
            </div>
        </div>
    );
};