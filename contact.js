/**
 * Contact Form JavaScript
 * Handles form validation, email template generation, and mailto: functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contact-form');
  const responseDiv = document.getElementById('response');
  const submitBtn = document.getElementById('submitBtn');

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
   * Validate message
   */
  function validateMessage(message) {
    if (!message || message.trim().length < 10) return false;
    if (message.length > 1000) return false;
    // Check for potential XSS patterns
    const dangerousPatterns = /<script|javascript:|onerror=|onload=/i;
    return !dangerousPatterns.test(message);
  }

  /**
   * Sanitize input to prevent XSS
   */
  function sanitizeInput(input) {
    if (!input) return '';
    return input.trim().replace(/[<>]/g, '');
  }

  /**
   * Generate email template
   */
  function generateEmailTemplate(formData) {
    const subjectMap = {
      'feedback': 'Feedback',
      'complaint': 'Complaint',
      'support': 'Support Request',
      'other': 'General Inquiry'
    };

    const subject = subjectMap[formData.subject] || 'Contact Form Submission';
    const emailSubject = encodeURIComponent(`${subject} - Panto Hair & Beauty Salon`);
    
    const emailBody = encodeURIComponent(
      `Dear Panto Hair & Beauty Salon Team,

I am writing to you regarding: ${subjectMap[formData.subject] || 'General Inquiry'}

Contact Information:
- Name: ${formData.fullName}
- Email: ${formData.email}
- Phone: ${formData.phone}

Message:
${formData.message}

---
This message was sent from the contact form on www.phbsalon.co.za
    `);

    return {
      to: 'info@phbsalon.co.za',
      subject: emailSubject,
      body: emailBody,
      mailtoLink: `mailto:info@phbsalon.co.za?subject=${emailSubject}&body=${emailBody}`
    };
  }

  /**
   * Validate all form fields
   */
  function validateForm() {
    let isValid = true;
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value.trim();

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

    // Validate subject
    if (!subject) {
      displayError('subject', 'Please select a subject');
      isValid = false;
    } else {
      clearError('subject');
    }

    // Validate message
    if (!validateMessage(message)) {
      if (message.length < 10) {
        displayError('message', 'Message must be at least 10 characters long');
      } else if (message.length > 1000) {
        displayError('message', 'Message must not exceed 1000 characters');
      } else {
        displayError('message', 'Please enter a valid message');
      }
      isValid = false;
    } else {
      clearError('message');
    }

    return isValid;
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
    submitBtn.textContent = 'Preparing Message...';

    // Get and sanitize form data
    const formData = {
      fullName: sanitizeInput(document.getElementById('fullName').value),
      email: sanitizeInput(document.getElementById('email').value).toLowerCase(),
      phone: sanitizeInput(document.getElementById('phone').value),
      subject: document.getElementById('subject').value,
      message: sanitizeInput(document.getElementById('message').value)
    };

    // Simulate AJAX processing
    setTimeout(function() {
      // Generate email template
      const emailTemplate = generateEmailTemplate(formData);
      
      // Display success message with email preview
      const responseHTML = `
        <div class="response-content success-box">
          <h3>Message Ready to Send</h3>
          <p>Your message has been prepared and is ready to send via your email client.</p>
          
          <div class="mailto-preview">
            <p><strong>To:</strong> ${emailTemplate.to}</p>
            <p><strong>Subject:</strong> ${decodeURIComponent(emailTemplate.subject)}</p>
            <p><strong>From:</strong> ${formData.fullName} (${formData.email})</p>
            <p><strong>Phone:</strong> ${formData.phone}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background: #fff; padding: 0.5rem; border-radius: 4px; margin-top: 0.5rem;">${formData.message}</p>
          </div>
          
          <a href="${emailTemplate.mailtoLink}" class="mailto-link" id="mailtoLink">Open Email Client to Send</a>
          
          <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
            <em>Note: If your email client doesn't open automatically, you can copy the information above and send it manually to ${emailTemplate.to}</em>
          </p>
        </div>
      `;
      
      // Display response
      responseDiv.innerHTML = responseHTML;
      
      // Scroll to response
      responseDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      
      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
      
      // Auto-trigger mailto after a brief delay (optional)
      setTimeout(function() {
        const mailtoLink = document.getElementById('mailtoLink');
        if (mailtoLink) {
          // Note: Some browsers may block automatic mailto: opening
          // User can click the link manually
        }
      }, 500);
      
      console.log('Contact form submitted:', formData);
      console.log('Email template:', emailTemplate);
    }, 1000); // Simulate 1 second processing time
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

  document.getElementById('message').addEventListener('input', function() {
    const message = this.value.trim();
    if (message.length > 0) {
      if (message.length < 10) {
        displayError('message', `Message must be at least 10 characters (currently ${message.length})`);
      } else if (message.length > 1000) {
        displayError('message', `Message must not exceed 1000 characters (currently ${message.length})`);
      } else {
        clearError('message');
      }
    }
  });
});

