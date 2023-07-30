
document.getElementById("signup-form").addEventListener("submit", function (event) {
    event.preventDefault(); // prevent default behaviour of the event or
    // prevent default form submission and handle the submission of form manually

    var nameInput = document.getElementById("name");
    var emailInput = document.getElementById("email");
    var passwordInput = document.getElementById("password");
    var addressInput = document.getElementById("address");
    var phoneInput = document.getElementById("phone");

    var nameError = document.getElementById("name-error");
    var emailError = document.getElementById("email-error");
    var passwordError = document.getElementById("password-error");
    var addressError = document.getElementById("address-error");
    var phoneError = document.getElementById("phone-error");

    // Reset error messages
    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    addressError.textContent = "";
    phoneError.textContent = "";

    // Validate form inputs
    if (!nameInput.value) {
        nameError.textContent = "Name is required.";
        return;
    }

    if (!emailInput.value) {
        emailError.textContent = "Email is required.";
        return;
    }

    if (!isValidEmail(emailInput.value)) {
        emailError.textContent = "Please enter a valid email address.";
        return;
    }
    if (!addressInput.value) {
        addressError.textContent = "Current Address is required.";
        return;
    }
    if (!phoneInput.value) {
        phoneError.textContent = "Phone # is required.";
        return;
    }
    
    if (!isValidPhone(phoneInput.value)) {
        phoneError.textContent = "Please enter a valid phone number (+92 format).";
        return;
    }

    if (!passwordInput.value) {
        passwordError.textContent = "Password is required.";
        return;
    }


    // If all validations pass, submit the form
    this.action = "/signup";
    this.method = "POST";
    this.submit();  //submitting form manually
});

// Function to validate email using a regular expression
function isValidEmail(email) {
    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    var phoneRegex = /^\+92\d{10}$/;
    return phoneRegex.test(phone);
}

