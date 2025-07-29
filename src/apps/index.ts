// src/apps/index.ts
import { App } from "prozilla-os";
import { MyTerminalApp as MyTerminalAppComponent } from "../components/MyTerminalApp";
import { MyTextEditorApp as MyTextEditorAppComponent } from "../components/MyTextEditorApp";
import { LockedNotesApp as LockedNotesAppComponent } from "../components/LockedNotesApp";

export const myTerminalApp = new App("Terminal", "my-custom-terminal-app", MyTerminalAppComponent)
    .setDescription("A custom terminal with AI and horror elements.")
    .setIconUrl("/icons/terminal.png"); // Make sure this icon exists!

export const myTextEditorApp = new App("Text Editor", "my-custom-text-editor", MyTextEditorAppComponent)
    .setDescription("A corrupted text editor with unsettling entries.")
    .setIconUrl("/icons/text-editor.png"); // Make sure this icon exists!

export const myLockedNotesApp = new App("Encrypted Notes", "locked-notes", LockedNotesAppComponent)
    .setDescription("An encrypted note-taking application containing chilling secrets.")
    .setIconUrl("/icons/notes.png"); // Make sure this icon exists!