/**
 * Enquiry Form JavaScript
 * Handles form validation, dynamic fields, and AJAX simulation
 */

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('enquiry-form');
  const enquiryTypeSelect = document.getElementById('enquiryType');
  const secondaryFieldGroup = document.getElementById('secondaryFieldGroup');
  const secondaryFieldLabel = document.getElementById('secondaryFieldLabel');
  const secondaryFieldSelect = document.getElementById('secondaryField');
  const secondaryFieldText = document.getElementById('secondaryFieldText');
  const responseDiv = document.getElementById('response');
  const submitBtn = document.getElementById('submitBtn');

  // Service options for Services enquiry type
  const serviceOptions = [
    { value: 'haircut', label: 'Haircut & Styling', price: 'R350' },
    { value: 'coloring', label: 'Hair Coloring', price: 'R850' },
    { value: 'treatment', label: 'Hair Treatment', price: 'R450' },
    { value: 'makeup', label: 'Full Makeup', price: 'R500' },
    { value: 'facial', label: 'Facial Treatment', price: 'R400' },
    { value: 'brows', label: 'Eyebrow Shaping', price: 'R200' },
    { value: 'manicure', label: 'Manicure', price: 'R180' },
    { value: 'pedicure', label: 'Pedicure', price: 'R220' },
    { value: 'nail-art', label: 'Nail Art Design', price: 'R250' },
    { value: 'bridal', label: 'Bridal Package', price: 'R2,500' }
  ];

  // Product options for Products enquiry type
  const productOptions = [
    { value: 'hair-care', label: 'Premium Hair Care Products' },
    { value: 'skincare', label: 'Beauty Skincare Set' },
    { value: 'nail-products', label: 'Nail Care Products' },
    { value: 'styling-tools', label: 'Professional Styling Tools' }
  ];

  // Sponsorship tiers
  const sponsorshipTiers = [
    { tier: 'Bronze', amount: 'R5,000', benefits: ['Logo on website', 'Social media mention'] },
    { tier: 'Silver', amount: 'R10,000', benefits: ['All Bronze benefits', 'Event banner', 'Quarterly feature'] },
    { tier: 'Gold', amount: 'R25,000', benefits: ['All Silver benefits', 'VIP event access', 'Monthly feature', 'Product placement'] },
    { tier: 'Platinum', amount: 'R50,000+', benefits: ['All Gold benefits', 'Exclusive partnership', 'Custom package'] }
  ];

  /**
   * Display error message under a field
   */
  function displayError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorSpan = document.getElementById(fieldId + '-error');
    
    if (field) {
      field.classList.add('error-field');
    }
    
    if (errorSpan) {
      errorSpan.textContent = message;
      errorSpan.style.display = 'block';
    }
  }

  /**
   * Clear error message for a field
   */
  function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorSpan = document.getElementById(fieldId + '-error');
    
    if (field) {
      field.classList.remove('error-field');
    }
    
    if (errorSpan) {
      errorSpan.textContent = '';
      errorSpan.style.display = 'none';
    }
  }

  /**
   * Validate South African phone number
   */
  function validateSAPhone(phone) {
    // Remove spaces and dashes for validation
    const cleaned = phone.replace(/[\s\-]/g, '');
    
    // Check if starts with +27 or 0
    if (cleaned.startsWith('+27')) {
      // Format: +27XXXXXXXXX (11 digits after +27)
      return cleaned.length === 12 && /^\+27[0-9]{9}$/.test(cleaned);
    } else if (cleaned.startsWith('0')) {
      // Format: 0XXXXXXXXX (10 digits starting with 0)
      return cleaned.length === 10 && /^0[0-9]{9}$/.test(cleaned);
    }
    
    return false;
  }

  /**
   * Validate full name
   */
  function validateName(name) {
    if (!name || name.trim().length < 2) return false;
    if (name.length > 100) return false;
    const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
    return nameRegex.test(name);
  }

  /**
   * Validate email
   */
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Handle enquiry type change - show/hide and populate secondary field
   */
  enquiryTypeSelect.addEventListener('change', function() {
    const enquiryType = this.value;
    
    // Clear previous errors
    clearError('secondaryField');
    clearError('secondaryFieldText');
    
    // Hide secondary field group initially
    secondaryFieldGroup.style.display = 'none';
    secondaryFieldSelect.style.display = 'none';
    secondaryFieldText.style.display = 'none';
    secondaryFieldSelect.innerHTML = '';
    secondaryFieldText.value = '';
    
    if (enquiryType === 'services') {
      // Show dropdown for services
      secondaryFieldGroup.style.display = 'block';
      secondaryFieldLabel.textContent = 'Select Service <span class="required">*</span>';
      secondaryFieldLabel.setAttribute('for', 'secondaryField');
      secondaryFieldSelect.style.display = 'block';
      secondaryFieldSelect.required = true;
      secondaryFieldText.required = false;
      
      // Populate service options
      secondaryFieldSelect.innerHTML = '<option value="">Select a service...</option>';
      serviceOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        optionElement.setAttribute('data-price', option.price);
        secondaryFieldSelect.appendChild(optionElement);
      });
      
    } else if (enquiryType === 'products') {
      // Show dropdown for products
      secondaryFieldGroup.style.display = 'block';
      secondaryFieldLabel.textContent = 'Select Product Category <span class="required">*</span>';
      secondaryFieldLabel.setAttribute('for', 'secondaryField');
      secondaryFieldSelect.style.display = 'block';
      secondaryFieldSelect.required = true;
      secondaryFieldText.required = false;
      
      // Populate product options
      secondaryFieldSelect.innerHTML = '<option value="">Select a product category...</option>';
      productOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        secondaryFieldSelect.appendChild(optionElement);
      });
      
    } else if (enquiryType === 'volunteering') {
      // Show text field for volunteering
      secondaryFieldGroup.style.display = 'block';
      secondaryFieldLabel.textContent = 'Area of Interest <span class="required">*</span>';
      secondaryFieldLabel.setAttribute('for', 'secondaryFieldText');
      secondaryFieldText.style.display = 'block';
      secondaryFieldText.required = true;
      secondaryFieldText.placeholder = 'e.g., Reception, Styling Assistant, Marketing';
      secondaryFieldSelect.required = false;
      
    } else if (enquiryType === 'sponsorship') {
      // Show dropdown for sponsorship tiers
      secondaryFieldGroup.style.display = 'block';
      secondaryFieldLabel.textContent = 'Sponsorship Tier <span class="required">*</span>';
      secondaryFieldLabel.setAttribute('for', 'secondaryField');
      secondaryFieldSelect.style.display = 'block';
      secondaryFieldSelect.required = true;
      secondaryFieldText.required = false;
      
      // Populate sponsorship tiers
      secondaryFieldSelect.innerHTML = '<option value="">Select a sponsorship tier...</option>';
      sponsorshipTiers.forEach(tier => {
        const optionElement = document.createElement('option');
        optionElement.value = tier.tier.toLowerCase();
        optionElement.textContent = `${tier.tier} (${tier.amount})`;
        optionElement.setAttribute('data-amount', tier.amount);
        optionElement.setAttribute('data-benefits', JSON.stringify(tier.benefits));
        secondaryFieldSelect.appendChild(optionElement);
      });
    }
  });

  /**
   * Validate all form fields
   */
  function validateForm() {
    let isValid = true;
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const enquiryType = document.getElementById('enquiryType').value;
    const secondaryValue = secondaryFieldSelect.style.display !== 'none' 
      ? secondaryFieldSelect.value 
      : secondaryFieldText.value.trim();

    // Validate full name
    if (!validateName(fullName)) {
      displayError('fullName', 'Please enter a valid name (2-100 characters, letters only)');
      isValid = false;
    } else {
      clearError('fullName');
    }

    // Validate email
    if (!validateEmail(email)) {
      displayError('email', 'Please enter a valid email address');
      isValid = false;
    } else {
      clearError('email');
    }

    // Validate phone
    if (!validateSAPhone(phone)) {
      displayError('phone', 'Please enter a valid South African phone number (e.g., +27 63 081 3339 or 063 081 3339)');
      isValid = false;
    } else {
      clearError('phone');
    }

    // Validate enquiry type
    if (!enquiryType) {
      displayError('enquiryType', 'Please select an enquiry type');
      isValid = false;
    } else {
      clearError('enquiryType');
    }

    // Validate secondary field
    if (secondaryFieldGroup.style.display !== 'none') {
      if (!secondaryValue) {
        displayError('secondaryField', 'This field is required');
        isValid = false;
      } else {
        clearError('secondaryField');
      }
    }

    return isValid;
  }

  /**
   * Generate dynamic response based on enquiry type
   */
  function generateResponse(enquiryType, secondaryValue) {
    let responseHTML = '';

    if (enquiryType === 'services') {
      const selectedService = serviceOptions.find(opt => opt.value === secondaryValue);
      if (selectedService) {
        responseHTML = `
          <div class="response-content success-box">
            <h3>Service Pricing Information</h3>
            <p><strong>Service:</strong> ${selectedService.label}</p>
            <p><strong>Price:</strong> ${selectedService.price}</p>
            <p>Thank you for your interest! Our team will contact you shortly to discuss your booking and answer any questions.</p>
            <p>You can also call us directly at <a href="tel:+27630813339">+27 63 081 3339</a> to book immediately.</p>
          </div>
        `;
      }
      
    } else if (enquiryType === 'products') {
      const selectedProduct = productOptions.find(opt => opt.value === secondaryValue);
      if (selectedProduct) {
        responseHTML = `
          <div class="response-content success-box">
            <h3>Product Information</h3>
            <p><strong>Product Category:</strong> ${selectedProduct.label}</p>
            <p>Our premium products are available in-salon. Visit us at Newcastle Mall to browse our full range and speak with our team about the best products for your needs.</p>
            <p>For pricing and availability, please contact us at <a href="tel:+27630813339">+27 63 081 3339</a> or <a href="mailto:info@phbsalon.co.za">info@phbsalon.co.za</a>.</p>
          </div>
        `;
      }
      
    } else if (enquiryType === 'volunteering') {
      responseHTML = `
        <div class="response-content success-box">
          <h3>Volunteering Requirements</h3>
          <p><strong>Area of Interest:</strong> ${secondaryValue}</p>
          <p>Thank you for your interest in volunteering with Panto Hair & Beauty Salon!</p>
          <p><strong>Requirements:</strong></p>
          <ul>
            <li>Minimum age: 18 years</li>
            <li>Passion for beauty and hair styling</li>
            <li>Good communication skills</li>
            <li>Willingness to learn and assist</li>
            <li>Professional appearance and attitude</li>
            <li>Available for at least 2 days per week</li>
          </ul>
          <p>Please note: Volunteering positions are subject to availability and interview process. We'll contact you within 5-7 business days to discuss opportunities.</p>
        </div>
      `;
      
    } else if (enquiryType === 'sponsorship') {
      const selectedTier = sponsorshipTiers.find(tier => tier.tier.toLowerCase() === secondaryValue);
      if (selectedTier) {
        responseHTML = `
          <div class="response-content success-box">
            <h3>Sponsorship Tier Information</h3>
            <p><strong>Tier:</strong> ${selectedTier.tier}</p>
            <p><strong>Investment:</strong> ${selectedTier.amount}</p>
            <p><strong>Benefits Include:</strong></p>
            <ul>
              ${selectedTier.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
            </ul>
            <p>Our sponsorship team will contact you within 3-5 business days to discuss partnership opportunities and create a customized package that aligns with your goals.</p>
            <p>For immediate inquiries, contact us at <a href="mailto:info@phbsalon.co.za">info@phbsalon.co.za</a>.</p>
          </div>
        `;
      }
    }

    return responseHTML;
  }

  /**
   * Handle form submission
   */
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Clear previous response
    responseDiv.innerHTML = '';
    
    // Validate form
    if (!validateForm()) {
      return false;
    }

    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';

    // Get form data
    const formData = {
      fullName: document.getElementById('fullName').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      enquiryType: document.getElementById('enquiryType').value,
      secondaryField: secondaryFieldSelect.style.display !== 'none' 
        ? secondaryFieldSelect.value 
        : secondaryFieldText.value.trim()
    };

    // Simulate AJAX request
    setTimeout(function() {
      // Generate response
      const responseHTML = generateResponse(formData.enquiryType, formData.secondaryField);
      
      // Display response
      responseDiv.innerHTML = responseHTML;
      
      // Scroll to response
      responseDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      
      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Enquiry';
      
      // Optional: Reset form after successful submission
      // form.reset();
      // secondaryFieldGroup.style.display = 'none';
      
      console.log('Enquiry submitted:', formData);
    }, 1500); // Simulate 1.5 second processing time
  });

  // Real-time validation on blur
  document.getElementById('fullName').addEventListener('blur', function() {
    if (this.value.trim()) {
      if (!validateName(this.value.trim())) {
        displayError('fullName', 'Please enter a valid name (2-100 characters, letters only)');
      } else {
        clearError('fullName');
      }
    }
  });

  document.getElementById('email').addEventListener('blur', function() {
    if (this.value.trim()) {
      if (!validateEmail(this.value.trim())) {
        displayError('email', 'Please enter a valid email address');
      } else {
        clearError('email');
      }
    }
  });

  document.getElementById('phone').addEventListener('blur', function() {
    if (this.value.trim()) {
      if (!validateSAPhone(this.value.trim())) {
        displayError('phone', 'Please enter a valid South African phone number');
      } else {
        clearError('phone');
      }
    }
  });
});

