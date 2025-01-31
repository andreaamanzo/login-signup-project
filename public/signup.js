const signupPasswordField = document.getElementById('signupPassword')
const signupConfirmPasswordField = document.getElementById('signupConfirmPassword')
const toggleSignupPassword = document.getElementById('toggleSignupPassword')
const toggleSignupConfirmPassword = document.getElementById('toggleSignupConfirmPassword')
const confirmPasswordMessage = document.getElementById('confirmPasswordMessage')
const signupButton = document.querySelector('button[type="submit"]')

toggleSignupPassword.addEventListener('click', () => 
    togglePasswordVisibility(signupPasswordField, toggleSignupPassword)
)

toggleSignupConfirmPassword.addEventListener('click', () => 
    togglePasswordVisibility(signupConfirmPasswordField, toggleSignupConfirmPassword)
)


signupPasswordField.addEventListener("input", () => 
    checkPasswords(signupPasswordField, signupConfirmPasswordField, confirmPasswordMessage, signupButton)
)

signupConfirmPasswordField.addEventListener("input", () => 
    checkPasswords(signupPasswordField, signupConfirmPasswordField, confirmPasswordMessage, signupButton)
)
