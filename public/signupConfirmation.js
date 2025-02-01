toastr.options = {
    "positionClass": "toast-bottom-right", // Posiziona in basso a destra
    "closeButton": true,                   // Aggiunge il pulsante di chiusura
    "progressBar": true,                    // Aggiunge una barra di progresso
    "timeOut": "4000",                     // Tempo di chiusura automatico (in millisecondi)
    "extendedTimeOut": "2000",
    "showMethod": "fadeIn",                // Effetto di entrata
    "hideMethod": "fadeOut",               // Effetto di uscita
}


document.getElementById("resend").addEventListener("click", async () => {
    event.preventDefault()
    const email = new URLSearchParams(window.location.search).get("email")

    if (!email) {
        toastr.error("Email non trovata.")
        return
    }

    try {
        const response = await fetch("/resend-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        })

        const text = await response.text()
        const data = JSON.parse(text)

        if (data.success) {
            toastr.success(data.message)
        } else {
            toastr.error(data.message)
        }
    } catch (error) {
        toastr.error("Errore di connessione. Riprova.")
    }
})
