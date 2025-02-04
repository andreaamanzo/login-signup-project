const resetPasswordPasswordField         = document.getElementById("resetPasswordPassword")
const resetPasswordConfirmPasswordField  = document.getElementById("resetPasswordConfirmPassword")
const toggleResetPasswordPassword        = document.getElementById("toggleResetPasswordPassword")
const toggleResetPasswordConfirmPassword = document.getElementById("toggleResetPasswordConfirmPassword")
const confirmPasswordMessage             = document.getElementById("confirmPasswordMessage")
const resetPasswordSubmitButton          = document.getElementById("resetPasswordSubmitButton")
const resetPasswordForm                  = document.getElementById("resetPasswordForm")
const resetPasswordP                     = document.getElementById("resetPasswordP")

resetPasswordForm.addEventListener("submit", async (event) => {
    event.preventDefault()

    const urlParams = new URLSearchParams(window.location.search)
    const token     = urlParams.get("token")
    const password  = resetPasswordPasswordField.value

    try {
        const response = await fetch("/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, password })
        })

        if (!response.ok) {
            throw new Error(`Errore HTTP: ${response.status}`)
        }

        const data = await response.json()

        if (data.success) {
            resetPasswordForm.style.display = "none"
            resetPasswordP.style.color = "green"
            resetPasswordP.textContent = "Password modificata con successo"

            window.history.replaceState(null, "", window.location.pathname)
        } else {
            toastr.error(data.message)
        }
    } catch (error) {
        console.error("Errore durante reset-password:", error)
        toastr.error("Errore inaspettato.")
    }
})

toggleResetPasswordPassword.addEventListener("click", () => 
    togglePasswordVisibility(resetPasswordPasswordField, toggleResetPasswordPassword)
)

toggleResetPasswordConfirmPassword.addEventListener("click", () => 
    togglePasswordVisibility(resetPasswordConfirmPasswordField, toggleResetPasswordConfirmPassword)
)

resetPasswordPasswordField.addEventListener("input", () => 
    checkPasswords(resetPasswordPasswordField, resetPasswordConfirmPasswordField, confirmPasswordMessage, resetPasswordSubmitButton)
)

resetPasswordConfirmPasswordField.addEventListener("input", () => 
    checkPasswords(resetPasswordPasswordField, resetPasswordConfirmPasswordField, confirmPasswordMessage, resetPasswordSubmitButton)
)
