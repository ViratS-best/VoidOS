// src/apps/myTextEditorApp.ts - This file should NOT contain JSX
import { App } from "prozilla-os";
import { MyTextEditorApp } from "../components/MyTextEditorApp"; // Correct import path

const name = "Text Editor"; // Keep the same name to replace the old one
const id = "my-custom-text-editor"; // A unique ID for your new text editor

const myTextEditorApp = new App(name, id, MyTextEditorApp)
	.setDescription("A corrupted text editor with unsettling entries.")
 	.setIconUrl("/text.png");

export { myTextEditorApp };