const toggleSignupPassword = document.getElementById('toggleSignupPassword')
const signupPasswordField = document.getElementById('signup-password')

toggleSignupPassword.addEventListener('click', () => {
    const type = signupPasswordField.getAttribute('type') === 'password' ? 'text' : 'password'
    signupPasswordField.setAttribute('type', type)
    toggleSignupPassword.classList.toggle('fa-eye-slash')
})