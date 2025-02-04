const loginForm           = document.getElementById("loginForm")
const toggleLoginPassword = document.getElementById("toggleLoginPassword")
const loginPasswordField  = document.getElementById("loginPassword")
const loginEmailField     = document.getElementById("loginEmail")
const errorMessage        = document.getElementById("errorMessage")

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault()

    const email    = loginEmailField.value
    const password = loginPasswordField.value

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })

        if (!response.ok) {
            throw new Error(`Errore HTTP: ${response.status}`)
        }

        const data = await response.json()

        if (data.success) {
            sessionStorage.setItem("loggedUserEmail", data.user.email)
            window.location.href = "/welcome"
        } else {
            errorMessage.style.display = "inline-block"
            loginEmailField.classList.add('input-error')

            if (!data.user || data.user?.verified) {
                errorMessage.textContent = "Email o password errata"
                loginPasswordField.classList.add('input-error')
            } else {
                errorMessage.textContent = "Email non verificata"
            }
        }
    } catch (error) {
        console.error("Errore durante il login:", error)
        toastr.error("Errore inaspettato")
    }
})

toggleLoginPassword.addEventListener('click', () => 
    togglePasswordVisibility(loginPasswordField, toggleLoginPassword)
)

loginPasswordField.addEventListener('input', () => {
    loginEmailField.classList.remove('input-error')
    loginPasswordField.classList.remove('input-error')
    errorMessage.style.display = "none"
})

loginEmailField.addEventListener('input', () => {
    loginEmailField.classList.remove('input-error')
    loginPasswordField.classList.remove('input-error')
    errorMessage.style.display = "none"
})
