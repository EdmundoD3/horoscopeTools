import { validFrequencies } from "../constants.js";

export class HoroscopeEntry {
  constructor({
    id,
    sign,
    type,
    lang,
    theme,
    title,
    content,
    lastSend,
    createdAt
  }) {
    if(!content||!title) throw new Error("faltan content o title")
    if(!validFrequencies.includes(type)) throw new Error("frecuencia no valida")
    this.id = id;
    this.sign = sign !== undefined ? sign : 'all';
    this.type = type;
    this.lang = lang;
    this.theme = theme;
    this.title = title;
    this.content = content;
    this.lastSend = lastSend ?? null;
    this.createdAt = createdAt ?? null;
  }
}
