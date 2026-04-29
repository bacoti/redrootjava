/**
 * Red Root Java - Feedback Page JavaScript
 * Handles form interactions, validation, and API submission
 */

// ============================================
// CONFIGURATION
// ============================================
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : '/api';

// ============================================
// CUSTOM DROPDOWN COMPONENT
// Modern UI/UX with Keyboard & Accessibility
// ============================================
class CustomDropdown {
    constructor(selectElement, options = {}) {
        this.select = selectElement;
        this.options = {
            icons: options.icons || {},
            descriptions: options.descriptions || {},
            header: options.header || 'Pilih opsi',
            ...options
        };
        this.isOpen = false;
        this.highlightedIndex = -1;
        this.init();
    }

    init() {
        // Create custom dropdown structure
        this.createDropdown();
        this.bindEvents();
        this.select.style.display = 'none';
    }

    createDropdown() {
        // Main container
        this.container = document.createElement('div');
        this.container.className = 'custom-dropdown';
        this.container.setAttribute('role', 'combobox');
        this.container.setAttribute('aria-expanded', 'false');
        this.container.setAttribute('aria-haspopup', 'listbox');

        // Trigger button
        this.trigger = document.createElement('button');
        this.trigger.type = 'button';
        this.trigger.className = 'custom-dropdown__trigger custom-dropdown__trigger--placeholder';
        this.trigger.setAttribute('aria-label', this.options.header);

        // Get placeholder text
        const placeholderOption = this.select.querySelector('option[value=""]');
        const placeholderText = placeholderOption ? placeholderOption.textContent : 'Pilih opsi...';

        this.trigger.innerHTML = `
            <span class="custom-dropdown__text">${placeholderText}</span>
            <span class="custom-dropdown__arrow"></span>
        `;

        // Dropdown menu
        this.menu = document.createElement('div');
        this.menu.className = 'custom-dropdown__menu';
        this.menu.setAttribute('role', 'listbox');

        // Add header
        if (this.options.header) {
            const header = document.createElement('div');
            header.className = 'custom-dropdown__header';
            header.textContent = this.options.header;
            this.menu.appendChild(header);
        }

        // Create options from native select
        const selectOptions = this.select.querySelectorAll('option');
        selectOptions.forEach((opt, index) => {
            if (opt.value === '') return; // Skip placeholder

            const optionEl = this.createOption(opt, index);
            this.menu.appendChild(optionEl);
        });

        // Assemble
        this.container.appendChild(this.trigger);
        this.container.appendChild(this.menu);

        // Insert after native select
        this.select.parentNode.insertBefore(this.container, this.select.nextSibling);
    }

    createOption(optElement, index) {
        const option = document.createElement('div');
        option.className = 'custom-dropdown__option';
        option.setAttribute('role', 'option');
        option.setAttribute('data-value', optElement.value);
        option.setAttribute('data-index', index);
        option.tabIndex = -1;

        // Get icon and description
        const icon = this.options.icons[optElement.value] || '🔘';
        const desc = this.options.descriptions[optElement.value] || '';

        option.innerHTML = `
            <div class="custom-dropdown__option-icon">${icon}</div>
            <div class="custom-dropdown__option-content">
                <div class="custom-dropdown__option-title">${optElement.textContent}</div>
                ${desc ? `<div class="custom-dropdown__option-desc">${desc}</div>` : ''}
            </div>
            <div class="custom-dropdown__check">
                <i class="fi fi-rr-check"></i>
            </div>
        `;

        return option;
    }

    bindEvents() {
        // Toggle on trigger click
        this.trigger.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggle();
        });

        // Option selection
        this.menu.addEventListener('click', (e) => {
            const option = e.target.closest('.custom-dropdown__option');
            if (option && !option.classList.contains('custom-dropdown__option--disabled')) {
                this.selectOption(option);
            }
        });

        // Keyboard navigation
        this.container.addEventListener('keydown', (e) => this.handleKeydown(e));

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                this.close();
            }
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
                this.trigger.focus();
            }
        });
    }

    handleKeydown(e) {
        const options = this.menu.querySelectorAll('.custom-dropdown__option:not(.custom-dropdown__option--disabled)');

        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (this.isOpen && this.highlightedIndex >= 0) {
                    this.selectOption(options[this.highlightedIndex]);
                } else {
                    this.toggle();
                }
                break;

            case 'ArrowDown':
                e.preventDefault();
                if (!this.isOpen) {
                    this.open();
                } else {
                    this.highlightedIndex = Math.min(this.highlightedIndex + 1, options.length - 1);
                    this.updateHighlight(options);
                }
                break;

            case 'ArrowUp':
                e.preventDefault();
                if (this.isOpen) {
                    this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
                    this.updateHighlight(options);
                }
                break;

            case 'Tab':
                if (this.isOpen) {
                    this.close();
                }
                break;

            case 'Home':
                if (this.isOpen) {
                    e.preventDefault();
                    this.highlightedIndex = 0;
                    this.updateHighlight(options);
                }
                break;

            case 'End':
                if (this.isOpen) {
                    e.preventDefault();
                    this.highlightedIndex = options.length - 1;
                    this.updateHighlight(options);
                }
                break;
        }
    }

    updateHighlight(options) {
        options.forEach((opt, i) => {
            opt.classList.toggle('custom-dropdown__option--highlighted', i === this.highlightedIndex);
            if (i === this.highlightedIndex) {
                opt.scrollIntoView({ block: 'nearest' });
            }
        });
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.isOpen = true;
        this.container.classList.add('is-open');
        this.container.setAttribute('aria-expanded', 'true');

        // Find currently selected option
        const selectedOption = this.menu.querySelector('.custom-dropdown__option--selected');
        if (selectedOption) {
            this.highlightedIndex = parseInt(selectedOption.dataset.index) - 1;
        } else {
            this.highlightedIndex = 0;
        }
    }

    close() {
        this.isOpen = false;
        this.container.classList.remove('is-open');
        this.container.setAttribute('aria-expanded', 'false');
        this.highlightedIndex = -1;

        // Clear highlights
        this.menu.querySelectorAll('.custom-dropdown__option--highlighted').forEach(opt => {
            opt.classList.remove('custom-dropdown__option--highlighted');
        });
    }

    selectOption(optionEl) {
        const value = optionEl.dataset.value;
        const title = optionEl.querySelector('.custom-dropdown__option-title').textContent;
        const icon = optionEl.querySelector('.custom-dropdown__option-icon').innerHTML;

        // Update native select
        this.select.value = value;
        this.select.dispatchEvent(new Event('change', { bubbles: true }));

        // Update trigger
        this.trigger.innerHTML = `
            <div class="custom-dropdown__icon">${icon}</div>
            <span class="custom-dropdown__text">${title}</span>
            <span class="custom-dropdown__arrow"></span>
        `;
        this.trigger.classList.remove('custom-dropdown__trigger--placeholder');
        this.trigger.classList.add('custom-dropdown__trigger--selected');

        // Update selected state
        this.menu.querySelectorAll('.custom-dropdown__option').forEach(opt => {
            opt.classList.remove('custom-dropdown__option--selected');
            opt.setAttribute('aria-selected', 'false');
        });
        optionEl.classList.add('custom-dropdown__option--selected');
        optionEl.setAttribute('aria-selected', 'true');

        // Close dropdown
        this.close();
        this.trigger.focus();

        // Clear form error if any
        const formGroup = this.container.closest('.form-group');
        if (formGroup) {
            formGroup.classList.remove('error');
        }
    }

    getValue() {
        return this.select.value;
    }

    reset() {
        this.select.value = '';
        const placeholderOption = this.select.querySelector('option[value=""]');
        const placeholderText = placeholderOption ? placeholderOption.textContent : 'Pilih opsi...';

        this.trigger.innerHTML = `
            <span class="custom-dropdown__text">${placeholderText}</span>
            <span class="custom-dropdown__arrow"></span>
        `;
        this.trigger.classList.add('custom-dropdown__trigger--placeholder');
        this.trigger.classList.remove('custom-dropdown__trigger--selected');

        this.menu.querySelectorAll('.custom-dropdown__option').forEach(opt => {
            opt.classList.remove('custom-dropdown__option--selected');
            opt.setAttribute('aria-selected', 'false');
        });
    }
}

// ============================================
// DOM ELEMENTS
// ============================================
const selectorSection = document.querySelector('.feedback-selector');
const prePurchaseForm = document.getElementById('form-pre-purchase');
const postPurchaseForm = document.getElementById('form-post-purchase');
const successSection = document.getElementById('feedback-success');
const selectorCards = document.querySelectorAll('.selector-card');

// Forms
const preForm = document.getElementById('pre-purchase-form');
const postForm = document.getElementById('post-purchase-form');

// Custom Dropdowns
let productVariantDropdown = null;
let sourceDropdown = null;

// Initialize Custom Dropdowns
document.addEventListener('DOMContentLoaded', () => {
    // Product Variant Dropdown (Post-Purchase Form)
    const variantSelect = document.getElementById('post-variant');
    if (variantSelect) {
        productVariantDropdown = new CustomDropdown(variantSelect, {
            header: 'Pilih Varian Produk',
            icons: {
                'original': '🌶️',
                'coconut': '🥥',
                'mango': '🥭'
            },
            descriptions: {
                'original': 'Jahe merah murni tanpa campuran',
                'coconut': 'Perpaduan creamy dengan kelapa pandan',
                'mango': 'Rasa segar dengan sentuhan mangga'
            }
        });
    }

    // Source Dropdown (Pre-Purchase Form)
    const sourceSelect = document.getElementById('pre-source');
    if (sourceSelect) {
        sourceDropdown = new CustomDropdown(sourceSelect, {
            header: 'Dari Mana Anda Tahu?',
            icons: {
                'instagram': '📸',
                'facebook': '👥',
                'tiktok': '🎵',
                'google': '🔍',
                'teman': '🤝',
                'marketplace': '🛒',
                'lainnya': '💬'
            },
            descriptions: {
                'instagram': 'Melalui feed atau story Instagram',
                'facebook': 'Melalui postingan Facebook',
                'tiktok': 'Melalui video TikTok',
                'google': 'Melalui pencarian Google',
                'teman': 'Direkomendasikan teman atau keluarga',
                'marketplace': 'Dari marketplace online',
                'lainnya': 'Sumber lainnya'
            }
        });
    }
});

// ============================================
// FLOW NAVIGATION
// ============================================
function showSelector() {
    selectorSection.style.display = 'block';
    prePurchaseForm.style.display = 'none';
    postPurchaseForm.style.display = 'none';
    successSection.style.display = 'none';
    window.scrollTo({ top: selectorSection.offsetTop - 100, behavior: 'smooth' });
}

function showPrePurchaseForm() {
    selectorSection.style.display = 'none';
    prePurchaseForm.style.display = 'block';
    postPurchaseForm.style.display = 'none';
    successSection.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showPostPurchaseForm() {
    selectorSection.style.display = 'none';
    prePurchaseForm.style.display = 'none';
    postPurchaseForm.style.display = 'block';
    successSection.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showSuccess(message) {
    selectorSection.style.display = 'none';
    prePurchaseForm.style.display = 'none';
    postPurchaseForm.style.display = 'none';
    successSection.style.display = 'block';

    const messageEl = document.getElementById('success-message');
    if (messageEl && message) {
        messageEl.textContent = message;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
    if (preForm) preForm.reset();
    if (postForm) postForm.reset();

    // Reset custom dropdowns
    if (productVariantDropdown) {
        productVariantDropdown.reset();
    }
    if (sourceDropdown) {
        sourceDropdown.reset();
    }

    // Reset star rating
    const starBtns = document.querySelectorAll('.star-btn');
    starBtns.forEach(btn => btn.classList.remove('active'));
    const starRating = document.querySelector('.star-rating');
    if (starRating) {
        starRating.dataset.rating = '0';
        const ratingText = starRating.querySelector('.star-rating__text');
        if (ratingText) ratingText.textContent = 'Klik untuk memberi rating';
    }
    const ratingInput = document.getElementById('rating-value');
    if (ratingInput) ratingInput.value = '';

    // Reset file upload
    const filePreview = document.querySelector('.file-upload__preview');
    if (filePreview) filePreview.style.display = 'none';
    const fileInput = document.getElementById('post-photo');
    if (fileInput) fileInput.value = '';

    // Clear errors
    document.querySelectorAll('.form-group.error').forEach(group => {
        group.classList.remove('error');
    });

    showSelector();
}

// ============================================
// SELECTOR CARD CLICK HANDLERS
// ============================================
selectorCards.forEach(card => {
    card.addEventListener('click', () => {
        const type = card.dataset.type;
        if (type === 'pre_purchase') {
            showPrePurchaseForm();
        } else if (type === 'post_purchase') {
            showPostPurchaseForm();
        }
    });
});

// ============================================
// STAR RATING
// ============================================
const starButtons = document.querySelectorAll('.star-btn');
const ratingTexts = {
    1: 'Sangat Buruk',
    2: 'Buruk',
    3: 'Cukup',
    4: 'Bagus',
    5: 'Sangat Bagus!'
};

starButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const value = parseInt(btn.dataset.value);
        const starRating = btn.closest('.star-rating');
        const ratingInput = document.getElementById('rating-value');
        const ratingText = starRating.querySelector('.star-rating__text');

        // Update active state
        starButtons.forEach(b => {
            if (parseInt(b.dataset.value) <= value) {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });

        // Update hidden input
        if (ratingInput) ratingInput.value = value;

        // Update text
        if (ratingText) ratingText.textContent = ratingTexts[value] || '';

        // Update data attribute
        starRating.dataset.rating = value;

        // Clear error
        const errorEl = document.getElementById('rating-error');
        if (errorEl) errorEl.style.display = 'none';
    });

    // Hover effect
    btn.addEventListener('mouseenter', () => {
        const value = parseInt(btn.dataset.value);
        starButtons.forEach(b => {
            if (parseInt(b.dataset.value) <= value) {
                b.style.color = '#F59E0B';
            }
        });
    });

    btn.addEventListener('mouseleave', () => {
        const activeRating = parseInt(btn.closest('.star-rating').dataset.rating) || 0;
        starButtons.forEach(b => {
            if (parseInt(b.dataset.value) > activeRating) {
                b.style.color = '#D1D5DB';
            }
        });
    });
});

// ============================================
// FILE UPLOAD PREVIEW
// ============================================
const fileInput = document.getElementById('post-photo');
const filePreview = document.querySelector('.file-upload__preview');
const filePreviewImg = document.querySelector('.file-upload__preview-img');
const fileRemoveBtn = document.querySelector('.file-upload__remove');
const fileLabel = document.querySelector('.file-upload__label');

if (fileInput) {
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];

        if (file) {
            // Validate file size
            if (file.size > 5 * 1024 * 1024) {
                alert('Ukuran file terlalu besar. Maksimal 5MB.');
                fileInput.value = '';
                return;
            }

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                alert('Hanya file gambar (JPG, PNG, WebP) yang diizinkan.');
                fileInput.value = '';
                return;
            }

            // Show preview
            const reader = new FileReader();
            reader.onload = (e) => {
                if (filePreviewImg) filePreviewImg.src = e.target.result;
                if (filePreview) filePreview.style.display = 'inline-block';
                if (fileLabel) fileLabel.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });
}

if (fileRemoveBtn) {
    fileRemoveBtn.addEventListener('click', () => {
        if (fileInput) fileInput.value = '';
        if (filePreview) filePreview.style.display = 'none';
        if (fileLabel) fileLabel.style.display = 'flex';
    });
}

// ============================================
// CHARACTER COUNT
// ============================================
const reviewTextarea = document.getElementById('post-review');
const charCount = document.getElementById('review-char-count');

if (reviewTextarea && charCount) {
    reviewTextarea.addEventListener('input', () => {
        const length = reviewTextarea.value.length;
        charCount.textContent = length;

        if (length > 2000) {
            charCount.style.color = 'var(--color-warning)';
        } else if (length >= 20) {
            charCount.style.color = 'var(--color-success)';
        } else {
            charCount.style.color = 'var(--color-text-muted)';
        }
    });
}

// ============================================
// FORM VALIDATION
// ============================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[0-9+\-\s()]{8,20}$/;
    return re.test(phone);
}

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    if (formGroup) {
        formGroup.classList.add('error');
        const errorEl = formGroup.querySelector('.form-error');
        if (errorEl) errorEl.textContent = message;
    }
}

function clearError(input) {
    const formGroup = input.closest('.form-group');
    if (formGroup) {
        formGroup.classList.remove('error');
    }
}

function validatePrePurchaseForm() {
    let isValid = true;

    // Name
    const name = preForm.querySelector('[name="name"]');
    if (!name.value.trim()) {
        showError(name, 'Nama harus diisi');
        isValid = false;
    } else if (name.value.trim().length < 2) {
        showError(name, 'Nama minimal 2 karakter');
        isValid = false;
    } else {
        clearError(name);
    }

    // Email or Phone
    const email = preForm.querySelector('[name="email"]');
    const phone = preForm.querySelector('[name="phone"]');

    if (!email.value.trim() && !phone.value.trim()) {
        showError(email, 'Email atau WhatsApp harus diisi');
        showError(phone, 'Email atau WhatsApp harus diisi');
        isValid = false;
    } else {
        if (email.value.trim() && !validateEmail(email.value.trim())) {
            showError(email, 'Format email tidak valid');
            isValid = false;
        } else {
            clearError(email);
        }

        if (phone.value.trim() && !validatePhone(phone.value.trim())) {
            showError(phone, 'Format nomor tidak valid');
            isValid = false;
        } else {
            clearError(phone);
        }
    }

    return isValid;
}

function validatePostPurchaseForm() {
    let isValid = true;

    // Name
    const name = postForm.querySelector('[name="name"]');
    if (!name.value.trim()) {
        showError(name, 'Nama harus diisi');
        isValid = false;
    } else if (name.value.trim().length < 2) {
        showError(name, 'Nama minimal 2 karakter');
        isValid = false;
    } else {
        clearError(name);
    }

    // Email or Phone
    const email = postForm.querySelector('[name="email"]');
    const phone = postForm.querySelector('[name="phone"]');

    if (!email.value.trim() && !phone.value.trim()) {
        showError(email, 'Email atau WhatsApp harus diisi');
        showError(phone, 'Email atau WhatsApp harus diisi');
        isValid = false;
    } else {
        if (email.value.trim() && !validateEmail(email.value.trim())) {
            showError(email, 'Format email tidak valid');
            isValid = false;
        } else {
            clearError(email);
        }

        if (phone.value.trim() && !validatePhone(phone.value.trim())) {
            showError(phone, 'Format nomor tidak valid');
            isValid = false;
        } else {
            clearError(phone);
        }
    }

    // Product Variant
    const variant = postForm.querySelector('[name="product_variant"]');
    if (!variant.value) {
        showError(variant, 'Pilih varian produk');
        isValid = false;
    } else {
        clearError(variant);
    }

    // Rating
    const rating = document.getElementById('rating-value');
    const ratingError = document.getElementById('rating-error');
    if (!rating.value) {
        if (ratingError) {
            ratingError.textContent = 'Berikan rating produk';
            ratingError.style.display = 'block';
        }
        isValid = false;
    } else {
        if (ratingError) ratingError.style.display = 'none';
    }

    // Review
    const review = postForm.querySelector('[name="review"]');
    if (!review.value.trim()) {
        showError(review, 'Ceritakan pengalaman Anda');
        isValid = false;
    } else if (review.value.trim().length < 20) {
        showError(review, 'Review minimal 20 karakter untuk dapat ditampilkan');
        isValid = false;
    } else {
        clearError(review);
    }

    return isValid;
}

// ============================================
// FORM SUBMISSION
// ============================================
async function submitForm(form, type) {
    const submitBtn = form.querySelector('.feedback-submit-btn');
    const originalText = submitBtn.innerHTML;

    try {
        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.classList.add('btn--loading');
        submitBtn.innerHTML = '<span>Mengirim...</span>';

        // Create FormData
        const formData = new FormData(form);

        // Send to API
        const response = await fetch(`${API_BASE_URL}/feedback`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            showSuccess(result.message);
        } else {
            // Show validation errors
            if (result.errors && result.errors.length > 0) {
                result.errors.forEach(err => {
                    const input = form.querySelector(`[name="${err.field}"]`);
                    if (input) showError(input, err.message);
                });
            } else {
                alert(result.message || 'Terjadi kesalahan. Silakan coba lagi.');
            }
        }
    } catch (error) {
        console.error('Submit error:', error);
        alert('Terjadi kesalahan koneksi. Silakan coba lagi.');
    } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn--loading');
        submitBtn.innerHTML = originalText;
    }
}

// Pre-Purchase Form Submit
if (preForm) {
    preForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (validatePrePurchaseForm()) {
            await submitForm(preForm, 'pre_purchase');
        }
    });
}

// Post-Purchase Form Submit
if (postForm) {
    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (validatePostPurchaseForm()) {
            await submitForm(postForm, 'post_purchase');
        }
    });
}

// ============================================
// CLEAR ERRORS ON INPUT
// ============================================
document.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(input => {
    input.addEventListener('input', () => {
        clearError(input);
    });
});

// ============================================
// MOBILE MENU TOGGLE
// ============================================
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('menu-toggle--active');
        nav.classList.toggle('nav--open');
    });
}

// ============================================
// HEADER SCROLL EFFECT
// ============================================
const header = document.querySelector('.header');

if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    });
}

// Make functions globally available
window.showSelector = showSelector;
window.resetForm = resetForm;
