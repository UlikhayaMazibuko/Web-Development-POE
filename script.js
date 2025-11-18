/**
 * PHB Salon - JavaScript Enhancements
 * 
 * This file contains all interactive features:
 * - FAQ Accordion
 * - Contact Modal
 * - Lightbox Gallery
 * - Interactive Map (Leaflet)
 * - Scroll-based Animations
 * - DOM Manipulation for Service Cards
 */

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Wait for DOM to be fully loaded
 */
document.addEventListener('DOMContentLoaded', function() {
  initFAQ();
  initModal();
  initLightbox();
  initMap();
  initScrollAnimations();
  initServiceCards();
  initDynamicContent();
  updateYear();
});

/**
 * Update copyright year dynamically
 */
function updateYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// ============================================
// FAQ ACCORDION
// ============================================

/**
 * FAQ Data - Business-related questions
 */
const faqData = [
  {
    question: "What are your pricing options?",
    answer: "Our pricing varies depending on the service. Hair services start from R250, beauty treatments from R300, and nail services from R150. We offer package deals for multiple services. Please contact us for a detailed quote tailored to your needs."
  },
  {
    question: "Do you offer bridal packages?",
    answer: "Yes! We offer comprehensive bridal packages that include hair styling, professional makeup, and nail services. Our bridal packages are designed to make your special day perfect. Book a consultation to discuss your vision and receive a custom quote."
  },
  {
    question: "How far in advance should I book?",
    answer: "We recommend booking at least 2-3 weeks in advance, especially for special events or bridal services. For regular appointments, 1 week notice is usually sufficient. Walk-ins are welcome subject to availability."
  },
  {
    question: "What products do you use?",
    answer: "We use premium, professional-grade products from trusted brands. All products are carefully selected for quality and effectiveness. Many of our products are available for purchase in-salon to maintain your look at home."
  },
  {
    question: "Do you offer gift vouchers?",
    answer: "Yes, we offer gift vouchers that make perfect presents for birthdays, holidays, or special occasions. Vouchers can be purchased in-salon or by contacting us. They are valid for 12 months from the date of purchase."
  },
  {
    question: "What are your operating hours?",
    answer: "We're open Monday to Saturday from 09:00 to 18:00, and Sundays from 09:00 to 15:00. We're located in Newcastle Mall for your convenience. Extended hours may be available for special events - please enquire."
  }
];

/**
 * Initialize FAQ Accordion
 */
function initFAQ() {
  const faqContainer = document.getElementById('faq-container');
  if (!faqContainer) return;

  // Generate FAQ items from data
  faqData.forEach((faq, index) => {
    const faqItem = document.createElement('div');
    faqItem.className = 'faq-item';
    faqItem.setAttribute('role', 'region');
    faqItem.setAttribute('aria-labelledby', `faq-question-${index}`);

    const questionButton = document.createElement('button');
    questionButton.className = 'faq-question';
    questionButton.id = `faq-question-${index}`;
    questionButton.setAttribute('aria-expanded', 'false');
    questionButton.setAttribute('aria-controls', `faq-answer-${index}`);
    questionButton.innerHTML = `
      <span>${faq.question}</span>
      <span class="faq-icon" aria-hidden="true">▼</span>
    `;

    const answerDiv = document.createElement('div');
    answerDiv.className = 'faq-answer';
    answerDiv.id = `faq-answer-${index}`;
    answerDiv.setAttribute('role', 'region');
    answerDiv.innerHTML = `<p>${faq.answer}</p>`;

    // Toggle functionality
    questionButton.addEventListener('click', function() {
      const isActive = faqItem.classList.contains('active');
      
      // Close all other FAQ items (optional - remove if you want multiple open)
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
          item.classList.remove('active');
          const button = item.querySelector('.faq-question');
          const answer = item.querySelector('.faq-answer');
          if (button) button.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      faqItem.classList.toggle('active');
      questionButton.setAttribute('aria-expanded', !isActive);
    });

    // Keyboard navigation
    questionButton.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        questionButton.click();
      }
    });

    faqItem.appendChild(questionButton);
    faqItem.appendChild(answerDiv);
    faqContainer.appendChild(faqItem);
  });
}

// ============================================
// CONTACT MODAL
// ============================================

/**
 * Initialize Contact Modal
 */
function initModal() {
  const modal = document.getElementById('contact-modal');
  const modalOverlay = modal?.querySelector('.modal-overlay');
  const modalClose = modal?.querySelector('.modal-close');
  const modalForm = document.getElementById('contact-form-modal');
  const ctaTriggers = document.querySelectorAll('.cta-trigger');

  if (!modal) return;

  // Open modal function
  function openModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Focus trap - focus on first input
    const firstInput = modal.querySelector('input, textarea, select, button');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }

    // Trap focus within modal
    trapFocus(modal);
  }

  // Close modal function
  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore scrolling
    
    // Return focus to trigger element
    const activeElement = document.activeElement;
    if (activeElement && activeElement.classList.contains('cta-trigger')) {
      activeElement.focus();
    }
  }

  // Focus trap function
  function trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    container.addEventListener('keydown', function trapHandler(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
      if (e.key === 'Escape') {
        closeModal();
        container.removeEventListener('keydown', trapHandler);
      }
    });
  }

  // Event listeners
  ctaTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      openModal();
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeModal);
  }

  // ESC key to close
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Form submission with security validation
  if (modalForm) {
    modalForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form elements
      const nameInput = document.getElementById('modal-name');
      const emailInput = document.getElementById('modal-email');
      const phoneInput = document.getElementById('modal-phone');
      const serviceSelect = document.getElementById('modal-service');
      const messageInput = document.getElementById('modal-message');
      
      // Security validation functions
      function sanitizeInput(input) {
        if (!input) return '';
        return input.trim().replace(/[<>]/g, ''); // Remove potential HTML tags
      }
      
      function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      }
      
      function validatePhone(phone) {
        if (!phone || phone.trim() === '') return true; // Optional field
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
      }
      
      function validateName(name) {
        if (!name || name.trim().length < 2) return false;
        const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
        return nameRegex.test(name) && name.length <= 100;
      }
      
      function validateMessage(message) {
        if (!message || message.trim().length < 10) return false;
        if (message.length > 1000) return false;
        // Check for potential XSS patterns
        const dangerousPatterns = /<script|javascript:|onerror=|onload=/i;
        return !dangerousPatterns.test(message);
      }
      
      // Get and sanitize form data
      const name = sanitizeInput(nameInput.value);
      const email = sanitizeInput(emailInput.value).toLowerCase();
      const phone = sanitizeInput(phoneInput.value);
      const service = serviceSelect.value;
      const message = sanitizeInput(messageInput.value);
      
      // Validation
      let errors = [];
      
      if (!validateName(name)) {
        errors.push('Please enter a valid name (2-100 characters, letters only)');
        nameInput.focus();
      }
      
      if (!validateEmail(email)) {
        errors.push('Please enter a valid email address');
        if (errors.length === 1) emailInput.focus();
      }
      
      if (phone && !validatePhone(phone)) {
        errors.push('Please enter a valid phone number');
        if (errors.length === 1) phoneInput.focus();
      }
      
      if (!validateMessage(message)) {
        errors.push('Please enter a message (10-1000 characters)');
        if (errors.length === 1) messageInput.focus();
      }
      
      // Display errors if any
      if (errors.length > 0) {
        alert('Please correct the following errors:\n\n' + errors.join('\n'));
        return false;
      }
      
      // Prepare validated form data
      const formData = {
        name: name,
        email: email,
        phone: phone || '',
        service: service || '',
        message: message
      };

      // Simulate form submission (replace with actual API call)
      // In production, send to server with CSRF token
      console.log('Form submitted (validated):', formData);
      
      // Show success message
      alert('Thank you for your message! We will get back to you soon.');
      
      // Reset form and close modal
      modalForm.reset();
      closeModal();
      
      return true;
    });
  }
}

// ============================================
// LIGHTBOX GALLERY
// ============================================

/**
 * Gallery Data - Portfolio images loaded from JavaScript array
 */
const galleryData = [
  {
    src: 'Content Research and Sourcing/images/PHB Hairstyle02.jpg',
    alt: 'Professional hairstyle transformation',
    caption: 'Elegant hairstyle transformation'
  },
  {
    src: 'Content Research and Sourcing/images/PHB Hairstyle.jpg',
    alt: 'Full makeup and beauty service',
    caption: 'Complete beauty makeover'
  },
  {
    src: 'Content Research and Sourcing/images/PHB Nail Job.jpg',
    alt: 'Professional nail art design',
    caption: 'Custom nail art design'
  },
  {
    src: 'Content Research and Sourcing/images/PHB Interior.jpg',
    alt: 'Modern salon interior',
    caption: 'Our welcoming salon space'
  }
];

/**
 * Initialize Lightbox Gallery
 */
function initLightbox() {
  const galleryContainer = document.getElementById('gallery-container');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  if (!galleryContainer || !lightbox) return;

  let currentImageIndex = 0;

  // Generate gallery items from data
  galleryData.forEach((item, index) => {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.setAttribute('role', 'button');
    galleryItem.setAttribute('tabindex', '0');
    galleryItem.setAttribute('aria-label', `View ${item.caption}`);

    galleryItem.innerHTML = `
      <img src="${item.src}" alt="${item.alt}" loading="lazy" width="300" height="200">
      <div class="gallery-item-overlay">
        <p>${item.caption}</p>
      </div>
    `;

    // Open lightbox on click
    galleryItem.addEventListener('click', () => openLightbox(index));
    galleryItem.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });

    galleryContainer.appendChild(galleryItem);
  });

  // Open lightbox function
  function openLightbox(index) {
    currentImageIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  // Close lightbox function
  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Update lightbox image
  function updateLightboxImage() {
    const currentImage = galleryData[currentImageIndex];
    if (lightboxImage) {
      lightboxImage.src = currentImage.src;
      lightboxImage.alt = currentImage.alt;
    }
    if (lightboxCaption) {
      lightboxCaption.textContent = currentImage.caption;
    }
  }

  // Navigate to previous image
  function showPrevious() {
    currentImageIndex = (currentImageIndex - 1 + galleryData.length) % galleryData.length;
    updateLightboxImage();
  }

  // Navigate to next image
  function showNext() {
    currentImageIndex = (currentImageIndex + 1) % galleryData.length;
    updateLightboxImage();
  }

  // Event listeners
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', showPrevious);
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', showNext);
  }

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('active')) return;

    switch(e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        showPrevious();
        break;
      case 'ArrowRight':
        showNext();
        break;
    }
  });

  // Close on overlay click
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });
}

// ============================================
// INTERACTIVE MAP (LEAFLET)
// ============================================

/**
 * Initialize Interactive Map with Leaflet
 */
function initMap() {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;

  // Coordinates for Newcastle Mall, Newcastle, KwaZulu-Natal, South Africa
  // Approximate coordinates - adjust as needed
  const salonLat = -27.7580;
  const salonLng = 29.9318;
  const zoomLevel = 15;

  // Initialize map
  const map = L.map('map').setView([salonLat, salonLng], zoomLevel);

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);

  // Add custom marker with popup
  const marker = L.marker([salonLat, salonLng]).addTo(map);
  
  marker.bindPopup(`
    <div style="text-align: center; padding: 10px;">
      <h3 style="margin: 0 0 10px 0; color: #e10600; font-weight: bold;">PHB Salon</h3>
      <p style="margin: 5px 0;"><strong>Panto Hair & Beauty Salon</strong></p>
      <p style="margin: 5px 0;">Newcastle Mall</p>
      <p style="margin: 5px 0;">Newcastle, KwaZulu-Natal</p>
      <p style="margin: 5px 0;">South Africa</p>
      <p style="margin: 10px 0 0 0;">
        <a href="tel:+27630813339" style="color: #e10600;">+27 63 081 3339</a>
      </p>
    </div>
  `).openPopup();

  // Add custom icon (optional enhancement)
  const customIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  marker.setIcon(customIcon);
}

// ============================================
// SCROLL-BASED FADE-IN ANIMATIONS
// ============================================

/**
 * Initialize Scroll-based Fade-in Animations
 */
function initScrollAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in');

  if (fadeElements.length === 0) return;

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: unobserve after animation to improve performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all fade-in elements
  fadeElements.forEach(element => {
    observer.observe(element);
  });
}

// ============================================
// DOM MANIPULATION - SERVICE CARDS
// ============================================

/**
 * Service Cards Data
 */
const serviceCardsData = [
  {
    title: 'Hair Services',
    description: 'Professional cutting, styling, coloring, and treatments',
    image: 'Content Research and Sourcing/images/PHB Hairstyle02.jpg',
    link: 'services.html#hair'
  },
  {
    title: 'Beauty Services',
    description: 'Makeup, facials, brows, and complete beauty treatments',
    image: 'Content Research and Sourcing/images/PHB Hairstyle.jpg',
    link: 'services.html#beauty'
  },
  {
    title: 'Nail Services',
    description: 'Manicures, pedicures, nail art, and gel treatments',
    image: 'Content Research and Sourcing/images/PHB Nail Job.jpg',
    link: 'services.html#nails'
  }
];

/**
 * Initialize Service Cards (if needed for dynamic generation)
 * This demonstrates DOM manipulation capabilities
 */
function initServiceCards() {
  // Check if service cards section exists and needs dynamic generation
  const servicesSection = document.querySelector('section[aria-label="Key Services"] ul');
  
  // Only generate if the section is empty or needs enhancement
  // In this case, we'll enhance existing cards with data attributes
  if (servicesSection) {
    const existingCards = servicesSection.querySelectorAll('li article');
    
    existingCards.forEach((card, index) => {
      if (serviceCardsData[index]) {
        // Add data attributes for potential future enhancements
        card.setAttribute('data-service', serviceCardsData[index].title.toLowerCase());
        card.setAttribute('data-link', serviceCardsData[index].link);
        
        // Enhance existing "Book" links to trigger modal
        const bookLinks = card.querySelectorAll('a[href*="book"]');
        bookLinks.forEach(link => {
          link.classList.add('cta-trigger');
          link.addEventListener('click', function(e) {
            e.preventDefault();
            const modal = document.getElementById('contact-modal');
            if (modal) {
              modal.classList.add('active');
              modal.setAttribute('aria-hidden', 'false');
              document.body.style.overflow = 'hidden';
              
              // Pre-fill service interest if modal form exists
              const serviceSelect = document.getElementById('modal-service');
              if (serviceSelect && serviceCardsData[index]) {
                const serviceValue = serviceCardsData[index].title.toLowerCase().replace(' services', '');
                serviceSelect.value = serviceValue;
              }
            }
          });
        });
      }
    });
  }
}

// ============================================
// ADDITIONAL ENHANCEMENTS
// ============================================

/**
 * Smooth scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href !== '') {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

/**
 * Add loading states and error handling
 */
window.addEventListener('error', function(e) {
  console.error('JavaScript error:', e.error);
  // Could show user-friendly error message
});

/**
 * Performance optimization: Lazy load images
 */
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ============================================
// DYNAMIC CONTENT - SERVICES & PRODUCTS
// ============================================

/**
 * Services & Products Data Array
 * Each object contains: id, title, description, image, price, category/tags
 */
const servicesProductsData = [
  {
    id: 1,
    title: 'Haircut & Styling',
    description: 'Professional haircut with styling and finishing. Includes consultation and wash.',
    image: 'Content Research and Sourcing/images/PHB Hairstyle02.jpg',
    price: 350,
    category: 'hair',
    tags: ['hair', 'cutting', 'styling']
  },
  {
    id: 2,
    title: 'Hair Coloring',
    description: 'Full hair coloring service with premium products. Includes consultation and aftercare advice.',
    image: 'Content Research and Sourcing/images/PHB Hairstyle02.jpg',
    price: 850,
    category: 'hair',
    tags: ['hair', 'coloring', 'color']
  },
  {
    id: 3,
    title: 'Hair Treatment',
    description: 'Deep conditioning and repair treatment for damaged hair. Restores shine and health.',
    image: 'Content Research and Sourcing/images/PHB Hairstyle02.jpg',
    price: 450,
    category: 'hair',
    tags: ['hair', 'treatment', 'repair']
  },
  {
    id: 4,
    title: 'Full Makeup',
    description: 'Complete professional makeup application for any occasion. Includes consultation.',
    image: 'Content Research and Sourcing/images/PHB Hairstyle.jpg',
    price: 500,
    category: 'beauty',
    tags: ['beauty', 'makeup', 'cosmetics']
  },
  {
    id: 5,
    title: 'Facial Treatment',
    description: 'Deep cleansing facial with extraction and mask. Suitable for all skin types.',
    image: 'Content Research and Sourcing/images/PHB Hairstyle.jpg',
    price: 400,
    category: 'beauty',
    tags: ['beauty', 'facial', 'skincare']
  },
  {
    id: 6,
    title: 'Eyebrow Shaping',
    description: 'Professional eyebrow shaping and tinting. Achieve the perfect arch.',
    image: 'Content Research and Sourcing/images/PHB Hairstyle.jpg',
    price: 200,
    category: 'beauty',
    tags: ['beauty', 'brows', 'eyebrows']
  },
  {
    id: 7,
    title: 'Manicure',
    description: 'Classic or luxury manicure with nail shaping, cuticle care, and polish.',
    image: 'Content Research and Sourcing/images/PHB Nail Job.jpg',
    price: 180,
    category: 'nails',
    tags: ['nails', 'manicure', 'polish']
  },
  {
    id: 8,
    title: 'Pedicure',
    description: 'Relaxing pedicure with foot soak, exfoliation, and nail care.',
    image: 'Content Research and Sourcing/images/PHB Nail Job.jpg',
    price: 220,
    category: 'nails',
    tags: ['nails', 'pedicure', 'feet']
  },
  {
    id: 9,
    title: 'Nail Art Design',
    description: 'Custom nail art designs. Express your style with unique patterns and colors.',
    image: 'Content Research and Sourcing/images/PHB Nail Job.jpg',
    price: 250,
    category: 'nails',
    tags: ['nails', 'nail art', 'design']
  },
  {
    id: 10,
    title: 'Gel Nail Extension',
    description: 'Long-lasting gel nail extensions. Perfect for length and durability.',
    image: 'Content Research and Sourcing/images/PHB Nail Job.jpg',
    price: 600,
    category: 'nails',
    tags: ['nails', 'gel', 'extensions']
  },
  {
    id: 11,
    title: 'Bridal Package',
    description: 'Complete bridal package: Hair styling, full makeup, and nail services for your special day.',
    image: 'Content Research and Sourcing/images/PHB Interior.jpg',
    price: 2500,
    category: 'packages',
    tags: ['bridal', 'package', 'wedding', 'special']
  },
  {
    id: 12,
    title: 'Midweek Glow Package',
    description: 'Weekday special: Facial treatment and eyebrow shaping combo at a discounted rate.',
    image: 'Content Research and Sourcing/images/PHB Interior.jpg',
    price: 550,
    category: 'packages',
    tags: ['package', 'midweek', 'special', 'facial', 'brows']
  },
  {
    id: 13,
    title: 'Premium Hair Care Products',
    description: 'Professional-grade shampoo, conditioner, and styling products. Available in-salon.',
    image: 'Content Research and Sourcing/images/PHB Interior.jpg',
    price: 350,
    category: 'products',
    tags: ['products', 'hair care', 'retail']
  },
  {
    id: 14,
    title: 'Beauty Skincare Set',
    description: 'Complete skincare routine set with cleanser, toner, and moisturizer.',
    image: 'Content Research and Sourcing/images/PHB Interior.jpg',
    price: 450,
    category: 'products',
    tags: ['products', 'skincare', 'retail']
  }
];

/**
 * Initialize Dynamic Content System
 */
function initDynamicContent() {
  const contentList = document.getElementById('content-list');
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const noResults = document.getElementById('no-results');

  if (!contentList) return;

  let filteredData = [...servicesProductsData]; // Copy of original data
  let sortedData = [...servicesProductsData];

  /**
   * Display items in the content list
   */
  function displayItems(items) {
    // Clear existing content
    contentList.innerHTML = '';

    // Show/hide no results message
    if (items.length === 0) {
      noResults.style.display = 'block';
      contentList.style.display = 'none';
    } else {
      noResults.style.display = 'none';
      contentList.style.display = 'grid';
    }

    // Create and append item cards
    items.forEach(item => {
      const card = createItemCard(item);
      contentList.appendChild(card);
    });
  }

  /**
   * Create a single item card element
   */
  function createItemCard(item) {
    // Create card container
    const card = document.createElement('div');
    card.className = 'content-item';
    card.setAttribute('role', 'listitem');
    card.setAttribute('data-id', item.id);
    card.setAttribute('data-category', item.category);

    // Format price
    const formattedPrice = typeof item.price === 'number' 
      ? `R${item.price.toFixed(2)}` 
      : 'Price on request';

    // Create card HTML using template literals
    card.innerHTML = `
      <div class="content-item-image">
        <img src="${item.image}" alt="${item.title}" loading="lazy" width="300" height="200">
        <div class="content-item-category">${item.category.toUpperCase()}</div>
      </div>
      <div class="content-item-body">
        <h3 class="content-item-title">${item.title}</h3>
        <p class="content-item-description">${item.description}</p>
        <div class="content-item-footer">
          <span class="content-item-price">${formattedPrice}</span>
          <button class="content-item-button" data-id="${item.id}" aria-label="Book ${item.title}">
            Book Now
          </button>
        </div>
      </div>
    `;

    // Add click event to book button
    const bookButton = card.querySelector('.content-item-button');
    if (bookButton) {
      bookButton.addEventListener('click', function() {
        // Trigger modal with service pre-selected
        const modal = document.getElementById('contact-modal');
        const serviceSelect = document.getElementById('modal-service');
        
        if (modal && serviceSelect) {
          modal.classList.add('active');
          modal.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
          
          // Pre-select service category
          const categoryMap = {
            'hair': 'hair',
            'beauty': 'beauty',
            'nails': 'nails',
            'packages': 'bridal',
            'products': 'other'
          };
          serviceSelect.value = categoryMap[item.category] || 'other';
        }
      });
    }

    return card;
  }

  /**
   * Filter items based on search query
   */
  function filterItems(query) {
    if (!query || query.trim() === '') {
      return [...servicesProductsData];
    }

    const searchTerm = query.toLowerCase().trim();
    
    return servicesProductsData.filter(item => {
      // Search in title
      const titleMatch = item.title.toLowerCase().includes(searchTerm);
      
      // Search in description
      const descMatch = item.description.toLowerCase().includes(searchTerm);
      
      // Search in category
      const categoryMatch = item.category.toLowerCase().includes(searchTerm);
      
      // Search in tags
      const tagsMatch = item.tags.some(tag => tag.toLowerCase().includes(searchTerm));

      return titleMatch || descMatch || categoryMatch || tagsMatch;
    });
  }

  /**
   * Sort items based on selected option
   */
  function sortItems(items, sortOption) {
    const sorted = [...items]; // Create a copy to avoid mutating original

    switch(sortOption) {
      case 'name-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      
      case 'name-desc':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      
      case 'price-asc':
        sorted.sort((a, b) => {
          const priceA = typeof a.price === 'number' ? a.price : 0;
          const priceB = typeof b.price === 'number' ? b.price : 0;
          return priceA - priceB;
        });
        break;
      
      case 'price-desc':
        sorted.sort((a, b) => {
          const priceA = typeof a.price === 'number' ? a.price : 0;
          const priceB = typeof b.price === 'number' ? b.price : 0;
          return priceB - priceA;
        });
        break;
      
      case 'default':
      default:
        // Keep original order (by id)
        sorted.sort((a, b) => a.id - b.id);
        break;
    }

    return sorted;
  }

  /**
   * Update displayed items based on search and sort
   */
  function updateDisplay() {
    const searchQuery = searchInput ? searchInput.value : '';
    const sortOption = sortSelect ? sortSelect.value : 'default';

    // Filter items
    filteredData = filterItems(searchQuery);

    // Sort filtered items
    sortedData = sortItems(filteredData, sortOption);

    // Display sorted and filtered items
    displayItems(sortedData);
  }

  // Event listeners
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      updateDisplay();
    });

    // Clear search on Escape key
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        searchInput.value = '';
        updateDisplay();
      }
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      updateDisplay();
    });
  }

  // Initial display
  displayItems(sortedData);
}

