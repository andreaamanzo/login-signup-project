const toggleLoginPassword = document.getElementById('toggleLoginPassword')
const loginPasswordField = document.getElementById('loginPassword')

toggleLoginPassword.addEventListener('click', () => {
    const type = loginPasswordField.getAttribute('type') === 'password' ? 'text' : 'password'
    loginPasswordField.setAttribute('type', type)
    toggleLoginPassword.classList.toggle('fa-eye-slash')
})