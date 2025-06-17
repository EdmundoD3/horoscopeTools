import { themesByFrequency } from "../../shared/constants.js";
import { initThemes } from "./generatehtml.js";

const key = "bulkKey"
class FormStorage {
  constructor(key = "defaultKey") {
    this.key = key
    const item = localStorage.getItem(this.key)
    let itemJson = null;
    if (item) {
      try {
        itemJson = JSON.parse(item);
      } catch (e) {
        console.warn('Error parsing localStorage item:', e);
      }
    }
    console.log(itemJson?.theme);
    this.sign = document.getElementById('sign')
    if (itemJson?.sign) this.sign?.value = itemJson.sign;
    this.type = document.getElementById('frequency')
    this.type.value = itemJson?.type??"daily";
    this.lang = document.getElementById('lang')
    if (itemJson?.lang) this.lang?.value = itemJson.lang;

    initThemes(themesByFrequency[this.type.value])
    this.theme = document.getElementById('theme')
    if (itemJson?.theme) this.theme?.value = itemJson.theme;
  }
  save() {
    const { sign, type, lang, theme } = this.getValue()
    
    let obj = {}
    if (sign) obj.sign = sign
    if (type) obj.type = type
    if (lang) obj.lang = lang
    if (theme) obj.theme = theme
    localStorage.setItem(this.key,JSON.stringify(obj))
  }
  getValue() {
    const sign = this.sign.value
    const type = this.type.value
    const lang = this.lang.value
    const theme = this.theme.value
    return { sign, type, lang, theme }
  }
}

const formStorage = new FormStorage(key)


document.getElementById('bulkForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const { sign, type, lang, theme } = formStorage.getValue()
  formStorage.save()
  const rawInput = document.getElementById('bulkInput').value;
  const errorEl = document.getElementById('error');

  let entries;
  try {
    entries = JSON.parse(rawInput);
    if (!Array.isArray(entries) || !entries.every(e => e.title && e.content)) {
      throw new Error('Cada entrada debe tener "title" y "content"');
    }
  } catch (err) {
    errorEl.textContent = 'Error en el formato JSON: ' + err.message;
    return;
  }

  const body = {
    sign,
    type,
    lang,
    theme,
    entries
  };
  try {
    const res = await fetch('/api/entries/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Error desconocido');
    }
    console.log('Entradas agregadas correctamente');
    alert('Entradas agregadas correctamente');
    document.getElementById('bulkInput').value = ""
    document.getElementById('error').textContent = ""
  } catch (err) {
    console.log(err);
    errorEl.textContent = 'Error al enviar: ' + err.message;
  }
});