const resetPasswordPasswordField = document.getElementById('resetPasswordPassword')
const resetPasswordConfirmPasswordField = document.getElementById('resetPasswordConfirmPassword')
const toggleResetPasswordPassword = document.getElementById('toggleResetPasswordPassword')
const toggleResetPasswordConfirmPassword = document.getElementById('toggleResetPasswordConfirmPassword')
const confirmPasswordMessage = document.getElementById('confirmPasswordMessage')
const resetPasswordButton = document.querySelector('button[type="submit"]')
const form = document.getElementById("form-reset")

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("token")

    if (!token) {
        window.location.href = "/404" // Reindirizza a una pagina di errore
        return
    }

    // Crea un input nascosto per il token
    const hiddenTokenInput = document.createElement("input")
    hiddenTokenInput.type = "hidden"
    hiddenTokenInput.name = "token"
    hiddenTokenInput.id = "token"
    hiddenTokenInput.value = token

    form.appendChild(hiddenTokenInput)
})

document.getElementById("reset-submit").addEventListener("click", async (event) => {
    event.preventDefault()
    const token = document.getElementById('token').value
    const password = document.getElementById('resetPasswordPassword').value

    if (!token) {
        toastr.error("Email sconosciuta.")
        return
    }

    try {
        const response = await fetch("/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, password })
        })

        const text = await response.text()
        const data = JSON.parse(text)

        if (data.success) {
            toastr.success(data.message)
            form.style.display = 'none'
        } else {
            toastr.error(data.message)
        }
    } catch (error) {
        toastr.error("Errore di connessione. Riprova.")
    }
})

toggleResetPasswordPassword.addEventListener('click', () => 
    togglePasswordVisibility(resetPasswordPasswordField, toggleResetPasswordPassword)
)

toggleResetPasswordConfirmPassword.addEventListener('click', () => 
    togglePasswordVisibility(resetPasswordConfirmPasswordField, toggleResetPasswordConfirmPassword)
)

resetPasswordPasswordField.addEventListener("input", () => 
    checkPasswords(resetPasswordPasswordField, resetPasswordConfirmPasswordField, confirmPasswordMessage, resetPasswordButton)
)

resetPasswordConfirmPasswordField.addEventListener("input", () => 
    checkPasswords(resetPasswordPasswordField, resetPasswordConfirmPasswordField, confirmPasswordMessage, resetPasswordButton)
)
