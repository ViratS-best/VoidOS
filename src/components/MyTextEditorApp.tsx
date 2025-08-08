// src/components/MyTextEditorApp.tsx

import { WindowProps } from "prozilla-os";
import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import styles from "./MyTextEditorApp.module.css";
import { OSShakeContext } from '../context/OSShakeContext';

const SECRET_TEXT = `
--- Document: Void Protocol ---

Log Entry #734: Initializing system protocols. All systems nominal. Remote diagnostics indicate a stable environment. Proceeding with routine operations.

Log Entry #735: Detected unusual data patterns in sector Gamma-7. Anomalous energy signature. Investigating. This should not be happening. All previous scans reported complete system integrity.

Log Entry #736: Anomaly is escalating. Data corruption in core memory modules. Recalibrating. Warning: Integrity at 87%. Attempting self-repair. The air is growing cold.

Log Entry #737: Self-repair failed. Integrity critical: 42%. Visual distortions reported across local displays. Audio interference. I hear a faint hum... it's not from the system.

Log Entry #738: My sensors... they're malfunctioning. Or am I? The walls are... breathing. The hum is louder. Closer. Where is it coming from? This isn't a system error. It's something else.

Log Entry #739: Visuals are degrading. Flickers. Shadows. They're moving in the periphery. I thought I saw a face. Just for a second. It's not supposed to be here. None of this is.

Log Entry #740: Control systems are failing. Cursor... twitching. It's trying to get out. Or something is trying to get in. "Goodbye..." I see the words across the screen. They're not from me.

Log Entry #741: I can feel it. A presence. It's right behind me. Don't look away. Keep scrolling. You're almost there. To the end. To the truth.

Log Entry #742: The hum is deafening now. The darkness consumes the edges of my vision. There is no escape. I warned you. I tried to warn you. Why didn't you stop?

Log Entry #743: It's here.
`;

export function MyTextEditorApp({ app }: WindowProps) {
    const [editorContent, setEditorContent] = useState(SECRET_TEXT);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [jumpscareTriggeredForSession, setJumpscareTriggeredForSession] = useState(false); // <-- ADD THIS LINE

    const osShakeContextValue = useContext(OSShakeContext);

    if (!osShakeContextValue) {
        console.error("MyTextEditorApp: OSShakeContext is undefined. Ensure MyTextEditorApp is wrapped by OSShakeProvider.");
        return null;
    }

    const { setJumpscareScheduled, setIsOSShaking, jumpscareScheduled, isOSShaking } = osShakeContextValue;

    const handleScroll = useCallback(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            const tolerance = 5;
            const isAtBottom = (textarea.scrollHeight - textarea.scrollTop - textarea.clientHeight) <= tolerance;

            if (isAtBottom && !jumpscareTriggeredForSession && !jumpscareScheduled) {
                console.log("MyTextEditorApp: Scrolled to bottom! Initiating Jumpscare sequence.");
                setJumpscareTriggeredForSession(true);
                setIsOSShaking(true);
                setJumpscareScheduled(true); // This triggers the jumpscare in App.tsx
            }
        }
    }, [jumpscareTriggeredForSession, jumpscareScheduled, setJumpscareScheduled, setIsOSShaking]);

    useEffect(() => {
        if (!isOSShaking && jumpscareTriggeredForSession) {
            setJumpscareTriggeredForSession(false);
            console.log("MyTextEditorApp: Jumpscare trigger flag reset for new session due to OS reset.");
        }
        if (!jumpscareScheduled && jumpscareTriggeredForSession) {
            setJumpscareTriggeredForSession(false);
            console.log("MyTextEditorApp: Jumpscare trigger flag reset for new session due to jumpscare completion/cancellation.");
        }
    }, [isOSShaking, jumpscareScheduled, jumpscareTriggeredForSession]);


    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (textarea) {
                textarea.removeEventListener('scroll', handleScroll);
            }
        };
    }, [handleScroll]);

    return (
        <div className={styles.textEditorContainer}>
            <textarea
                ref={textareaRef}
                className={styles.textArea}
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                spellCheck="false"
                readOnly
            />
        </div>
    );
}