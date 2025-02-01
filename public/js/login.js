const loginForm = document.getElementById("loginForm");
const toggleLoginPassword = document.getElementById('toggleLoginPassword')
const loginPasswordField = document.getElementById('loginPassword')
const loginEmailField = document.getElementById('loginEmail')
const errorMessage = document.getElementById('errorMessage')

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault()

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();


        if (response.ok) {
            sessionStorage.setItem("loggedUserEmail", data.user.email);

            window.location.href = "/welcome";
        } else {
            errorMessage.style.display = "inline-block"
            loginPasswordField.classList.add('input-error')
            loginEmailField.classList.add('input-error')
        }
    } catch (error) {
        console.error("Errore durante il login:", error);
        alert("Errore di connessione.");
    }
});

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
