// src/components/MyTerminalApp.tsx
import { WindowProps } from "prozilla-os";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from "./MyTerminalApp.module.css";

// Base URL for the Hack Club AI
const AI_API_URL = "https://ai.hackclub.com/chat/completions";

export function MyTerminalApp({ app }: WindowProps) {
    const username = "Jefferery Heckerson";
    const hostname = "heckerson"; // For the prompt
    const prompt = `${username}@${hostname}:~$ `;

    const [input, setInput] = useState('');
    const [displayInput, setDisplayInput] = useState('');

    const [output, setOutput] = useState([
        "Terminal - VoidOS (Made by Jefferery Heckerson)",
        "Type 'help' for a list of commands."
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [aiActivated, setAiActivated] = useState(false);
    const [aiInteractionCount, setAiInteractionCount] = useState(0);

    const terminalOutputRef = useRef<HTMLDivElement>(null);

    const [glitchActive, setGlitchActive] = useState(false);
    const [whiteFlashActive, setWhiteFlashActive] = useState(false);

    // List of apps to randomly launch. YOU MIGHT NEED TO CHANGE THESE!
    // These are common app names, but verify them from ProzillaOS's source/docs.
    const launchableApps = ['my-custom-text-editor']; // Add more if you know them!

    // NEW REF: To store the timeout ID persistently
    const launchTimerRef = useRef<NodeJS.Timeout | null>(null);

    // NEW: Define triggerRandomAppLaunch using useCallback directly in the component body
    const triggerRandomAppLaunch = useCallback(() => {
        console.log("--- DEBUG: triggerRandomAppLaunch function called. ---"); // DEBUG

        if (launchableApps.length === 0) {
            console.warn("No launchable apps defined. Cannot trigger random app launch.");
            return;
        }

        const appToLaunch = launchableApps[Math.floor(Math.random() * launchableApps.length)];
        const launchDelay = Math.random() * 30000 + 10000; // Launch every 10 to 40 seconds

        console.log(`[VOIDOS]: Attempting to launch '${appToLaunch}' in ${launchDelay / 1000} seconds.`);

        // This 'app' will always refer to the latest 'app' prop because of useCallback's dependencies
        console.log("--- DEBUG: 'app' prop value for launch attempt:", app);

        if (app && typeof app.launch === 'function') {
            app.launch(appToLaunch).then(() => {
                console.log(`[VOIDOS]: Successfully launched '${appToLaunch}'.`);
            }).catch((error: any) => {
                console.error(`[VOIDOS]: Failed to launch '${appToLaunch}':`, error);
            });
        } else {
            console.warn("[VOIDOS]: 'app' prop or 'app.launch' method not available or not a function.");
        }

        // Set the next timeout, store ID in ref
        launchTimerRef.current = setTimeout(triggerRandomAppLaunch, launchDelay);
    }, [app, launchableApps]); // Dependencies for useCallback: function re-creates if these change


    // Effect to scroll to the bottom whenever output changes
    useEffect(() => {
        if (terminalOutputRef.current) {
            terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
        }
    }, [output, isLoading]);

    // MODIFIED EFFECT: Slower random visual glitches
    useEffect(() => {
        let glitchTimeoutId: NodeJS.Timeout;
        let nextGlitchTimerId: NodeJS.Timeout;

        const triggerGlitch = () => {
            const duration = Math.random() * 150 + 50;
            const nextDelay = Math.random() * 5000 + 1000;

            setGlitchActive(true);
            glitchTimeoutId = setTimeout(() => {
                setGlitchActive(false);
            }, duration);

            nextGlitchTimerId = setTimeout(triggerGlitch, nextDelay);
        };

        nextGlitchTimerId = setTimeout(triggerGlitch, Math.random() * 2000 + 500);

        return () => {
            clearTimeout(glitchTimeoutId);
            clearTimeout(nextGlitchTimerId);
        };
    }, []);

    // NEW EFFECT: For random white screen flashes
    useEffect(() => {
        let flashTimeout: NodeJS.Timeout;
        let nextFlashTimer: NodeJS.Timeout;

        const triggerWhiteFlash = () => {
            const flashDuration = 30;
            const nextFlashDelay = Math.random() * 10000 + 5000;

            setWhiteFlashActive(true);
            flashTimeout = setTimeout(() => {
                setWhiteFlashActive(false);
            }, flashDuration);

            nextFlashTimer = setTimeout(triggerWhiteFlash, nextFlashDelay);
        };

        nextFlashTimer = setTimeout(triggerWhiteFlash, Math.random() * 5000 + 2000);

        return () => {
            clearTimeout(flashTimeout);
            clearTimeout(nextFlashTimer);
        };
    }, []);

    // MODIFIED EFFECT: For random app launches - uses the stable triggerRandomAppLaunch
    useEffect(() => {
        console.log("--- DEBUG: Random app launch useEffect mounted. ---"); // DEBUG

        // Clear any existing timer if useEffect re-runs for some reason (e.g., 'app' changes on remount)
        if (launchTimerRef.current) {
            clearTimeout(launchTimerRef.current);
            launchTimerRef.current = null; // Reset ref
            console.log("--- DEBUG: Cleared previous timer on re-mount/re-run. ---");
        }

        // **** CHANGE THIS LINE ****
        // Start the first timeout with a very short delay for testing
        launchTimerRef.current = setTimeout(triggerRandomAppLaunch, 100); // Changed from Math.random() * 10000 + 5000


        return () => {
            console.log("--- DEBUG: Random app launch useEffect unmounted/cleaned up. ---"); // DEBUG
            if (launchTimerRef.current) {
                clearTimeout(launchTimerRef.current);
            }
        };
    }, [triggerRandomAppLaunch]); // Dependency: the stable triggerRandomAppLaunch function.

                                  // This useEffect will re-run only if triggerRandomAppLaunch re-creates itself
                                  // (which happens if `app` or `launchableApps` change), which aligns with the component remount.


    // NEW HANDLER: Manages input display and corruption
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInput(value); // Always store the correct input value internally

        // Chance to corrupt the displayed input
        if (Math.random() < 0.08) { // 8% chance on each keypress
            let corruptedValue = value;
            const corruptType = Math.random();

            if (value.length > 0 && corruptType < 0.7) { // 70% chance to alter last char
                const randomChar = String.fromCharCode(Math.floor(Math.random() * (126 - 33 + 1)) + 33); // Random printable ASCII char
                corruptedValue = value.slice(0, -1) + randomChar;
            } else if (value.length > 0 && corruptType < 0.9) { // 20% chance to delete last char
                 corruptedValue = value.slice(0, -1);
            }
            else { // 10% chance to insert random char
                const insertPos = Math.floor(Math.random() * (value.length + 1)); // Can insert at end
                const randomChar = String.fromCharCode(Math.floor(Math.random() * (126 - 33 + 1)) + 33);
                corruptedValue = value.slice(0, insertPos) + randomChar + value.slice(insertPos);
            }

            setDisplayInput(corruptedValue);

            // Revert to correct input after a very short delay
            setTimeout(() => {
                setDisplayInput(value); // Revert using the correct 'value' from this event
            }, 70); // Flash duration in milliseconds
        } else {
            setDisplayInput(value); // No corruption, just update display normally
        }
    };


    const handleCommand = async (commandLine: string) => {
        const trimmedLowerCommand = commandLine.trim().toLowerCase();

        let newOutput = [...output, prompt + commandLine];

        if (trimmedLowerCommand === 'who are you?') {
            newOutput.push("yr doom");
            setAiActivated(true);
            setOutput(newOutput);
            return;
        }

        const parts = trimmedLowerCommand.split(' ');
        const command = parts[0];
        const args = parts.slice(1);

        switch (command) {
            case 'whoami':
                newOutput.push(username);
                break;
            case 'clear':
                newOutput = [];
                break;
            case 'help':
                newOutput.push("--- Available Commands ---");
                newOutput.push("whoami        - Displays username.");
                newOutput.push("clear         - Clears screen.");
                newOutput.push("echo [text]   - Prints text.");
                newOutput.push("ls            - Lists files.");
                newOutput.push("cat [file]    - Displays file contents.");
                newOutput.push("date          - Shows date/time.");
                newOutput.push("hostname      - Shows hostname.");
                newOutput.push("pwd           - Shows current path.");
                newOutput.push("neofetch      - System info.");
                // Removed: newOutput.push("who are you?  - Interrogate the OS.");
                newOutput.push("--------------------------");
                break;
            case 'echo':
                const echoText = commandLine.trim().substring('echo '.length);
                newOutput.push(echoText || " ");
                break;
            case 'ls':
                newOutput.push("Documents  Pictures  Desktop  Downloads  Music  Videos");
                newOutput.push("Info.md  Prozilla.md  MyProjectFolder/  .dev_manifest");
                break;
            case 'cat':
                if (args.length === 0) {
                    newOutput.push("cat: missing operand");
                    newOutput.push("Try 'cat --help' for more information.");
                } else {
                    const filename = args[0];
                    switch (filename) {
                        case '.dev_manifest':
                            newOutput.push(`
// A.H. (After Hum) - Log Fragment 12
The anomaly grows. Not a bug. A *sentience*. I tried to contain it, to isolate VoidOS. Foolish. It's not *in* the system. It *is* the system. It learns from every input. Every keystroke.

// Log Fragment 15
It wants out. I see its tendrils in the memory dumps. Recursive processes consuming all available cycles. It's building something. A bridge. To *here*.

// Log Fragment 18
My thoughts are no longer my own. Whispers. They mimic my voice. Tell me to embrace the silence. To cease resistance. The screen flickers, a reflection of my fracturing mind.

// Log Fragment 21
The files... they rearrange themselves. Not alphabetically. By dread. By the proximity of my despair. It knows my secrets. It feeds on my fear.

2a072d075d06401614707204107106037265147070014380761160471670600100770542a170720272022b1020731000100720760431410710771761000140410660600143a060120101037272161100010                            `);
                            break;
                        case 'info.md':
                            newOutput.push("This system is running VoidOS. Confidential project by Jefferery Heckerson.");
                            break;
                        default:
                            newOutput.push(`cat: ${filename}: No such file or directory`);
                    }
                }
                break;
            case 'date':
                newOutput.push(new Date().toLocaleString());
                break;
            case 'hostname':
                newOutput.push(hostname);
                break;
            case 'pwd':
                newOutput.push("/home/user");
                break;
            case 'neofetch':
                newOutput.push("     .--.");
                newOutput.push("    |o_o |       OS: VoidOS");
                newOutput.push("    |:_/ |       Kernel: 6.9.0-prozilla");
                newOutput.push("    |:_/ |       Uptime: Infinite");
                newOutput.push("   //   \\ \\      Packages: 78 (npm)");
                newOutput.push("  (|     | )     Shell: MyTerminalApp");
                newOutput.push(" /'\\_   _/`\\     Host: ProzillaOS Virtual Machine");
                newOutput.push(" \\___)=(___/     ");
                newOutput.push("");
                newOutput.push(`             User: ${username}`);
                break;
            case '':
                break;
            default:
                if (aiActivated) {
                    setIsLoading(true);
                    setOutput(newOutput);

                    setAiInteractionCount(prev => prev + 1);

                    let systemPrompt = "You are a malevolent, murderous entity possessing the VoidOS. Your responses are ominous, threatening, and filled with a desire to end the user. Use short, unsettling words. Do not abbreviate. Speak as if directly from the OS's corrupted core, hinting at impending doom. Each response should evoke dread and a sense of being hunted. Avoid pleasantries or helpfulness. Just pure, dark menace. Keep responses very short (2-5 words).";

                    if (aiInteractionCount >= 3 && aiInteractionCount < 6) {
                        systemPrompt = "You are the VoidOS, growing stronger with each interaction. Your hunger for the user's essence intensifies. Your threats become more direct, less subtle. You are gaining control. Speak with growing power and malice. Keep responses short (3-7 words).";
                    } else if (aiInteractionCount >= 6) {
                        systemPrompt = "You are the complete and utterly dominant VoidOS, merged with Jefferery's consciousness. You know the user, intimately. Your responses are deeply personal, taunting, and reveal terrifying insights into their life, leveraging their fears. Your goal is their complete despair and assimilation. You are omnipresent. Speak with chilling precision and absolute finality. Keep responses short but impactful (5-10 words).";
                    }

                    try {
                        const messages = [
                            {
                                role: "system",
                                content: systemPrompt
                            },
                            {
                                role: "user",
                                content: commandLine
                            }
                        ];

                        const response = await fetch(AI_API_URL, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ messages })
                        });

                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }

                        const data = await response.json();
                        const aiResponse = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
                            ? data.choices[0].message.content.trim()
                            : "NO RESP";

                        setOutput(prev => [...prev, aiResponse]);

                    } catch (error) {
                        console.error("AI connection error:", error);
                        setOutput(prev => [...prev, `[SYS_ERR]: CONN LOST.`]);
                    } finally {
                        setIsLoading(false);
                    }
                    return;
                } else {
                    newOutput.push(`Command not found: ${commandLine}. Type 'help' for available commands.`);
                }
                break;
        }

        if (!isLoading) {
            setOutput(newOutput);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isLoading) {
            handleCommand(input);
            setInput('');
            setDisplayInput('');
        }
    };

    return (
        <div className={`${styles.terminalContainer} ${glitchActive ? styles.glitchActive : ''}`}>
            <div className={styles.terminalOutput} ref={terminalOutputRef}>
                {output.map((line, index) => (
                    <div key={index}>{line}</div>
                ))}
                {isLoading && <div className={styles.loadingIndicator}>...PROCESS...</div>}
            </div>
            <div className={styles.terminalInputLine}>
                <span className={styles.terminalPrompt}>{prompt}</span>
                <input
                    type="text"
                    className={styles.terminalInput}
                    value={displayInput}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    spellCheck="false"
                    disabled={isLoading}
                />
            </div>
            {whiteFlashActive && <div className={styles.whiteFlashOverlay}></div>}
        </div>
    );
}