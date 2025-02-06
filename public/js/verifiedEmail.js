const messageElement = document.getElementById("message")
const welcomeButton  = document.getElementById("welcomeButton")

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const token     = urlParams.get("token")

    try {
        const response = await fetch("/verify-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token })
        })
    
        if (!response.ok) {
            throw new Error(`Errore HTTP: ${response.status}`)
        }
    
        const data = await response.json()
    
        if (data.status === "already_verified") {
            messageElement.textContent = "Email già verificata. Puoi accedere direttamente."
        } else { // success
            messageElement.textContent = "Email verificata con successo!"
        }

        welcomeButton.addEventListener("click", () => {
            sessionStorage.setItem("loggedUserEmail", data.email)
            window.location.href = "/welcome"
        })
    } catch (error) {
        console.error("Errore durante verify-email:", error)
        toastr.error("Errore inaspettato.")
    }    
    
})
