const signupForm                  = document.getElementById("signupForm")
const signupPasswordField         = document.getElementById("signupPassword")
const signupEmailField            = document.getElementById("signupEmail")
const signupConfirmPasswordField  = document.getElementById("signupConfirmPassword")
const toggleSignupPassword        = document.getElementById("toggleSignupPassword")
const toggleSignupConfirmPassword = document.getElementById("toggleSignupConfirmPassword")
const signupSubmitButton          = document.getElementById("signupSubmitButton")
const confirmPasswordMessage      = document.getElementById("confirmPasswordMessage")
const errorMessage                = document.getElementById("errorMessage")

signupForm.addEventListener("submit", async (event) => {
    event.preventDefault()

    const email    = signupEmailField.value
    const password = signupPasswordField.value

    try {
        const response = await fetch("/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })

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
    }
})

signupEmailField.addEventListener("input", () => {
    signupEmailField.classList.remove("input-error")
    errorMessage.style.display = "none"
})

toggleSignupPassword.addEventListener("click", () => 
    togglePasswordVisibility(signupPasswordField, toggleSignupPassword)
)

toggleSignupConfirmPassword.addEventListener("click", () => 
    togglePasswordVisibility(signupConfirmPasswordField, toggleSignupConfirmPassword)
)

signupPasswordField.addEventListener("input", () => 
    checkPasswords(signupPasswordField, signupConfirmPasswordField, confirmPasswordMessage, signupSubmitButton)
)

signupConfirmPasswordField.addEventListener("input", () => 
    checkPasswords(signupPasswordField, signupConfirmPasswordField, confirmPasswordMessage, signupSubmitButton)
)
