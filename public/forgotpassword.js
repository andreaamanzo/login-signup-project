const form = document.getElementById('forgot-password-form')
const messageP = document.getElementById('messageP')
const resendEmailP = document.getElementById('resendEmailP')
const newEmailP = document.getElementById('newEmailP')

async function sendEmail (event) {
    event.preventDefault(); // Previene il refresh della pagina

    const email = document.getElementById("email").value;

    if (!email) {
        toastr.error("Inserisci un'email valida.");
        return;
    }


    try {
        const response = await fetch("/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        const text = await response.text();
        const data = JSON.parse(text);

        if (data.success) {
            form.style.display = 'none'
            resendEmailP.style.display = 'block'
            newEmailP.style.display = 'block'
            messageP.textContent = `Email inviata all'indirizzo ${email}`
            toastr.success(data.message || "Email inviata con successo!");
        } else {
            toastr.error(data.message || "Errore nell'invio dell'email.");
        }
    } catch (error) {
        toastr.error("Errore di connessione. Riprova.");
    }
}

document.getElementById("forgot-password-form").addEventListener("submit", sendEmail)
document.getElementById("resendEmailP").addEventListener("click", sendEmail)