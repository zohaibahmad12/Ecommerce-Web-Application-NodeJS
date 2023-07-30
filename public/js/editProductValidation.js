document.getElementById("product-form").addEventListener("submit", function(event) {
    event.preventDefault();
  
    var categoryInput = document.getElementById("category");
    var nameInput = document.getElementById("name");
    var priceInput = document.getElementById("price");
    var quantityInput = document.getElementById("quantity");
    var descriptionInput = document.getElementById("description");
    var fileInputs = document.querySelectorAll('input[type="file"]');
  
    var categoryError = document.getElementById("category-error");
    var nameError = document.getElementById("name-error");
    var priceError = document.getElementById("price-error");
    var quantityError = document.getElementById("quantity-error");
    var descriptionError = document.getElementById("description-error");
    var image1Error = document.getElementById("image1-error");
    var image2Error = document.getElementById("image2-error");
    var image3Error = document.getElementById("image3-error");
  
    // Reset error messages
    categoryError.textContent = "";
    nameError.textContent = "";
    priceError.textContent = "";
    quantityError.textContent = "";
    descriptionError.textContent = "";
    image1Error.textContent = "";
    image2Error.textContent = "";
    image3Error.textContent = "";
  
    // Validate form inputs
    if (!categoryInput.value) {
      categoryError.textContent = "Please select a category.";
      return;
    }
  
    if (!nameInput.value) {
      nameError.textContent = "Product name is required.";
      return;
    }
  
    if (!priceInput.value) {
      priceError.textContent = "Price is required.";
      return;
    } else if (isNaN(priceInput.value) || priceInput.value < 0) {
      priceError.textContent = "Price must be a non-negative number.";
      return;
    }
  
    if (!quantityInput.value) {
      quantityError.textContent = "Quantity is required.";
      return;
    } else if (isNaN(quantityInput.value) || quantityInput.value < 0) {
      quantityError.textContent = "Quantity must be a non-negative number.";
      return;
    }
  
    if (!descriptionInput.value) {
      descriptionError.textContent = "Product description is required.";
      return;
    }
  
    var imageCount = 0;
    fileInputs.forEach(function(input) {
      if (input.files.length > 0) {
        imageCount++;
      
      }
    });
  
    if (imageCount>0 && imageCount < 3) {
      image3Error.textContent = "Please upload at least 3 images.";
      return;
    }
  
    // If all validations pass, submit the form
    this.action = "/editProductForm";
    this.method = "POST";
    this.submit();
  });
  