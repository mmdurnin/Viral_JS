document.addEventListener("DOMContentLoaded", () => {
    const key = document.getElementById("key")


    const h1 = document.createElement("h1")
    h1.innerHTML = "KEY"
    key.appendChild(h1)

    const items = document.createElement("ul")

    //make disease items
    const hepA = document.createElement("li")
    hepA.innerHTML = "Hepatitis A • Rate per 100,000"
    hepA.className = "hepA-key"
    items.appendChild(hepA)

    const chlamydia = document.createElement("li")
    chlamydia.innerHTML = "Chlamydia • Rate per 10,000"
    chlamydia.className = "chlamydia-key"
    items.appendChild(chlamydia)

    const hepB = document.createElement("li")
    hepB.innerHTML = "Hepatitis B • Rate per 100,000"
    hepB.className = "hepB-key"
    items.appendChild(hepB)

    const tb = document.createElement("li")
    tb.innerHTML = "Tuberculosis • Rate per 100,000"
    tb.className = 'tb-key'
    items.appendChild(tb)

    key.appendChild(items)
})