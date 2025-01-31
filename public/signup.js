const signupPasswordField = document.getElementById('signupPassword');
const signupConfirmPasswordField = document.getElementById('signupConfirmPassword');
const toggleSignupPassword = document.getElementById('toggleSignupPassword');
const toggleSignupConfirmPassword = document.getElementById('toggleSignupConfirmPassword');
const confirmPasswordMessage = document.getElementById('confirmPasswordMessage');
const signupButton = document.querySelector('button[type="submit"]');

// Funzione per mostrare/nascondere la password
function togglePasswordVisibility(inputField, toggleIcon) {
    const type = inputField.getAttribute('type') === 'password' ? 'text' : 'password';
    inputField.setAttribute('type', type);
    toggleIcon.classList.toggle('fa-eye-slash');
}

toggleSignupPassword.addEventListener('click', () => togglePasswordVisibility(signupPasswordField, toggleSignupPassword));
toggleSignupConfirmPassword.addEventListener('click', () => togglePasswordVisibility(signupConfirmPasswordField, toggleSignupConfirmPassword));

// Funzione per controllare se le password coincidono e applicare lo stile
function checkPasswords() {
    if (signupPasswordField.value !== signupConfirmPasswordField.value) {
        confirmPasswordMessage.style.display = 'block';
        signupButton.disabled = true;
        signupPasswordField.classList.add('input-error');
        signupConfirmPasswordField.classList.add('input-error');
    } else {
        confirmPasswordMessage.style.display = 'none';
        signupButton.disabled = false;
        signupPasswordField.classList.remove('input-error');
        signupConfirmPasswordField.classList.remove('input-error');
    }
}

// Aggiunge l'evento di input per verificare le password mentre l'utente digita
signupPasswordField.addEventListener('input', checkPasswords);
signupConfirmPasswordField.addEventListener('input', checkPasswords);
