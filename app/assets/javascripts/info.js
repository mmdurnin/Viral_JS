window.addEventListener("DOMContentLoaded", () => {
    const infoButton = document.getElementById('info-button')
    const infoWindow = document.getElementById('info')
    const infoModal = document.getElementById('info-modal')
    
    let modalStatus = "closed"
    
    const handleModal = () => {
        if (modalStatus === "closed") {
            modalStatus = "open";
            infoButton.innerText = "Close"
        } else {
            modalStatus = "closed";
            infoButton.innerText = "About Viral"
        }
    }

    infoButton.addEventListener("click", handleModal)
})