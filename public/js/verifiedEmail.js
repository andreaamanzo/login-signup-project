document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");
    const email = urlParams.get("email");
    const messageElement = document.getElementById("message");
    const loginBtn = document.getElementById("loginBtn");

    if (status === "success") {
        messageElement.textContent = "Email verificata con successo!";
        
        sessionStorage.setItem("loggedUserEmail", email)

        loginBtn.style.display = "inline-block";

    } else if (status === "already_verified") {
        messageElement.textContent = "Email già verificata. Puoi accedere direttamente.";
        loginBtn.style.display = "inline-block";
    } else {
        loginBtn.style.display = "none";
        messageElement.textContent = "Link non valido o scaduto.";
    }

    loginBtn.addEventListener("click", function () {
        window.location.href = "/welcome";
    });
});