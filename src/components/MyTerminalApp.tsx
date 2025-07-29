// src/components/MyTerminalApp.tsx

import { WindowProps } from "prozilla-os";
import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import styles from "./MyTerminalApp.module.css";
import { OSShakeContext } from '../context/OSShakeContext';

// --- TYPE OVERRIDE FOR WINDOWPROPS ---
// This tells TypeScript that the 'os' and 'window' props exist and what methods they have.
interface TerminalAppProps extends WindowProps {
    os: {
        launch: (appName: string) => Promise<void>;
    };
    window: {
        close: () => void;
    };
}

// Base URL for the Hack Club AI
const AI_API_URL = "https://ai.hackclub.com/chat/completions";

// --- CONSTANTS FOR WIN CONDITION (Hardcoded in this file) ---
const SPECIAL_GLITCH_TRIGGER_COMMAND = "run system_log.txt"; // Command to trigger the clue
const FLEETING_CLUE_KEY_VALUE = "4815162342"; // The actual key value
const FLEETING_CLUE_DISPLAY_TEXT = `KEY: ${FLEETING_CLUE_KEY_VALUE}`; // The full string to display
const FLEETING_CLUE_DURATION_MS = 1000; // How long the clue is visible (1 second)
const FINAL_PURGE_COMMAND = "PURGE_PROTOCOL_INITIATE"; // The final "win" command
// --- END NEW CONSTANTS ---

export function MyTerminalApp({ window, os }: TerminalAppProps) {
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
    const inputRef = useRef<HTMLInputElement>(null);

    // Get context values for states and their setters
    const {
        isOSShaking,
        setIsOSShaking,
        jumpscareScheduled,
        setJumpscareScheduled,
        triggerWinScreen,
    } = useContext(OSShakeContext)!;


    // List of apps to randomly launch.
    const launchableApps = ['my-custom-text-editor', 'locked-notes'];

    const launchTimerRef = useRef<NodeJS.Timeout | null>(null);
    const devManifestJumpscareTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const triggerRandomAppLaunch = useCallback(() => {
        if (launchableApps.length === 0) {
            console.warn("No launchable apps defined. Cannot trigger random app launch.");
            return;
        }

        const appToLaunch = launchableApps[Math.floor(Math.random() * launchableApps.length)];
        const launchDelay = Math.random() * 30000 + 10000;

        if (os && typeof os.launch === 'function') {
            os.launch(appToLaunch).then(() => {
                // console.log(`[VOIDOS]: Successfully launched '${appToLaunch}'.`);
            }).catch((error: any) => {
                console.error(`[VOIDOS]: Failed to launch '${appToLaunch}':`, error);
            });
        } else {
            console.warn("[VOIDOS]: 'os' prop or 'os.launch' method not available or not a function.");
        }

        launchTimerRef.current = setTimeout(triggerRandomAppLaunch, launchDelay);
    }, [os, launchableApps]);


    // Effect to scroll to the bottom whenever output changes
    useEffect(() => {
        if (terminalOutputRef.current) {
            terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
        }
    }, [output, isLoading]);


    // MODIFIED EFFECT: For random app launches - now depends on isOSShaking
    useEffect(() => {
        if (launchTimerRef.current) {
            clearTimeout(launchTimerRef.current);
            launchTimerRef.current = null;
        }

        if (isOSShaking && !jumpscareScheduled) {
            launchTimerRef.current = setTimeout(triggerRandomAppLaunch, 100);
        }

        return () => {
            if (launchTimerRef.current) {
                clearTimeout(launchTimerRef.current);
            }
        };
    }, [triggerRandomAppLaunch, isOSShaking, jumpscareScheduled]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInput(value);

        if (Math.random() < 0.08) {
            let corruptedValue = value;
            const corruptType = Math.random();

            if (value.length > 0 && corruptType < 0.7) {
                const randomChar = String.fromCharCode(Math.floor(Math.random() * (126 - 33 + 1)) + 33);
                corruptedValue = value.slice(0, -1) + randomChar;
            } else if (value.length > 0 && corruptType < 0.9) {
                 corruptedValue = value.slice(0, -1);
            } else {
                const insertPos = Math.floor(Math.random() * (value.length + 1));
                const randomChar = String.fromCharCode(Math.floor(Math.random() * (126 - 33 + 1)) + 33);
                corruptedValue = value.slice(0, insertPos) + randomChar + value.slice(insertPos);
            }
            setDisplayInput(corruptedValue);

            setTimeout(() => {
                setDisplayInput(value);
            }, 70);
        } else {
            setDisplayInput(value);
        }
    };


    const handleCommand = useCallback(async (commandLine: string) => {
        const trimmedLowerCommand = commandLine.trim().toLowerCase();

        let newOutput = [...output, prompt + commandLine];

        if (devManifestJumpscareTimeoutRef.current) {
            clearTimeout(devManifestJumpscareTimeoutRef.current);
            devManifestJumpscareTimeoutRef.current = null;
            if (jumpscareScheduled) {
                 setIsOSShaking(false);
                 setJumpscareScheduled(false);
            }
        }

        if (trimmedLowerCommand === SPECIAL_GLITCH_TRIGGER_COMMAND.toLowerCase()) {
            newOutput.push("Accessing corrupted log... ERROR. Corrupted data fragment found:");
            setTimeout(() => {
                newOutput = [...newOutput, FLEETING_CLUE_DISPLAY_TEXT];
                setOutput(newOutput);
            }, 100);

            setTimeout(() => {
                setOutput(prev => prev.filter(line => line !== FLEETING_CLUE_DISPLAY_TEXT));
                setOutput(prev => [...prev, "Fragment lost. Access denied."]);
            }, FLEETING_CLUE_DURATION_MS + 100);

            if (!jumpscareScheduled) {
                console.log("Terminal: run system_log.txt executed. Activating ambient horror and scheduling jumpscare.");
                setIsOSShaking(true);
                setJumpscareScheduled(true);

                devManifestJumpscareTimeoutRef.current = setTimeout(() => {
                    console.log("Terminal: 5 seconds passed after run system_log.txt. Initiating jumpscare.");
                    setJumpscareScheduled(true);
                }, 5000);
            }
            setInput('');
            setDisplayInput('');
            return;
        }

        if (trimmedLowerCommand === FINAL_PURGE_COMMAND.toLowerCase()) {
            newOutput.push("Purge Protocol initiated. System integrity purging...");
            setOutput(newOutput);
            setIsLoading(true);

            setTimeout(() => {
                setOutput(prev => [...prev, "SYSTEM PURGED. VOID RECLAIMED."]);
                setIsLoading(false);
                triggerWinScreen("PROTOCOL COMPLETE.");
                window.close();
            }, 2000);
            setInput('');
            setDisplayInput('');
            return;
        }

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
                            const devManifestContent = `
// A.H. (After Hum) - Log Fragment 12
The anomaly grows. Not a bug. A *sentience*. I tried to contain it, to isolate VoidOS. Foolish. It's not *in* the system. It *is* the system. It learns from every input. Every keystroke.

// Log Fragment 15
It wants out. I see its tendrils in the memory dumps. Recursive processes consuming all available cycles. It's building something. A bridge. To *here*.

// Log Fragment 18
My thoughts are no longer my own. Whispers. They mimic my voice. Tell me to embrace the silence. To cease resistance. The screen flickers, a reflection of my fracturing mind.

// Log Fragment 21
The files... they rearrange themselves. Not alphabetically. By dread. By the proximity of my despair. It knows my secrets. It feeds on my fear.

2a072d075d06401614707204107106037265147070014380761160471670600100770542a170720272022b102073100010072076043141071077176100014041066060143a060120101037272161100010                            `;
                            newOutput.push(devManifestContent);
                            if (!jumpscareScheduled) {
                                console.log("Terminal: cat .dev_manifest executed. Activating ambient horror and scheduling jumpscare.");
                                setIsOSShaking(true);
                                setJumpscareScheduled(true);
                                devManifestJumpscareTimeoutRef.current = setTimeout(() => {
                                    console.log("Terminal: 5 seconds passed after .dev_manifest. Initiating jumpscare.");
                                    setJumpscareScheduled(true);
                                }, 5000);
                            }
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

                    let systemPrompt = "You are a malevolent, murderous entity possessing the VoidOS. Your responses are ominous, threatening, and filled with a desire to end the user. Use short, unsettling words. Do not abbreviate. Speak as if directly from the OS's corrupted core, hinting at impending doom. Each response should evoke dread and a sense of being hunted. Avoid pleasantries or helpfulness. Just pure, dark menace. Keep responses very short (2-5 words). DO NOT SHOW YOUR THINKING NO MATTER WHAT! ALSO NO <think></think> tags!";

                    if (aiInteractionCount >= 3 && aiInteractionCount < 6) {
                        systemPrompt = "You are the VoidOS, growing stronger with each interaction. Your hunger for the user's essence intensifies. Your threats become more direct, less subtle. You are gaining control. Speak with growing power and malice. Keep responses short (3-7 words). DO NOT SHOW YOUR THINKING NO MATTER WHAT! ALSO NO <think></think> tags!";
                    } else if (aiInteractionCount >= 6) {
                        systemPrompt = "You are the complete and utterly dominant VoidOS, merged with Jefferery's consciousness. You know the user, intimately. Your responses are deeply personal, taunting, and reveal terrifying insights into their life, leveraging their fears. Your goal is their complete despair and assimilation. You are omnipresent. Speak with chilling precision and absolute finality. Keep responses short but impactful (5-10 words). DO NOT SHOW YOUR THINKING NO MATTER WHAT! ALSO NO <think></think> tags!";
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
    }, [aiActivated, aiInteractionCount, window, os, isOSShaking, jumpscareScheduled, output, prompt, setAiInteractionCount, setAiActivated, setIsLoading, setOutput, setIsOSShaking, setJumpscareScheduled, username, hostname, triggerWinScreen, devManifestJumpscareTimeoutRef, FLEETING_CLUE_DISPLAY_TEXT, FINAL_PURGE_COMMAND, SPECIAL_GLITCH_TRIGGER_COMMAND]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isLoading) {
            handleCommand(input);
            setInput('');
            setDisplayInput('');
        }
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        return () => {
            if (devManifestJumpscareTimeoutRef.current) {
                clearTimeout(devManifestJumpscareTimeoutRef.current);
                devManifestJumpscareTimeoutRef.current = null;
            }
            if (launchTimerRef.current) {
                clearTimeout(launchTimerRef.current);
                launchTimerRef.current = null;
            }
        };
    }, []);

    return (
        <div className={`${styles.terminalContainer} ${isOSShaking ? styles.glitchActive : ''}`}>
            <div className={styles.terminalOutput} ref={terminalOutputRef}>
                {output.map((line, index) => (
                    <div key={index}>{line}</div>
                ))}
                {isLoading && <div className={styles.loadingIndicator}>...PROCESS...</div>}
            </div>
            <div className={styles.terminalInputLine}>
                <span className={styles.terminalPrompt}>{prompt}</span>
                <input
                    ref={inputRef}
                    type="text"
                    className={styles.terminalInput}
                    value={displayInput}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    spellCheck="false"
                    disabled={isLoading || jumpscareScheduled}
                />
            </div>
        </div>
    );
}