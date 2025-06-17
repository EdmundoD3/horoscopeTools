import { monthlyThemes, validFrequencies, validLanguages, validSigns, dailyThemes, weeklyThemes, yearlyThemes, themesByFrequency } from "../../shared/constants.js"
const allThemes = [...dailyThemes,...weeklyThemes,...monthlyThemes,...yearlyThemes]
const createOption = (value, label) => {
  const option = document.createElement("option")
  option.value = value
  option.label = label ?? value
  return option
}

function addSelects({id, data,all}) {
  const select = document.getElementById(id)
  if (!select) return;
   while (select.firstChild) {
    select.removeChild(select.firstChild);
  }
  if(all) select.appendChild(createOption(all[0], all[1]))
  data.forEach(e => {
    select.appendChild(createOption(e, e))
  });
}

addSelects({id:"sign", data:validSigns})
addSelects({id:"sign-all", data:validSigns,all:["","Todos"]})
addSelects({id:"frequency", data:validFrequencies})
addSelects({id:"frequency-all", data:validFrequencies,all:["","Todos"]})
addSelects({id:"lang", data:validLanguages})
addSelects({id:"lang-all",data:validLanguages,all:["","Todos"]})
export const initThemes = (themes)=> addSelects({id:"theme", data:themes})
initThemes(dailyThemes)
addSelects({id:"theme-all", data:allThemes,all:["","Todos"]})


document.getElementById("frequency")?.addEventListener("change", (e) => {
  e.preventDefault();
  if (!e.target.value) return;
  addSelects({id:"theme", data:themesByFrequency[e.target.value]})
})
document.getElementById("frequency-all")?.addEventListener("change", (e) => {
  e.preventDefault();
  if (e.target.value=="") return addSelects({id:"theme-all", data:allThemes,all:["","Todos"]});
  addSelects({id:"theme-all", data:themesByFrequency[e.target.value],all:["","Todos"]})
})

function createAnchors(arr= []){
  return arr.map(({href,title})=>{
    const a = document.createElement("a")
    a.href = href
    a.textContent = title
    return a
  })
}
function createHeader() {
  const header = document.getElementById("header")
  
  const nav = document.createElement("nav")
  header.appendChild(nav)
  const urls = createAnchors([{href: "/", title: "bulk"},{href: "/manage", title: "manage"},{href: "/promp.html", title: "promp"}])
  urls.forEach(e=>nav.appendChild(e))
}
createHeader()