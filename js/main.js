// Eranad Hospital & Research Centre - Core JavaScript Coordinator
import HospitalData from "./data.js";

document.addEventListener("DOMContentLoaded", () => {
  initAppRouter();
  initThemeEngine();
  initMobileMenu();
  renderSpecialitiesList();
  renderDoctorsDirectory();
  renderFacilitiesList();
  initFaqAccordion();
  initEnquiryForm();
  renderMyAppointments();
  initScrollAnimations();

  // Listen to bookingsUpdated event to refresh sidebar bookings list
  window.addEventListener("bookingsUpdated", renderMyAppointments);
});

/* --- Hash Routing System --- */
function initAppRouter() {
  const sections = document.querySelectorAll("section.app-section");
  const navLinks = document.querySelectorAll(".nav-links a, .logo");

  function handleRoute() {
    let hash = window.location.hash || "#home";
    let params = {};
    
    // Parse query params in hash if present (e.g. #booking?dept=cardiology&doc=doc-anwar)
    if (hash.includes("?")) {
      const parts = hash.split("?");
      hash = parts[0];
      const queryStr = parts[1];
      queryStr.split("&").forEach(param => {
        const [key, value] = param.split("=");
        params[key] = decodeURIComponent(value);
      });
    }

    let targetSection = document.querySelector(hash);
    if (!targetSection) {
      hash = "#home";
      targetSection = document.getElementById("home");
    }

    // Deactivate all sections, activate target
    sections.forEach(sec => {
      sec.classList.remove("active");
    });
    targetSection.classList.add("active");

    // Update Nav Links active highlights
    navLinks.forEach(link => {
      link.classList.remove("active");
      const href = link.getAttribute("href");
      if (href === hash) {
        link.classList.add("active");
      }
    });

    // Close mobile nav menu on page change
    const navBarLinks = document.querySelector(".nav-links");
    const burgerMenu = document.querySelector(".burger-menu");
    if (navBarLinks && navBarLinks.classList.contains("active")) {
      navBarLinks.classList.remove("active");
      burgerMenu.classList.remove("active");
    }

    // Scroll to top of section
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Handle deep-linking parameters (e.g., pre-filling the booking page)
    if (hash === "#booking") {
      prefillBookingForm(params);
    }
  }

  window.addEventListener("hashchange", handleRoute);
  handleRoute(); // Execute once on initial page load
}

// Prefill Booking Wizard from query parameters
function prefillBookingForm(params) {
  const deptSelect = document.getElementById("booking-dept");
  const docSelect = document.getElementById("booking-doc");
  const dateInput = document.getElementById("booking-date");
  
  if (params.dept && deptSelect) {
    deptSelect.value = params.dept;
    // Dispatch change event to load doctors
    deptSelect.dispatchEvent(new Event("change"));
    
    if (params.doc && docSelect) {
      setTimeout(() => {
        docSelect.value = params.doc;
        docSelect.dispatchEvent(new Event("change"));
      }, 50);
    }
  }
}

/* --- Theme Engine (Light / Dark Mode) --- */
function initThemeEngine() {
  const toggleBtn = document.getElementById("theme-toggle");
  
  // Set theme from local storage or match system preferences
  const savedTheme = localStorage.getItem("hospital_theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
  
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const currentTheme = document.body.classList.contains("dark-mode") ? "dark" : "light";
      localStorage.setItem("hospital_theme", currentTheme);
      window.showToast(`Theme switched to ${currentTheme} mode`, "success");
    });
  }
}

/* --- Mobile Menu Drawer --- */
function initMobileMenu() {
  const burgerMenu = document.querySelector(".burger-menu");
  const navLinks = document.querySelector(".nav-links");
  
  if (burgerMenu && navLinks) {
    burgerMenu.addEventListener("click", () => {
      burgerMenu.classList.toggle("active");
      navLinks.classList.toggle("active");
    });
  }
}

/* --- Dynamic UI Rendering --- */

// Render primary and secondary medical specialities
function renderSpecialitiesList() {
  const primaryContainer = document.getElementById("primary-specialities-grid");
  const secondaryContainer = document.getElementById("secondary-specialities-grid");
  
  if (primaryContainer) {
    primaryContainer.innerHTML = "";
    HospitalData.specialities.primary.forEach(dept => {
      const card = document.createElement("div");
      card.className = "speciality-card";
      
      const iconSVG = getIconMarkup(dept.icon);
      
      card.innerHTML = `
        <div class="speciality-header-row">
          <div class="speciality-title-wrapper">
            <div class="speciality-icon">${iconSVG}</div>
            <h3>${dept.name}</h3>
          </div>
        </div>
        <p>${dept.desc}</p>
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div class="speciality-doctor-pill">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>Lead: <strong>${dept.doctor}</strong></span>
          </div>
          <a href="#booking?dept=${dept.id}" class="intro-link" style="font-weight:700;">
            Book Now
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </a>
        </div>
      `;
      primaryContainer.appendChild(card);
    });
  }
  
  if (secondaryContainer) {
    secondaryContainer.innerHTML = "";
    HospitalData.specialities.secondary.forEach(dept => {
      const item = document.createElement("div");
      item.className = "secondary-item";
      
      const iconSVG = getIconMarkup(dept.icon);
      
      item.innerHTML = `
        <div class="secondary-item-icon">${iconSVG}</div>
        <span class="secondary-item-name">${dept.name}</span>
      `;
      
      // Navigate to booking pre-selection on click
      item.style.cursor = "pointer";
      item.addEventListener("click", () => {
        window.location.hash = `#booking?dept=${dept.id}`;
      });
      
      secondaryContainer.appendChild(item);
    });
  }
}

// Render diagnostic scan & accessibility showcases
function renderFacilitiesList() {
  const container = document.getElementById("facilities-list");
  if (!container) return;
  
  container.innerHTML = "";
  HospitalData.facilities.forEach((fac, index) => {
    const isEven = index % 2 === 0;
    const box = document.createElement("div");
    box.className = "facility-showcase-box";
    
    let listHTML = "";
    fac.checklist.forEach(item => {
      listHTML += `
        <div class="checklist-item">
          <div class="checklist-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <div class="checklist-text">${item}</div>
        </div>
      `;
    });
    
    // Generate static mockup placeholder drawing for facilities using standard modern medical graphics via SVGs (so it matches styles)
    const backupGraphics = getFacilityGraphic(fac.id);
    
    box.innerHTML = `
      <div class="grid-2" style="${isEven ? '' : 'direction: rtl;'}">
        <div class="facility-showcase-info" style="direction: ltr;">
          <h3 style="color: var(--color-primary);">${fac.title}</h3>
          <p style="font-weight: 600; color: var(--color-secondary); margin-bottom: 8px;">${fac.subtitle}</p>
          <p>${fac.desc}</p>
          <div class="facility-checklist" style="margin-bottom: 24px;">
            ${listHTML}
          </div>
          <a href="#booking" class="btn btn-primary">Book General Appointment</a>
        </div>
        <div class="facility-showcase-image" style="direction: ltr;">
          ${backupGraphics}
        </div>
      </div>
    `;
    container.appendChild(box);
  });
}

// Render Doctors Directory with Department filters and search bar
function renderDoctorsDirectory() {
  const searchInput = document.getElementById("doctor-search");
  const deptFilter = document.getElementById("doctor-dept-filter");
  const doctorsGrid = document.getElementById("doctors-grid");
  
  if (!doctorsGrid) return;
  
  // Set up filter dropdown
  if (deptFilter) {
    deptFilter.innerHTML = '<option value="all">All Departments</option>';
    
    HospitalData.specialities.primary.forEach(dept => {
      const opt = document.createElement("option");
      opt.value = dept.id;
      opt.textContent = dept.name;
      deptFilter.appendChild(opt);
    });
    
    HospitalData.specialities.secondary.forEach(dept => {
      const opt = document.createElement("option");
      opt.value = dept.id;
      opt.textContent = dept.name;
      deptFilter.appendChild(opt);
    });
    
    deptFilter.addEventListener("change", applyFilters);
  }
  
  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }
  
  function applyFilters() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const filterDept = deptFilter ? deptFilter.value : "all";
    
    const filteredDocs = HospitalData.doctors.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(query) || doc.qualification.toLowerCase().includes(query) || doc.designation.toLowerCase().includes(query);
      const matchesDept = (filterDept === "all" || doc.department === filterDept);
      return matchesSearch && matchesDept;
    });
    
    displayDoctors(filteredDocs);
  }
  
  function displayDoctors(docsList) {
    doctorsGrid.innerHTML = "";
    
    if (docsList.length === 0) {
      doctorsGrid.innerHTML = `
        <div class="no-results" style="grid-column: 1 / -1;">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0110.089 21c-2.243 0-4.32-.647-6.08-1.764M15 19.128v-.109a11.386 11.386 0 00-4.912-1.764M10.089 21a11.386 11.386 0 01-4.912-1.764m4.912 1.764a11.386 11.386 0 004.912-1.764M4.12 19.124a9.33 9.33 0 01-2.625-.372 9.337 9.337 0 01-4.121.952 4.125 4.125 0 017.533-2.493M4.12 19.124v-.003c0-1.113.285-2.16.786-3.07M4.12 19.124v.109A11.386 11.386 0 009 21" /></svg>
          <p>No medical specialists found matching your criteria. Try searching for a different name or checking another department.</p>
        </div>
      `;
      return;
    }
    
    docsList.forEach(doc => {
      const card = document.createElement("div");
      card.className = "doctor-card";
      
      const deptBadge = doc.departmentName;
      const docAvatarSVG = getDoctorAvatarGraphic(doc.name, doc.designation);
      
      card.innerHTML = `
        <div class="doctor-photo-wrap">
          <div class="doctor-dept-badge">${deptBadge}</div>
          ${docAvatarSVG}
        </div>
        <div class="doctor-details-panel">
          <div class="doctor-info-top">
            <h3>${doc.name}</h3>
            <p>${doc.designation}</p>
          </div>
          
          <div class="doctor-meta-line" style="margin-top: 10px;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            <span>Qualifications: <strong>${doc.qualification}</strong></span>
          </div>
          
          <div class="doctor-meta-line">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>Duty: <strong style="font-size:12px;">${doc.timings}</strong></span>
          </div>
          
          <div class="doctor-meta-line">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span>Languages: <strong>${doc.languages}</strong></span>
          </div>
          
          <p style="font-size:13px; color: var(--text-secondary); line-height:1.5; margin-top:8px;">
            ${doc.bio}
          </p>
        </div>
        <div class="doctor-card-cta">
          <a href="#booking?dept=${doc.department}&doc=${doc.id}" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            Book Appointment
          </a>
        </div>
      `;
      doctorsGrid.appendChild(card);
    });
  }
  
  // Show initial doctor list
  displayDoctors(HospitalData.doctors);
}

// Render "My Appointments" panel in the sidebar
function renderMyAppointments() {
  const container = document.getElementById("my-appointments-list");
  if (!container) return;
  
  container.innerHTML = "";
  
  let bookings = [];
  try {
    const saved = localStorage.getItem("eranad_bookings");
    if (saved) {
      bookings = JSON.parse(saved);
    }
  } catch (e) {
    console.error(e);
  }
  
  if (bookings.length === 0) {
    container.innerHTML = `
      <div class="empty-bookings-notice">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        <p>No upcoming appointments found. Schedule your checkup using the booking form.</p>
      </div>
    `;
    return;
  }
  
  bookings.forEach((booking, index) => {
    const card = document.createElement("div");
    card.className = "appointment-card";
    
    const formattedDate = new Date(booking.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
    
    card.innerHTML = `
      <div class="appointment-card-title">${booking.patientName}</div>
      <div class="appointment-card-subtitle">${booking.doctorName} (${booking.departmentName})</div>
      
      <div class="appointment-card-detail">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        <span>Date: <strong>${formattedDate}</strong></span>
      </div>
      <div class="appointment-card-detail">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <span>Time: <strong>${booking.timeSlot}</strong></span>
      </div>
      <div class="appointment-card-detail" style="margin-top: 4px; font-size:11px;">
        ID: <strong>${booking.reference}</strong>
      </div>
      
      <div class="appointment-card-cancel" title="Cancel Appointment" data-index="${index}">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </div>
    `;
    
    // Wire up cancellation click
    card.querySelector(".appointment-card-cancel").addEventListener("click", () => {
      cancelAppointment(index, booking.reference);
    });
    
    container.appendChild(card);
  });
}

function cancelAppointment(index, refCode) {
  if (confirm(`Are you sure you want to cancel appointment ${refCode}?`)) {
    try {
      const saved = localStorage.getItem("eranad_bookings");
      if (saved) {
        let bookings = JSON.parse(saved);
        bookings.splice(index, 1);
        localStorage.setItem("eranad_bookings", JSON.stringify(bookings));
        
        // Re-render
        renderMyAppointments();
        window.showToast(`Appointment ${refCode} has been canceled`, "warning");
      }
    } catch (e) {
      console.error(e);
    }
  }
}

/* --- FAQ Accordions --- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");
  
  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    if (question) {
      question.addEventListener("click", () => {
        const isActive = item.classList.contains("active");
        
        // Collapse all FAQ items
        faqItems.forEach(faq => {
          faq.classList.remove("active");
        });
        
        // Toggle current item
        if (!isActive) {
          item.classList.add("active");
        }
      });
    }
  });
}

/* --- General Enquiry Form --- */
function initEnquiryForm() {
  const form = document.getElementById("enquiry-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const name = document.getElementById("enquiry-name").value.trim();
      const phone = document.getElementById("enquiry-phone").value.trim();
      const msg = document.getElementById("enquiry-msg").value.trim();
      
      if (!name || !phone || !msg) {
        window.showToast("Please fill in all details before submitting.", "warning");
        return;
      }
      
      // Simulate form sending
      window.showToast(`Thank you, ${name}! Your enquiry has been received. Our team will contact you shortly.`, "success");
      form.reset();
    });
  }
}

/* --- Scroll triggered fade-in Animations --- */
function initScrollAnimations() {
  // Check browser support
  if (!("IntersectionObserver" in window)) return;
  
  const fadeElems = document.querySelectorAll(".intro-card, .speciality-card, .facility-showcase-box, .accessibility-tile, .contact-info-card, .contact-form-card");
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });
  
  fadeElems.forEach(elem => {
    elem.style.opacity = "0";
    elem.style.transform = "translateY(25px)";
    elem.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    observer.observe(elem);
  });
}

/* --- Helper SVGs for Icons & Graphics (Aesthetic fallbacks) --- */

function getIconMarkup(iconName) {
  const icons = {
    baby: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12h.01M15 12h.01M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5M19 6.3A9 9 0 0 1 20 10c0 4.4-3.6 8-8 8s-8-3.6-8-8a9 9 0 0 1 1-3.7M12 2v2M5 3.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm14 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/></svg>`,
    heart: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    stethoscope: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5h20c0-2.31-1-4.24-2.5-5.5"/><path d="M12 2v10a4 4 0 0 0 8 0V2"/><path d="M12 12a4 4 0 0 1-8 0V2M4 2h4m8 0h4"/></svg>`,
    ambulance: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="13" height="10" rx="1"></rect><path d="M15 7h4l3 3v7h-7z"></path><circle cx="6" cy="17" r="2"></circle><circle cx="17" cy="17" r="2"></circle><line x1="9" y1="12" x2="13" y2="12"></line><line x1="11" y1="10" x2="11" y2="14"></line></svg>`,
    activity: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`,
    bone: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.5 2.5 0 0 0-2.5 2.5c0 .4.1.8.3 1.1L8.6 12.8c-.3-.2-.7-.3-1.1-.3a2.5 2.5 0 1 0 0 5c.4 0 .8-.1 1.1-.3l6.2 6.2c-.2.3-.3.7-.3 1.1a2.5 2.5 0 1 0 5 0c0-.4-.1-.8-.3-1.1l-6.2-6.2c.2-.3.3-.7.3-1.1c0-.4-.1-.8-.3-1.1l6.2-6.2c.2.3.3.7.3 1.1A2.5 2.5 0 0 0 17 3z"/></svg>`,
    eye: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
    shield: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
    target: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`,
    "hearing-aid": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 0-12 0c0 4.14 3.36 10 6 10h2a4 4 0 0 0 4-4v-6zm0 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/><path d="M10 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>`
  };
  return icons[iconName] || icons["activity"];
}

// Returns a premium CSS-powered SVG vector illustration for doctors
function getDoctorAvatarGraphic(name, designation) {
  let initials = name.split(" ").map(w => w[0]).filter(c => c !== "D" && c !== "r" && c !== ".").join("").toUpperCase().slice(0, 2);
  
  // Custom theme colors for background
  const bgColors = ["#0f766e", "#0ea5e9", "#10b981", "#6366f1", "#f59e0b", "#d946ef"];
  // Select color based on string length to make it deterministic
  const colorIndex = name.length % bgColors.length;
  const color = bgColors[colorIndex];
  
  return `
    <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="doctor-avatar-svg" style="background-color: var(--bg-tertiary);">
      <!-- Subtle modern geometric grid background -->
      <defs>
        <linearGradient id="avatarGrad-${initials}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0.4"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#avatarGrad-${initials})"/>
      <circle cx="100" cy="100" r="70" fill="var(--bg-secondary)" opacity="0.1"/>
      <circle cx="100" cy="100" r="55" fill="var(--bg-secondary)" opacity="0.2"/>
      
      <!-- Doctor Icon graphic -->
      <g fill="none" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" transform="translate(55, 45)">
        <path d="M45 50v-4a8 8 0 0 0-8-8H13a8 8 0 0 0-8 8v4" stroke-width="7"/>
        <circle cx="25" cy="20" r="10" stroke-width="7"/>
        <!-- Stethoscope on neck -->
        <path d="M15 36c0 6 10 12 10 12s10-6 10-12" stroke="white" stroke-width="3"/>
        <path d="M25 48v16" stroke="white" stroke-width="3"/>
        <circle cx="25" cy="67" r="4" fill="white"/>
      </g>
      
      <!-- Initials tag -->
      <text x="100" y="165" font-family="var(--font-headings)" font-weight="800" font-size="28" fill="white" text-anchor="middle" letter-spacing="1">
        ${initials}
      </text>
    </svg>
  `;
}

// Returns a vector layout mapping the facility details
function getFacilityGraphic(facilityId) {
  if (facilityId === "ultrasound") {
    return `
      <svg width="100%" height="100%" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style="background-color: var(--bg-tertiary);">
        <defs>
          <linearGradient id="scanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="var(--color-primary)" stop-opacity="0.9"/>
            <stop offset="100%" stop-color="var(--color-secondary)" stop-opacity="0.9"/>
          </linearGradient>
          <radialGradient id="screenGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="var(--color-secondary)" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="var(--color-secondary)" stop-opacity="0"/>
          </radialGradient>
        </defs>
        
        <!-- Screen container -->
        <rect x="50" y="30" width="300" height="200" rx="16" fill="#111827" stroke="var(--border-color)" stroke-width="6"/>
        <rect x="65" y="45" width="270" height="170" rx="8" fill="#030712"/>
        
        <!-- Grid pattern on scanner screen -->
        <path d="M 65,80 L 335,80 M 65,115 L 335,115 M 65,150 L 335,150 M 65,185 L 335,185" stroke="#1f2937" stroke-width="1"/>
        <path d="M 120,45 L 120,215 M 175,45 L 175,215 M 230,45 L 230,215 M 285,45 L 285,215" stroke="#1f2937" stroke-width="1"/>
        
        <!-- Scanner Waveform/Heartbeat details -->
        <path d="M 75,130 Q 120,130 140,80 T 170,180 T 200,130 T 325,130" fill="none" stroke="var(--color-primary)" stroke-width="4" stroke-linecap="round"/>
        <circle cx="170" cy="180" r="6" fill="var(--color-primary)"/>
        
        <!-- Fetal/Ultrasound shape outline -->
        <path d="M 230,120 C 240,100 270,100 280,120 C 290,135 285,155 270,160 C 255,165 240,155 235,145 Z" fill="url(#screenGlow)" stroke="var(--color-secondary)" stroke-width="3" stroke-dasharray="6,4"/>
        
        <!-- Control board panel -->
        <rect x="50" y="240" width="300" height="30" rx="8" fill="var(--bg-secondary)" stroke="var(--border-color)" stroke-width="3"/>
        <circle cx="85" cy="255" r="6" fill="var(--color-accent)"/>
        <circle cx="115" cy="255" r="6" fill="var(--color-secondary)"/>
        <line x1="150" y1="255" x2="280" y2="255" stroke="var(--border-color)" stroke-width="4" stroke-linecap="round"/>
        
        <!-- Text overlay -->
        <text x="80" y="70" fill="var(--color-secondary)" font-family="monospace" font-size="10" font-weight="bold">SCAN MODE: ULTRASOUND 4D</text>
        <text x="270" y="70" fill="var(--color-success)" font-family="monospace" font-size="10" font-weight="bold">ONLINE</text>
      </svg>
    `;
  }
  
  if (facilityId === "accessibility") {
    return `
      <svg width="100%" height="100%" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style="background-color: var(--bg-tertiary);">
        <defs>
          <linearGradient id="accessGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="var(--color-secondary)" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="var(--color-primary)" stop-opacity="0.8"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#accessGrad)"/>
        
        <!-- Hospital glass facade mock -->
        <path d="M 40,260 L 360,260 L 360,60 C 360,60 200,80 40,60 Z" fill="var(--bg-secondary)" opacity="0.9"/>
        <line x1="200" y1="70" x2="200" y2="260" stroke="var(--border-color)" stroke-width="2" stroke-dasharray="4,4"/>
        
        <!-- Wheelchair logo drawing -->
        <g fill="none" stroke="var(--color-primary)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" transform="translate(150, 95)">
          <circle cx="50" cy="20" r="10" fill="var(--color-primary)" stroke="none"/>
          <path d="M 40,45 C 40,65 55,80 75,80 C 95,80 110,65 110,45" stroke-width="10"/>
          <path d="M 40,40 L 70,40 L 90,75 L 120,75" stroke-width="10"/>
          <path d="M 65,30 L 65,55" stroke-width="10"/>
        </g>
        
        <!-- Accessibility features header tag -->
        <rect x="110" y="210" width="180" height="34" rx="17" fill="var(--bg-primary)" stroke="var(--color-primary)" stroke-width="2"/>
        <text x="200" y="232" fill="var(--color-primary)" font-family="var(--font-headings)" font-size="12" font-weight="bold" text-anchor="middle">ACCESSIBLE FACILITY</text>
      </svg>
    `;
  }
  
  return "";
}
export { getIconMarkup, getDoctorAvatarGraphic };
