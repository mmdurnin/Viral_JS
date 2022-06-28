const content = document.createElement("div")

const title = document.createElement("h2")
title.innerText = "Welcome to Viral!"
content.appendChild(title)

const p1 = document.createElement("p")
p1.innerText = "Viral is a data visualization tool for viewing annual disease trends from state-to-state."
content.appendChild(p1)

const h2 = document.createElement("h3")
h2.innerText ="Data Representation:"
const p2 = document.createElement("p")
p2.innerText = "The smaller points on this map represent the rate per 100,000. The larger points on the map represent diseases with higher rates (for this, we display reported cases per 10,000). For a reference to each disease representation, please see to the key (bottom right)."
content.appendChild(h2)
content.appendChild(p2)

const p3 = document.createElement("p")
p3.innerText = "Due to limited access to county-specific morbidity data, the points on the map are randomized within state boundaries. Points for this visualization were favored to color shading - the points on the map are meant to symbolize the spread of germs."
content.appendChild(p3)

const h4 = document.createElement("h3")
h4.innerText = "Sources:"
const p4 = document.createElement("p")
p4.innerText = "The data for this project were collected from the World Health Organization."
content.appendChild(h4)
content.appendChild(p4)

const who = document.createElement("a");
who.href = "https://www.who.int/"
who.innerHTML = "Visit WHO website"
who.target = "_blank"
content.appendChild(who)


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