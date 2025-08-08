// src/apps/myTextEditorApp.ts
import { App } from "prozilla-os";
import { MyTextEditorApp } from "../components/MyTextEditorApp";

const name = "Text Editor";
const id = "my-custom-text-editor";

const myTextEditorApp = new App(name, id, MyTextEditorApp)
    .setDescription("A corrupted text editor with unsettling entries.")
    .setIconUrl(`${import.meta.env.BASE_URL}text.png`);

export { myTextEditorApp };