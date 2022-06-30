const MONTHS = [
    2020.01,
    2020.02,
    2020.03,
    2020.04,
    2020.05,
    2020.06,
    2020.07,
    2020.08,
    2020.09,
    2020.10,
    2020.11,
    2020.12,
    2021.01,
    2021.02,
    2021.03,
    2021.04,
    2021.05,
    2021.06,
    2021.07,
    2021.08,
    2021.09,
    2021.10,
    2021.11,
    2021.12,
    2022.01,
    2022.02,
    2022.03,
    2022.04,
    2022.05,
    2022.06,
]

window.addEventListener('DOMContentLoaded', () => {
    createMonthlyTimebox();
    createAnnualTimeBox();
});

function createAnnualTimeBox() {
    const timeBox = document.getElementById("time-box-annual");

    const slider = document.createElement("input");
    slider.type = "range";
    slider.id = "slider-annual";
    slider.className = "slider";
    slider.min = 2000;
    slider.max = 2017;
    slider.step = .25;
    slider.value = 2000;
    slider.smooth = "yes";

    const counter = document.createElement("h2");
    counter.id = "counter-annual";
    counter.className = "counter";
    counter.innerHTML = 2000;

    const gap = document.createElement("div");
    gap.style.width = "25px";

    timeBox.appendChild(slider);
    timeBox.appendChild(gap);
    timeBox.appendChild(counter);
}

function createMonthlyTimebox(){
    const timeBox = document.getElementById('time-box-monthly');

    const slider = document.createElement("input");
    slider.type = "range";
    slider.id = "slider-monthly";
    slider.className = "slider";
    slider.min = 0;
    slider.max = MONTHS.length - 1;
    slider.step = .25;
    slider.value = 0;
    slider.smooth = "yes";

    const gap = document.createElement("div");
    gap.style.width = "25px";

    const counter = document.createElement("h2");
    counter.id = "counter-monthly";
    counter.className = "counter";
    counter.innerHTML = MONTHS[0];

    timeBox.appendChild(slider);
    timeBox.appendChild(gap);
    timeBox.appendChild(counter);
}