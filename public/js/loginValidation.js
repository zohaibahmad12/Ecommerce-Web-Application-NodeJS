
document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault(); // prevent default behaviour of the event or
    // prevent default form submission and handle the submission of form manually


    var emailInput = document.getElementById("email");
    var passwordInput = document.getElementById("password");



    var emailError = document.getElementById("email-error");
    var passwordError = document.getElementById("password-error");


    // Reset error messages

    emailError.textContent = "";
    passwordError.textContent = "";


    // Validate form inputs


    if (!emailInput.value) {
        emailError.textContent = "Email is required.";
        return;
    }

    if (!isValidEmail(emailInput.value)) {
        emailError.textContent = "Please enter a valid email address.";
        return;
    }

    if (!passwordInput.value) {
        passwordError.textContent = "Password is required.";
        return;
    }



    // If all validations pass, submit the form
    this.action = "/login";
    this.method = "POST";
    this.submit();  //submitting form manually
});

// Function to validate email using a regular expression
function isValidEmail(email) {
    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
}

