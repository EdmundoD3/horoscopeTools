document.getElementById('sign').addEventListener('change', generatePrompt);
document.getElementById('type').addEventListener('change', generatePrompt);
document.getElementById('lang').addEventListener('change', generatePrompt);
document.getElementById('theme').addEventListener('change', generatePrompt);

function generatePrompt() {
  const sign = document.getElementById('sign').value;
  const type = document.getElementById('type').value;
  const lang = document.getElementById('lang').value;
  const theme = document.getElementById('theme').value;

  if (!sign || !type || !lang || !theme) {
    document.getElementById('promp').value = '';
    return;
  }

  const t = translations[lang];
  const translatedSign = t.signs[sign];
  const translatedType = t.frequencies[type];
  const desactivarSigno = sign=="all"?"":`para el signo ${translatedSign}, `;
  const prompt = `${t.intro} ${theme}, ${desactivarSigno}de tipo ${translatedType}, ${t.based}, ${t.disguise}. ${t.format}`;

  document.getElementById('promp').value = prompt;
}