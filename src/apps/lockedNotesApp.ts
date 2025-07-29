// src/apps/lockedNotesApp.ts
import { App } from "prozilla-os";
import { LockedNotesApp as LockedNotesAppComponent } from "../components/LockedNotesApp"; // Import the React component

const name = "Encrypted Notes";
const id = "locked-notes"; // Unique ID for this app

// Create an instance of the ProzillaOS App class for the locked notes
const myLockedNotesApp = new App(name, id, LockedNotesAppComponent)
    .setDescription("An encrypted note-taking application containing chilling secrets.")
    .setIconUrl("public/icons/notes.png"); // Ensure this icon exists in your public/icons folder

export { myLockedNotesApp };
