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

function isValidPassword(password) {
    const passwordLengthMin = 8 

    const hasMinLength   = (password.length >= passwordLengthMin)
    const hasUpperCase   = /[A-Z]/.test(password)
    const hasLowerCase   = /[a-z]/.test(password)
    const hasNumber      = /[0-9]/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    return {
        hasMinLength,
        hasUpperCase,
        hasLowerCase,
        hasNumber,
        hasSpecialChar
    }
}