const resendEmail = document.getElementById("resendEmail")
const sentEmailP = document.getElementById('sentEmailP')

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search)
    const email = urlParams.get("email")    

    sentEmailP.innerHTML = `Utilizza il link inviato all'indirizzo <br><a href="mailto:${email}">${email}</a><br> per verificare la tua Email`
})

resendEmail.addEventListener("click", async (event) => {
    event.preventDefault()

    if (resendEmail.style.pointerEvents == "none") {
        return
    }
    
    const email = new URLSearchParams(window.location.search).get("email")
    
    try {
        const response = await fetch("/resend-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        })

        if (!response.ok) {
            throw new Error(`Errore HTTP: ${response.status}`)
        }

        const data = await response.json()
        
        if (data.success) {
            toastr.success("Email inviata con successo!")
        } 
    } catch (error) {
        console.error(error)
        toastr.error("Errore inaspettato")
    }
    
    resendEmail.style.pointerEvents = "none"
    resendEmail.textContent = "Attendi..."

    setTimeout(() => {
        resendEmail.style.pointerEvents = "auto"
        resendEmail.textContent = "Rimanda Email"
    }, 7000)
})

