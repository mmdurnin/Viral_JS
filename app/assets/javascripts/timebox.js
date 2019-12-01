window.addEventListener('DOMContentLoaded', () => {
    
    return createTimeBox();
});

function createTimeBox() {
    const timeBox = document.getElementById('time-box');

    const timeBoxTitle = document.createElement("h3");
    timeBoxTitle.innerHTML = "Timeframe";
    timeBox.appendChild(timeBoxTitle);

    const colorBar = document.createElement("div")
    colorBar.classList.add("color")
    colorBar.classList.add("row")

    const slider = document.createElement("input")
    slider.type = "range"
    slider.id = "slider"
    slider.min = 2000
    slider.max = 2018
    slider.step = 1
    slider.value = 2000

    colorBar.appendChild(slider);
    timeBoxTitle.appendChild(colorBar)

    const timeBoxPhase = document.createElement("div");
    timeBoxPhase.classList.add("phase-container");
    timeBoxPhase.classList.add("row");


    for (let i = 2000; i < 2019; i++) {
        phase = document.createElement("div")
        phase.classList.add("time-label");
        phase.innerHTML = `${i}` + " "
        timeBoxPhase.appendChild(phase)
    }

    timeBox.appendChild(timeBoxPhase);
}