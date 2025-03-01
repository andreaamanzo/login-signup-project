toastr.options = {
    "positionClass": "toast-bottom-right",
    "closeButton": true,
    "progressBar": true,
    "timeOut": "5000",
    "extendedTimeOut": "2000",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

function togglePasswordVisibility(inputField, toggleIcon) {
    const type = inputField.getAttribute("type") === "password" ? "text" : "password"
    inputField.setAttribute("type", type)
    toggleIcon.classList.toggle("fa-eye-slash")
}

function setPasswordError(passwordField, confirmPasswordField, messageElement, setError) {
    if (setError) {
        messageElement.style.display = "block"
        passwordField.classList.add("input-error")
        confirmPasswordField.classList.add("input-error")
    } else {
        messageElement.style.display = "none"
        passwordField.classList.remove("input-error")
        confirmPasswordField.classList.remove("input-error")
    }
}

function checkPasswords(passwordField, confirmPasswordField) {
    return (passwordField.value === confirmPasswordField.value) 
}

function calcPasswordStrength(password) {
    const passwordMinLength = 8 

    let strength = 0

    if (password.length >= passwordMinLength) strength++ // Lunghezza minima
    if (/[A-Z]/.test(password)) strength++ // Almeno una maiuscola
    if (/[a-z]/.test(password)) strength++ // Almeno una minuscola
    if (/\d/.test(password)) strength++ // Almeno un numero
    if (/[@$!%*?&]/.test(password)) strength++ // Almeno un carattere speciale

    return strength
}

function setStrengthMeter(strengthMeter, strength) {
    const width = (strength / 5) * 100
    strengthMeter.style.width = width + "%"
}