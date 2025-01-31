const toggleLoginPassword = document.getElementById('toggleLoginPassword')
const loginPasswordField = document.getElementById('loginPassword')

toggleLoginPassword.addEventListener('click', () => 
    togglePasswordVisibility(loginPasswordField, toggleLoginPassword)
)