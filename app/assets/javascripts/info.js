const content = document.createElement("div")

const title = document.createElement("h2")
title.innerText = "Welcome to Viral!"
content.appendChild(title)

const p1 = document.createElement("p")
p1.innerText = "Viral is a data visualization tool for viewing disease trends from state-to-state."
content.appendChild(p1)

const h2 = document.createElement("h3")
h2.innerText ="Data Representation"
const p2 = document.createElement("p")
p2.innerText = "The smaller points on this map represent the rate per 100,000. The larger points on the map represent diseases with higher rates, for which we display reported cases per 10,000. For a reference to each disease representation, please see to the key (bottom right)."
content.appendChild(h2)
content.appendChild(p2)

const p3 = document.createElement("p")
p3.innerText = "Due to limited access to county-specific morbidity data, the points on the map are randomized within state boundaries. Points for this visualization were favored to color shading - the points on the map are meant to symbolize the spread of germs."
content.appendChild(p3)

const h3 = document.createElement("h3")
h3.innerText = "Project Updates"
const p4 = document.createElement("p")
p4.innerText = "This project was created before the COVID-19 pandemic. A second view of the map is now available for viewing COVID data and is accessible from the same Filters tray."
content.appendChild(h3)
content.appendChild(p4)

const h4 = document.createElement("h3")
h4.innerText = "Sources:"
const p5 = document.createElement("p")
p5.innerText = "The data for this project were collected from the World Health Organization and the Centers for Disease Control and Prevention."
content.appendChild(h4)
content.appendChild(p5)

const who = document.createElement("a");
who.href = "https://www.who.int/"
who.innerHTML = "Visit WHO website"
who.target = "_blank"
content.appendChild(who)

content.appendChild(document.createElement("br"))

const cdc = document.createElement("a");
cdc.href = "https://gis.cdc.gov/grasp/nchhstpatlas/tables.html"
cdc.innerHTML = "Visit CDC website"
cdc.target = "_blank"
content.appendChild(cdc)

content.appendChild(document.createElement("br"))

const cdcCovid = document.createElement("a");
cdcCovid.href = "https://gis.cdc.gov/grasp/nchhstpatlas/tables.html"
cdcCovid.innerHTML = "Visit CDC COVID tracking database"
cdcCovid.target = "_blank"
content.appendChild(cdcCovid)


window.addEventListener("DOMContentLoaded", () => {
    const infoButton = document.getElementById('info-button')
    const infoWindow = document.getElementById('info')
    const infoModal = document.getElementById('info-modal')

    infoModal.appendChild(content);
    
    let modalStatus = "closed"
    
    const handleModal = (e) => {
        if (e.path.includes(document.getElementById("info-modal"))) return
        if (modalStatus === "closed") {
            modalStatus = "open";
            infoButton.innerText = "Close"

            infoWindow.classList = "active-modal-back"
            infoModal.classList = "active-modal-front"
        } else {
            modalStatus = "closed";
            infoButton.innerText = "About Viral"
            infoWindow.classList.remove("active-modal-back")
            infoModal.classList.remove("active-modal-front")
        }
    }

    infoButton.addEventListener("click", handleModal)
    infoWindow.addEventListener("click", (e) => handleModal(e))
    infoModal.addEventListener("click", () => {return})

})