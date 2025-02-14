const signupForm                  = document.getElementById("signupForm")
const signupPasswordField         = document.getElementById("signupPassword")
const signupEmailField            = document.getElementById("signupEmail")
const signupConfirmPasswordField  = document.getElementById("signupConfirmPassword")
const toggleSignupPassword        = document.getElementById("toggleSignupPassword")
const toggleSignupConfirmPassword = document.getElementById("toggleSignupConfirmPassword")
const confirmPasswordMessage      = document.getElementById("confirmPasswordMessage")
const errorMessage                = document.getElementById("errorMessage")
const signupButton                = document.getElementById("signupSubmitButton")
const strengthMeter               = document.querySelector(".strength-meter div")
const infoIcon                    = document.querySelector(".info-icon")
const tooltip                     = document.getElementById("passwordTooltip")

signupForm.addEventListener("submit", async (event) => {
    event.preventDefault()

    signupEmailField.classList.remove("input-error")
    errorMessage.style.display = "none"

    setPasswordError(signupPasswordField, signupConfirmPasswordField, confirmPasswordMessage, false)

    signupButton.disabled = true
    signupForm.style.opacity = 0.5
    signupButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'

    setTimeout(async () => {
        try {
            if (!checkPasswords(signupPasswordField, signupConfirmPasswordField)) {
                setPasswordError(signupPasswordField, signupConfirmPasswordField, confirmPasswordMessage, true)
                return
            }
        
            const email = signupEmailField.value
            const password = signupPasswordField.value
            const response = await fetch("/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            })

            if (!response.ok) {
                throw new Error(`Errore HTTP: ${response.status}`)
            }

            const data = await response.json()

            if (data.success) {
                window.location.href = `/signup-confirmation?email=${encodeURIComponent(email)}`
            } else {
                errorMessage.textContent = "Email già in uso"
                errorMessage.style.display = "inline-block"
                signupEmailField.classList.add("input-error")
            }
        } catch (error) {
            console.error("Errore durante il signup:", error)
            toastr.error("Errore inaspettato")
        } finally {
            signupButton.disabled = false
            signupButton.innerHTML = "Registrati"
            signupForm.style.opacity = 1
        }
    }, 600)
})

toggleSignupPassword.addEventListener("click", () => 
    togglePasswordVisibility(signupPasswordField, toggleSignupPassword)
)

toggleSignupConfirmPassword.addEventListener("click", () => 
    togglePasswordVisibility(signupConfirmPasswordField, toggleSignupConfirmPassword)
)

signupPasswordField.addEventListener("input", () => {
    const password = signupPasswordField.value
    const strength = calcPasswordStrength(password)
    setStrengthMeter(strengthMeter, strength)
})

infoIcon.addEventListener("mouseenter", () => {
    tooltip.classList.add("show")
})

infoIcon.addEventListener("mouseleave", () => {
    tooltip.classList.remove("show")
})

signupConfirmPasswordField.addEventListener("input", () => {
    if (checkPasswords(signupPasswordField, signupConfirmPasswordField)) {
        setPasswordError(signupPasswordField, signupConfirmPasswordField, confirmPasswordMessage, false)
    }
})