const title               = document.getElementById("title")
const forgotPasswordForm  = document.getElementById("forgotPasswordForm")
const forgotPasswordEmail = document.getElementById("forgotPasswordEmail")
const messageP            = document.getElementById("messageP")
const resendEmailP        = document.getElementById("resendEmailP")
const resendLink          = document.getElementById("resendLink")
const newEmailP           = document.getElementById("newEmailP")

async function sendEmail (email) {
    try {
        const response = await fetch("/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        })
    
        if (!response.ok) {
            throw new Error(`Errore HTTP: ${response.status}`)
        }

        return true
    } catch (error) {
        console.error("Errore durante forgot-password:", error)
        toastr.error("Errore inaspettato.")
        return false
    }
}

forgotPasswordForm.addEventListener("submit", async (event) => {
    event.preventDefault() 

    const email = forgotPasswordEmail.value
    const success = await sendEmail(email)

    if (!success) {
        return 
    }

    forgotPasswordForm.style.display = "none"
    resendEmailP.style.display = "block"
    newEmailP.style.display = "block"
    title.innerText = "Email di ripristino inviata"
    messageP.innerHTML = `Utilizza il link inviato all'indirizzo <br><a href="mailto:${email}">${email}</a><br> per impostare una nuova password`
})

resendLink.addEventListener("click", async (event) => {
    event.preventDefault() 

    if (resendLink.style.pointerEvents == "none") {
        return
    }

    const email = forgotPasswordEmail.value
    const success = await sendEmail(email)

    if (!success) {
        return 
    }

    toastr.success("Email inviata con successo!")

    resendLink.style.pointerEvents = "none"
    resendLink.textContent = "Attendi..."

    setTimeout(() => {
        resendLink.style.pointerEvents = "auto"
        resendLink.textContent = "Rimanda Email"
    }, 7000)
})

