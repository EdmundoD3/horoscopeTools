import { validFrequencies, validLanguages, validSigns, validThemes } from "../../shared/constants.js"

const createOption = (value, label) => {
  const option = document.createElement("option")
  option.value = value
  option.label = label ?? value
  return option
}
function addSelects(id, data) {
  const select = document.getElementById(id)
  if(!select)return;
  data.forEach(e => {
    select.appendChild(createOption(e, e))
  });
}
const addSign = () =>
  addSelects("sign", validSigns)
const addFrequency =() => 
  addSelects("type", validFrequencies)
const addLang = () => addSelects("lang", validLanguages)
const addTheme = () => addSelects("theme", validThemes)

addSign()
addFrequency()
addLang()
addTheme()