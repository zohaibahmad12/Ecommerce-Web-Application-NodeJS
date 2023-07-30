document.getElementById("category-form").addEventListener("submit", function(event) {
    event.preventDefault();
  
    
    var nameInput = document.getElementById("name");
    var fileInputs = document.querySelectorAll('input[type="file"]');
  
   
    var nameError = document.getElementById("name-error");
    var image1Error = document.getElementById("image1-error");
  
    // Reset error messages
    nameError.textContent = "";
    image1Error.textContent = "";
  
    // Validate form inputs
 
    if (!nameInput.value) {
      nameError.textContent = "Product name is required.";
      return;
    }

    var imageCount = 0;
    fileInputs.forEach(function(input) {
      if (input.files.length > 0) {
        imageCount++;
       
      }
    });
  
    if (imageCount < 1) {
      image1Error.textContent = "Please upload image.";
      return;
    }
  
    // If all validations pass, submit the form
    this.action = "/addNewCategory";
    this.method = "POST";
    this.submit();
  });
  