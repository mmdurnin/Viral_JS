let navStatus = "closed";

window.addEventListener('DOMContentLoaded', () => {
    return $.ajax({
        url: '/api/diseases/list',
        method: 'GET'
    }).then((diseaseNames) => makeNav(diseaseNames))
});

function makeNav(diseaseNames) {
    const nav_container = document.querySelector('.nav')
    const button = document.getElementById('nav-button')
    const nav = document.getElementById('nav')



    let diseases = []
    let diseaseLi;
    let diseaseName;

    for (let i = 0; i < diseaseNames.length; i++) {
        diseaseName = diseaseNames[i].name;
        diseaseLi = document.createElement("li");
        diseaseLi.innerHTML = diseaseName;
        diseases.push(diseaseLi)
    }

    console.log(diseases)

    const handleNav = () => {
        console.log("handleNav")
        if (navStatus === "closed") {
            return handleReveal();
        } else {
            return handleConceal();
        }
    }

    const handleReveal = () => {
        navStatus = "open"
        button.innerHTML = "Close"
        nav.className =  "nav-reveal"
    };

    const handleConceal = () => {
        navStatus = "closed"
        button.innerHTML = "Open"
        nav.className = "nav-conceal"
    }

    button.addEventListener("click", handleNav);
}
