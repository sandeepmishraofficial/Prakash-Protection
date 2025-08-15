// Authentication and Form Handling JavaScript

// Import Bootstrap
const bootstrap = window.bootstrap

// Initialize Lucide icons (keeping for compatibility)
document.addEventListener("DOMContentLoaded", () => {
  // Initialize any existing functionality
  initializeContactForm()
  initializeAuthForms()
})

// Modal Functions
function showLoginModal() {
  const loginModal = new bootstrap.Modal(document.getElementById("loginModal"))
  loginModal.show()
}

function showSignupModal() {
  const signupModal = new bootstrap.Modal(document.getElementById("signupModal"))
  signupModal.show()
}

function switchToSignup() {
  const loginModal = bootstrap.Modal.getInstance(document.getElementById("loginModal"))
  const signupModal = new bootstrap.Modal(document.getElementById("signupModal"))

  loginModal.hide()
  setTimeout(() => {
    signupModal.show()
  }, 300)
}

function switchToLogin() {
  const signupModal = bootstrap.Modal.getInstance(document.getElementById("signupModal"))
  const loginModal = new bootstrap.Modal(document.getElementById("loginModal"))

  signupModal.hide()
  setTimeout(() => {
    loginModal.show()
  }, 300)
}

// Password Toggle Function
function togglePassword(inputId, button) {
  const input = document.getElementById(inputId)
  const icon = button.querySelector("i")

  if (input.type === "password") {
    input.type = "text"
    icon.classList.remove("fa-eye")
    icon.classList.add("fa-eye-slash")
  } else {
    input.type = "password"
    icon.classList.remove("fa-eye-slash")
    icon.classList.add("fa-eye")
  }
}

// Password Strength Checker
function checkPasswordStrength(password) {
  let strength = 0

  // Length check
  if (password.length >= 8) strength++

  // Contains lowercase
  if (/[a-z]/.test(password)) strength++

  // Contains uppercase
  if (/[A-Z]/.test(password)) strength++

  // Contains numbers
  if (/\d/.test(password)) strength++

  // Contains special characters
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++

  return strength
}

// Show Alert Function
function showAlert(message, type = "success", containerId = "alertContainer") {
  const alertContainer = document.getElementById(containerId) || document.body

  const alertDiv = document.createElement("div")
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`
  alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `

  alertContainer.insertBefore(alertDiv, alertContainer.firstChild)

  // Auto dismiss after 5 seconds
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.remove()
    }
  }, 5000)
}

// Initialize Authentication Forms
function initializeAuthForms() {
  // Login Form
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  // Signup Form
  const signupForm = document.getElementById("signupForm")
  if (signupForm) {
    signupForm.addEventListener("submit", handleSignup)

    // Password strength indicator
    const passwordInput = document.getElementById("signupPassword")
    if (passwordInput) {
      passwordInput.addEventListener("input", function () {
        const strength = checkPasswordStrength(this.value)
        updatePasswordStrength(strength)
      })
    }

    // Confirm password validation
    const confirmPasswordInput = document.getElementById("confirmPassword")
    if (confirmPasswordInput) {
      confirmPasswordInput.addEventListener("input", validatePasswordMatch)
    }
  }
}

// Handle Login
async function handleLogin(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const email = document.getElementById("loginEmail").value
  const password = document.getElementById("loginPassword").value
  const rememberMe = document.getElementById("rememberMe").checked

  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Logging in...'
  submitBtn.disabled = true

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock authentication logic
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find((u) => u.email === email && u.password === password)

    if (user) {
      // Store user session
      const sessionData = {
        user: { ...user, password: undefined },
        timestamp: Date.now(),
        rememberMe: rememberMe,
      }

      if (rememberMe) {
        localStorage.setItem("userSession", JSON.stringify(sessionData))
      } else {
        sessionStorage.setItem("userSession", JSON.stringify(sessionData))
      }

      showAlert('<i class="fas fa-check-circle me-2"></i>Login successful! Welcome back.', "success")

      // Close modal and redirect or update UI
      const modal = bootstrap.Modal.getInstance(document.getElementById("loginModal"))
      modal.hide()

      // Update navigation to show user info
      updateNavigation(user)
    } else {
      showAlert(
        '<i class="fas fa-exclamation-triangle me-2"></i>Invalid email or password. Please try again.',
        "danger",
      )
    }
  } catch (error) {
    showAlert('<i class="fas fa-exclamation-triangle me-2"></i>Login failed. Please try again later.', "danger")
    console.error("Login error:", error)
  } finally {
    // Reset button state
    submitBtn.innerHTML = originalText
    submitBtn.disabled = false
  }
}

// Handle Signup
async function handleSignup(e) {
  e.preventDefault()

  const firstName = document.getElementById("signupFirstName").value
  const lastName = document.getElementById("signupLastName").value
  const email = document.getElementById("signupEmail").value
  const phone = document.getElementById("signupPhone").value
  const password = document.getElementById("signupPassword").value
  const confirmPassword = document.getElementById("confirmPassword").value
  const agreeTerms = document.getElementById("agreeTerms").checked

  // Validation
  if (password !== confirmPassword) {
    showAlert('<i class="fas fa-exclamation-triangle me-2"></i>Passwords do not match.', "danger")
    return
  }

  if (checkPasswordStrength(password) < 3) {
    showAlert(
      '<i class="fas fa-exclamation-triangle me-2"></i>Password is too weak. Please choose a stronger password.',
      "danger",
    )
    return
  }

  if (!agreeTerms) {
    showAlert(
      '<i class="fas fa-exclamation-triangle me-2"></i>Please agree to the Terms of Service and Privacy Policy.',
      "danger",
    )
    return
  }

  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Creating Account...'
  submitBtn.disabled = true

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock user creation
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    // Check if user already exists
    if (users.find((u) => u.email === email)) {
      showAlert('<i class="fas fa-exclamation-triangle me-2"></i>An account with this email already exists.', "danger")
      return
    }

    // Create new user
    const newUser = {
      id: Date.now(),
      firstName,
      lastName,
      email,
      phone,
      password, // In real app, this would be hashed
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    showAlert('<i class="fas fa-check-circle me-2"></i>Account created successfully! Please log in.', "success")

    // Close signup modal and open login modal
    const signupModal = bootstrap.Modal.getInstance(document.getElementById("signupModal"))
    signupModal.hide()

    setTimeout(() => {
      showLoginModal()
      // Pre-fill email in login form
      document.getElementById("loginEmail").value = email
    }, 500)
  } catch (error) {
    showAlert(
      '<i class="fas fa-exclamation-triangle me-2"></i>Account creation failed. Please try again later.',
      "danger",
    )
    console.error("Signup error:", error)
  } finally {
    // Reset button state
    submitBtn.innerHTML = originalText
    submitBtn.disabled = false
  }
}

// Update Password Strength Indicator
function updatePasswordStrength(strength) {
  // This function can be enhanced to show visual password strength indicator
  const passwordInput = document.getElementById("signupPassword")
  const parent = passwordInput.parentNode.parentNode

  // Remove existing strength indicator
  const existingIndicator = parent.querySelector(".password-strength")
  if (existingIndicator) {
    existingIndicator.remove()
  }

  // Add new strength indicator
  const strengthDiv = document.createElement("div")
  strengthDiv.className = "password-strength"

  if (strength < 2) {
    strengthDiv.classList.add("weak")
  } else if (strength < 4) {
    strengthDiv.classList.add("medium")
  } else {
    strengthDiv.classList.add("strong")
  }

  parent.appendChild(strengthDiv)
}

// Validate Password Match
function validatePasswordMatch() {
  const password = document.getElementById("signupPassword").value
  const confirmPassword = document.getElementById("confirmPassword").value
  const confirmInput = document.getElementById("confirmPassword")

  if (confirmPassword && password !== confirmPassword) {
    confirmInput.setCustomValidity("Passwords do not match")
    confirmInput.classList.add("is-invalid")
  } else {
    confirmInput.setCustomValidity("")
    confirmInput.classList.remove("is-invalid")
  }
}

// Update Navigation for Logged In User
function updateNavigation(user) {
  const navbarNav = document.querySelector(".navbar-nav")
  const loginBtn = navbarNav.querySelector('button[onclick="showLoginModal()"]')
  const signupBtn = navbarNav.querySelector('button[onclick="showSignupModal()"]')

  if (loginBtn && signupBtn) {
    // Replace login/signup buttons with user menu
    const userMenu = document.createElement("li")
    userMenu.className = "nav-item dropdown"
    userMenu.innerHTML = `
            <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown">
                <i class="fas fa-user-circle me-2"></i>
                ${user.firstName} ${user.lastName}
            </a>
            <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#"><i class="fas fa-user me-2"></i>Profile</a></li>
                <li><a class="dropdown-item" href="#"><i class="fas fa-cog me-2"></i>Settings</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" onclick="logout()"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
            </ul>
        `

    // Replace buttons with user menu
    loginBtn.parentNode.remove()
    signupBtn.parentNode.remove()
    navbarNav.appendChild(userMenu)
  }
}

// Logout Function
function logout() {
  localStorage.removeItem("userSession")
  sessionStorage.removeItem("userSession")

  showAlert('<i class="fas fa-check-circle me-2"></i>You have been logged out successfully.', "info")

  // Reload page to reset navigation
  setTimeout(() => {
    location.reload()
  }, 1000)
}

// Check for existing session on page load
function checkExistingSession() {
  const sessionData = localStorage.getItem("userSession") || sessionStorage.getItem("userSession")

  if (sessionData) {
    try {
      const session = JSON.parse(sessionData)
      const now = Date.now()
      const sessionAge = now - session.timestamp

      // Session expires after 24 hours for localStorage, 1 hour for sessionStorage
      const maxAge = session.rememberMe ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000

      if (sessionAge < maxAge) {
        updateNavigation(session.user)
      } else {
        // Session expired
        localStorage.removeItem("userSession")
        sessionStorage.removeItem("userSession")
      }
    } catch (error) {
      console.error("Session check error:", error)
    }
  }
}

// Initialize Contact Form
function initializeContactForm() {
  const contactForm = document.getElementById("contactForm")
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactForm)
  }
}

// Handle Contact Form
async function handleContactForm(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const submitBtn = e.target.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML

  // Show loading state
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Sending...'
  submitBtn.disabled = true

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    showAlert(
      '<i class="fas fa-check-circle me-2"></i>Thank you for your message! We\'ll get back to you within 24 hours.',
      "success",
    )

    // Reset form
    e.target.reset()
  } catch (error) {
    showAlert(
      '<i class="fas fa-exclamation-triangle me-2"></i>Failed to send message. Please try again later.',
      "danger",
    )
    console.error("Contact form error:", error)
  } finally {
    // Reset button state
    submitBtn.innerHTML = originalText
    submitBtn.disabled = false
  }
}

// Forgot Password Function
function showForgotPassword() {
  const email = document.getElementById("loginEmail").value

  if (!email) {
    showAlert('<i class="fas fa-info-circle me-2"></i>Please enter your email address first.', "info")
    return
  }

  // Simulate password reset
  showAlert('<i class="fas fa-envelope me-2"></i>Password reset instructions have been sent to your email.', "info")
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  checkExistingSession()
  initializeContactForm()
  initializeAuthForms()
})

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})
