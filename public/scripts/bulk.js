import { themesByFrequency } from "../../shared/constants.js";
import { initThemes } from "./generatehtml.js";

const STORAGE_KEY = "bulkKey";

class FormStorage {
  constructor(key = "defaultKey") {
    this.key = key;

    // Recuperar valores del localStorage
    const saved = this._loadFromStorage();

    // Referencias a elementos del DOM
    this.sign = document.getElementById("sign");
    this.type = document.getElementById("frequency");
    this.lang = document.getElementById("lang");
    this.theme = document.getElementById("theme");

    // Establecer valores por defecto si existen
    if (saved.sign) this.sign.value = saved.sign;
    this.type.value = saved.type ?? "daily";
    if (saved.lang) this.lang.value = saved.lang;

    // Inicializar temas disponibles según frecuencia
    initThemes(themesByFrequency[this.type.value]);

    if (saved.theme) this.theme.value = saved.theme;
  }

  _loadFromStorage() {
    try {
      const raw = localStorage.getItem(this.key);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.warn("Error parsing localStorage item:", e);
      return {};
    }
  }

  getValue() {
    return {
      sign: this.sign.value,
      type: this.type.value,
      lang: this.lang.value,
      theme: this.theme.value,
    };
  }

  save() {
    const data = this.getValue();
    const filtered = Object.fromEntries(
      Object.entries(data).filter(([_, val]) => !!val)
    );
    localStorage.setItem(this.key, JSON.stringify(filtered));
  }
}

const formStorage = new FormStorage(STORAGE_KEY);

document.getElementById("bulkForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const { sign, type, lang, theme } = formStorage.getValue();
  formStorage.save();

  const inputEl = document.getElementById("bulkInput");
  const errorEl = document.getElementById("error");

  let entries;
  try {
    entries = JSON.parse(inputEl.value);
    if (!Array.isArray(entries)) throw new Error("Debe ser un arreglo");

    for (const entry of entries) {
      if (!entry.title || !entry.content) {
        throw new Error('Cada entrada debe tener "title" y "content"');
      }
    }
  } catch (err) {
    errorEl.textContent = "Error en el formato JSON: " + err.message;
    return;
  }

  const payload = { sign, type, lang, theme, entries };

  try {
    const res = await fetch("/api/entries/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Error desconocido");
    }

    alert("Entradas agregadas correctamente");
    inputEl.value = "";
    errorEl.textContent = "";
  } catch (err) {
    console.error(err);
    errorEl.textContent = "Error al enviar: " + err.message;
  }
});
