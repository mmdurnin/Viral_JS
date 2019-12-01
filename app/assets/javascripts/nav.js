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



    const createDropDown = () => {
        const filterTitle = document.createElement("h3")
        filterTitle.innerHTML = "Select filters"
        nav.appendChild(filterTitle)

        const diseaseForm = document.createElement("form")

        diseaseForm.innerHTML = diseaseNames.map((disease, i) => {
            return `
                <li className="disease-input">
                <input type="checkbox" value="false" data-index=${i} key=${disease.name} />
                <label for="item${i}">${disease.name}</label>
                </li>
            `;
        }).join('');

        const submitFilters = document.createElement("input")
        submitFilters.className = "submit-filters"
        submitFilters.id = "submit-filters"
        submitFilters.type = "submit"
        diseaseForm.appendChild(submitFilters)

        filterTitle.className = "nav-title-conceal"
        diseaseForm.className = "nav-form-conceal"
        diseaseForm.id = "disease-form"
        nav.appendChild(diseaseForm)

    }



    createDropDown();

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

        const navTitle = document.querySelector("h3")
        navTitle.className = "nav-title-reveal"

        const navForm = document.querySelector("form")
        navForm.className = "nav-form-reveal"
    };

    const handleConceal = () => {
        navStatus = "closed"
        button.innerHTML = "Open"
        nav.className = "nav-conceal"

        const navTitle = document.querySelector("h3")
        navTitle.className = "nav-title-conceal"

        const navForm = document.querySelector("form")
        navForm.className = "nav-form-conceal"
    }

    button.addEventListener("click", handleNav);
}
