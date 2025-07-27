// src/apps/myTextEditorApp.ts
import { App } from "prozilla-os";
import { MyTextEditorApp } from "../components/MyTextEditorApp"; // Correct import path for the React component

const name = "Text Editor"; // Keep the same name to replace the old one
const id = "my-custom-text-editor"; // A unique ID for your new text editor

// Create an instance of the ProzillaOS App class
const myTextEditorApp = new App(name, id, MyTextEditorApp)
    .setDescription("A corrupted text editor with unsettling entries.")
    .setIconUrl("/text.png"); // Make sure text.png exists in your public folder

export { myTextEditorApp };