const signsEs = {
  aries: 'Aries', tauro: 'Tauro', geminis: 'Géminis', cancer: 'Cáncer',
  leo: 'Leo', virgo: 'Virgo', libra: 'Libra', escorpio: 'Escorpio',
  sagitario: 'Sagitario', capricornio: 'Capricornio', acuario: 'Acuario',
  piscis: 'Piscis', all: 'Todos los signos'
}
const signsEn = {
  aries: 'Aries', tauro: 'Taurus', geminis: 'Gemini', cancer: 'Cancer',
  leo: 'Leo', virgo: 'Virgo', libra: 'Libra', escorpio: 'Scorpio',
  sagitario: 'Sagittarius', capricornio: 'Capricorn', acuario: 'Aquarius',
  piscis: 'Pisces', all: 'All signs'
}
const frequenciesEs = {
  daily: 'diario', weekly: 'semanal', monthly: 'mensual', yearly: 'anual'
}
const frequenciesEn = {
  daily: 'daily', weekly: 'weekly', monthly: 'monthly', yearly: 'yearly'
}
const translations = {
  'es': {
    langName: 'Español Latinoamérica',
    intro: "Eres un astrólogo emocional y místico que conecta profundamente con las energías sutiles del universo. Tu estilo es cálido, introspectivo, ligeramente poético. Quiero varios horóscopos sobre",
    based: 'enfocado en personas emocionales',
    format: "Quiero que el resultado tenga formato [{title, content}].",
    disguise: 'utiliza de forma disfrazada de horóscopo situaciones comunes y consejos reales basados en estudios sociales, pero de forma mística. con un tono aleatorio como: "suave, esperanzador, introspectivo, espiritual, inspirador, melancólico pero luminoso"',
    signs: signsEs,
    frequencies: frequenciesEs
  },
  'en': {
    langName: 'American English',
    intro: "I want multiple horoscopes about",
    based: 'focused on people from the United States',
    format: "I want the result to be formatted as [{title, content}].",
    disguise: 'written like a horoscope, but using real-life advice and social insights in a mystical way',
    signs: signsEn,
    frequencies: frequenciesEn
  }
};