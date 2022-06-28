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



    const createFilterForm = () => {
        const filterTitle = document.createElement("h3")
        filterTitle.innerHTML = "Select filters"
        nav.appendChild(filterTitle)

        const diseaseForm = document.createElement("form")

        const annualDiseases = diseaseNames.filter(({name}) => name !== "COVID"); 

        const broadTrackersContent = annualDiseases.map((disease, i) => {

            const dName = disease.name.split(" ").join("_")
            let displayName = disease.name
            if (displayName === "tb") displayName = "Tuberculosis"
            if (displayName === "chlamydia") displayName = "Chlamydia"
            return `
                <li>
                <input type="checkbox" value="false" class="disease-input, annual" data-index=${i} name=${dName} />
                <label for="item${i}">${displayName}</label>
                </li>
            `;
        }).join('');

        const nextIndex = annualDiseases.length;

        // TODO: Make broad diseases disabled when covid is selected and vice versa
        const recentTrackersContent = `
            <li>
            <input type="checkbox" value="false" class="disease-input, monthly" data-index=${nextIndex} name="covid" />
            <label for="item${nextIndex}">COVID-19</label>
            </li>
        `;

        const broadTrackersTitle = `<h2>Annual Data: 2000 - 2017</h2>`;
        const recentTrackersTitle = `<h2>Monthly Data: 2020 - 2022</h2>`;

        diseaseForm.innerHTML = [broadTrackersTitle, broadTrackersContent, '<br />', recentTrackersTitle, recentTrackersContent].join('');

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



    createFilterForm();

    const handleNav = () => {

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

        const curvedArrow = document.getElementById("curvedarrow");
        if (curvedArrow) curvedArrow.removeAttribute("id");
        document.getElementById("display-load").removeAttribute("class");
    };

    const handleConceal = () => {
        navStatus = "closed"
        button.innerHTML = "Filters"
        nav.className = "nav-conceal"

        const navTitle = document.querySelector("h3")
        navTitle.className = "nav-title-conceal"

        const navForm = document.querySelector("form")
        navForm.className = "nav-form-conceal"
    }

    button.addEventListener("click", handleNav);
    const submitFilters = document.getElementById("submit-filters")
    submitFilters.addEventListener("click", handleNav);
}
