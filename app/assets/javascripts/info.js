window.addEventListener("DOMContentLoaded", () => {
    const infoButton = document.getElementById('info-button')
    const infoWindow = document.getElementById('info')
    const infoModal = document.getElementById('info-modal')
    
    let modalStatus = "closed"
    
    const handleModal = (e) => {
        if (e.target.id === "info-modal") return
        if (modalStatus === "closed") {
            modalStatus = "open";
            infoButton.innerText = "Close"

            infoWindow.classList = "active-modal-back"
            infoModal.classList = "active-modal-front"
            infoModal.innerText = "Welcome to Viral"
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