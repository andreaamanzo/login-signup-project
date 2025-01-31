const resetPasswordPasswordField = document.getElementById('resetPasswordPassword')
const resetPasswordConfirmPasswordField = document.getElementById('resetPasswordConfirmPassword')
const toggleResetPasswordPassword = document.getElementById('toggleResetPasswordPassword')
const toggleResetPasswordConfirmPassword = document.getElementById('toggleResetPasswordConfirmPassword')
const confirmPasswordMessage = document.getElementById('confirmPasswordMessage')
const resetPasswordButton = document.querySelector('button[type="submit"]')

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("token")

    if (!token) {
        window.location.href = "/404" // Reindirizza a una pagina di errore
        return
    }

    // Crea un input nascosto per il token
    const form = document.querySelector("form")
    const hiddenTokenInput = document.createElement("input")
    hiddenTokenInput.type = "hidden"
    hiddenTokenInput.name = "token"
    hiddenTokenInput.value = token

    form.appendChild(hiddenTokenInput)
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
