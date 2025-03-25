const resetPasswordPasswordField         = document.getElementById("resetPasswordPassword")
const resetPasswordConfirmPasswordField  = document.getElementById("resetPasswordConfirmPassword")
const toggleResetPasswordPassword        = document.getElementById("toggleResetPasswordPassword")
const toggleResetPasswordConfirmPassword = document.getElementById("toggleResetPasswordConfirmPassword")
const confirmPasswordMessage             = document.getElementById("confirmPasswordMessage")
const resetPasswordForm                  = document.getElementById("resetPasswordForm")
const resetPasswordP                     = document.getElementById("resetPasswordP")
const resetPasswordButton                = document.getElementById("resetPasswordButton")
const toLoginButton                      = document.getElementById("toLoginButton")
const strengthMeter                      = document.querySelector(".strength-meter div")
const infoIcon                           = document.querySelector(".info-icon")
const tooltip                            = document.getElementById("passwordTooltip")

resetPasswordForm.addEventListener("submit", async (event) => {
    event.preventDefault()

    setPasswordError(resetPasswordPasswordField, resetPasswordConfirmPasswordField, confirmPasswordMessage, false)

    resetPasswordButton.disabled = true
    resetPasswordForm.style.opacity = 0.5
    resetPasswordButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'

    setTimeout(async () => {
        try {
            if (!checkPasswords(resetPasswordPasswordField, resetPasswordConfirmPasswordField)) {
                setPasswordError(resetPasswordPasswordField, resetPasswordConfirmPasswordField, confirmPasswordMessage, true)
                return
            }
    
            const urlParams = new URLSearchParams(window.location.search)
            const token     = urlParams.get("token")
            const password  = resetPasswordPasswordField.value
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
                toLoginButton.firstChild.classList.add("a-button")

                window.history.replaceState(null, "", window.location.pathname)
            } else {
                toastr.error(data.message)
            }
        } catch (error) {
            console.error("Errore durante reset-password:", error)
            toastr.error("Errore inaspettato.")
        } finally {
            resetPasswordButton.disabled = false
            resetPasswordButton.innerHTML = "Imposta password"
            resetPasswordForm.style.opacity = 1
        }
    }, 600)
})

toggleResetPasswordPassword.addEventListener("click", () => 
    togglePasswordVisibility(resetPasswordPasswordField, toggleResetPasswordPassword)
)

toggleResetPasswordConfirmPassword.addEventListener("click", () => 
    togglePasswordVisibility(resetPasswordConfirmPasswordField, toggleResetPasswordConfirmPassword)
)

resetPasswordPasswordField.addEventListener("input", () => {
    const password = resetPasswordPasswordField.value
    const strength = calcPasswordStrength(password)
    setStrengthMeter(strengthMeter, strength)
})

infoIcon.addEventListener("mouseenter", () => {
    tooltip.classList.add("show")
})

infoIcon.addEventListener("mouseleave", () => {
    tooltip.classList.remove("show")
})

resetPasswordConfirmPasswordField.addEventListener("input", () => {
    if (checkPasswords(resetPasswordPasswordField, resetPasswordConfirmPasswordField)) {
        setPasswordError(resetPasswordPasswordField, resetPasswordConfirmPasswordField, confirmPasswordMessage, false)
    }
})

resetPasswordPasswordField.addEventListener("input", () => {
    if (checkPasswords(resetPasswordPasswordField, resetPasswordConfirmPasswordField)) {
        setPasswordError(resetPasswordPasswordField, resetPasswordConfirmPasswordField, confirmPasswordMessage, false)
    }
})