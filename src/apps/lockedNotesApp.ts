// src/apps/lockedNotesApp.ts
import { App } from "prozilla-os";
import { LockedNotesApp as LockedNotesAppComponent } from "../components/LockedNotesApp";

const name = "Encrypted Notes";
const id = "locked-notes";

const myLockedNotesApp = new App(name, id, LockedNotesAppComponent)
    .setDescription("An encrypted note-taking application containing chilling secrets.")
    .setIconUrl(`${import.meta.env.BASE_URL}icons/notes.png`);

export { myLockedNotesApp };
