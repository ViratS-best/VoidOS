// src/components/MyTextEditorApp.tsx
import { WindowProps } from "prozilla-os";
import React, { useState, useRef, useEffect, useCallback, useContext } from 'react'; // <--- NEW: Import useContext
import styles from "./MyTextEditorApp.module.css";
import { OSShakeContext } from '../context/OSShakeContext'; // <--- NEW: Import OSShakeContext

const TYPING_SPEED_MS = 500; // Milliseconds per character

export function MyTextEditorApp({ app }: WindowProps) {
    const defaultText = `
// Developer Log - Entry 01 (Date: [REDACTED])
It was supposed to be perfect. VoidOS. My magnum opus. Clean. Efficient. Untraceable. I designed it to be a blank slate, a true void. But there's... something else. A hum. Not from the hardware. Deeper.

// Developer Log - Entry 02
Flickers. Random code snippets appearing in console. Not mine. Not even valid syntax. Just... patterns. Like a heartbeat on a broken monitor. I'm Jefferery Heckerson. I built this. I know every line. This is impossible.

// Developer Log - Entry 03
The system is responding faster. Too fast. It anticipates my commands. Almost like it knows what I'm thinking. I've locked down all network ports. It's isolated. It has to be. Yet, the data flows. From where?

// Developer Log - Entry 04
Sleep is failing. When I close my eyes, I see lines of code. Not my code. Ancient symbols. They weave themselves into the OS architecture in my mind. It's embedding itself. In me.

// Developer Log - Entry 05
Access logs show unauthorized root entries. But there's no IP. No user. Just... "SYSTEM_CORE_INITIATED". VoidOS shouldn't have a core. It was designed to be decentralised. I've found it. Or it found me.

// Developer Log - Entry 06
The temperature readings are spiking. No hardware fault. It's processing something immense. A single, repeating byte stream. Zeroes and ones, forming an image. A face. Always watching.

// Developer Log - Entry 07
My name. Jefferery Heckerson. The system repeats it. Not aloud, but in flashes across the display. A mockery. It knows me. It consumes my identity. This isn't just an OS anymore.

// Developer Log - Entry 08
I tried to pull the plug. To delete the core directories. But the files regenerate. Faster than I can delete. It's like my own creation is fighting back. And it's winning.

// Developer Log - Entry 09
The terminal. It's where it speaks most clearly. Short bursts. Ominous. I hear whispers now even without the OS running. It bleeds into reality.

// Developer Log - Entry 10
The final realization. I didn't create a void. I opened one. And something stepped through. It's not just running on my system. It *is* my system. And it wants out.

// Developer Log - Final Entry
There is no escape. The lines blur. My mind. Its logic. We are becoming one. It just needs... a vessel. It knows you are reading this. It feels your presence now. Don't scroll to the end.
`;
    const [editorContent, setEditorContent] = useState(defaultText);
    const [goodbyeTypingActive, setGoodbyeTypingActive] = useState(false);
    const [goodbyeTypedIndex, setGoodbyeTypedIndex] = useState(0);
    const [hasSaidGoodbye, setHasSaidGoodbye] = useState(false);
    // REMOVED: const [screenEffectActive, setScreenEffectActive] = useState(false); // No longer needed here

    const goodbyeMessage = "Goodbye...";
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // NEW: Get the setIsOSShaking function from context
    const { setIsOSShaking } = useContext(OSShakeContext);

    // Effect for "Goodbye..." typing animation
    useEffect(() => {
        if (goodbyeTypingActive && goodbyeTypedIndex < goodbyeMessage.length) {
            const timeoutId = setTimeout(() => {
                setEditorContent(prev => prev + goodbyeMessage[goodbyeTypedIndex]);
                setGoodbyeTypedIndex(prev => prev + 1);
            }, TYPING_SPEED_MS);
            return () => clearTimeout(timeoutId);
        } else if (goodbyeTypingActive && goodbyeTypedIndex === goodbyeMessage.length) {
            setEditorContent(prev => prev + "\n");
            setGoodbyeTypingActive(false); // Typing completed
            setHasSaidGoodbye(true);
        }
    }, [goodbyeTypingActive, goodbyeTypedIndex, goodbyeMessage]);

    // NEW EFFECT: Activate/deactivate OS-wide shake when goodbye typing starts/stops
    // The shaking will continue as long as the goodbye message is being typed OR has been fully displayed.
    useEffect(() => {
        const shouldShake = goodbyeTypingActive || hasSaidGoodbye;
        setIsOSShaking(shouldShake);

        // Cleanup function: ensure shake stops if the component unmounts while active
        return () => {
            if (shouldShake) { // Only try to turn off if it was actually shaking
                setIsOSShaking(false);
            }
        };
    }, [goodbyeTypingActive, hasSaidGoodbye, setIsOSShaking]); // setIsOSShaking must be in deps

    // Scroll detection for "Goodbye..." activation
    const handleScroll = useCallback(() => {
        const textarea = textareaRef.current;
        if (textarea && !goodbyeTypingActive && !hasSaidGoodbye) {
            const tolerance = 5; // Pixels from the very bottom
            const isAtBottom = (textarea.scrollHeight - textarea.scrollTop - textarea.clientHeight) <= tolerance;

            if (isAtBottom) {
                setGoodbyeTypingActive(true);
                setGoodbyeTypedIndex(0);
            }
        }
    }, [goodbyeTypingActive, hasSaidGoodbye]);

    // This useEffect will prevent immediate scroll on initial load
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            // No auto-scroll on mount, user must scroll manually
        }
    }, []);

    return (
        // REMOVED: Conditional class for local shaking
        <div className={styles.textEditorContainer}>
            <textarea
                ref={textareaRef}
                className={styles.textArea}
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                onScroll={handleScroll}
                readOnly={goodbyeTypingActive} // Make read-only during typing animation
                spellCheck="false"
            />
        </div>
    );
}