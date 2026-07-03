// Eranad Hospital & Research Centre - Booking Engine Module
import HospitalData from "./data.js";

document.addEventListener("DOMContentLoaded", () => {
  initBookingWizard();
});

function initBookingWizard() {
  const departmentSelect = document.getElementById("booking-dept");
  const doctorSelect = document.getElementById("booking-doc");
  const dateInput = document.getElementById("booking-date");
  const timeSlotsContainer = document.getElementById("time-slots");
  
  const stepIndicators = document.querySelectorAll(".step-indicator");
  const formSteps = document.querySelectorAll(".booking-form-step");
  
  const btnNext1 = document.getElementById("btn-next-1");
  const btnPrev2 = document.getElementById("btn-prev-2");
  const btnNext2 = document.getElementById("btn-next-2");
  const btnPrev3 = document.getElementById("btn-prev-3");
  const btnSubmit = document.getElementById("btn-submit-booking");
  
  let currentStep = 1;
  let selectedDoctorData = null;
  
  // Set minimum date to today
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;
  }
  
  // Load departments dynamically in the booking select
  if (departmentSelect) {
    departmentSelect.innerHTML = '<option value="" disabled selected>Select Department</option>';
    
    // Add primary specialities
    HospitalData.specialities.primary.forEach(dept => {
      const opt = document.createElement("option");
      opt.value = dept.id;
      opt.textContent = dept.name;
      departmentSelect.appendChild(opt);
    });
    
    // Add secondary specialities
    HospitalData.specialities.secondary.forEach(dept => {
      const opt = document.createElement("option");
      opt.value = dept.id;
      opt.textContent = dept.name;
      departmentSelect.appendChild(opt);
    });
    
    departmentSelect.addEventListener("change", handleDepartmentChange);
  }
  
  if (doctorSelect) {
    doctorSelect.addEventListener("change", handleDoctorChange);
  }
  
  if (dateInput) {
    dateInput.addEventListener("change", handleDateChange);
  }
  
  // Wizard Navigation
  if (btnNext1) {
    btnNext1.addEventListener("click", () => {
      if (validateStep1()) {
        goToStep(2);
      }
    });
  }
  
  if (btnPrev2) {
    btnPrev2.addEventListener("click", () => {
      goToStep(1);
    });
  }
  
  if (btnNext2) {
    btnNext2.addEventListener("click", () => {
      if (validateStep2()) {
        goToStep(3);
      }
    });
  }
  
  if (btnPrev3) {
    btnPrev3.addEventListener("click", () => {
      goToStep(2);
    });
  }
  
  if (btnSubmit) {
    btnSubmit.addEventListener("click", handleBookingSubmit);
  }
  
  // Function to go to specific step
  function goToStep(step) {
    currentStep = step;
    
    // Update step indicators
    stepIndicators.forEach((indicator, index) => {
      const stepNum = index + 1;
      indicator.classList.remove("active", "completed");
      if (stepNum === currentStep) {
        indicator.classList.add("active");
      } else if (stepNum < currentStep) {
        indicator.classList.add("completed");
      }
    });
    
    // Show/hide sections
    formSteps.forEach((stepSection, index) => {
      const stepNum = index + 1;
      stepSection.classList.remove("active");
      if (stepNum === currentStep) {
        stepSection.classList.add("active");
      }
    });
  }
  
  // Handle Department Dropdown Selection change
  function handleDepartmentChange() {
    const selectedDeptId = departmentSelect.value;
    doctorSelect.innerHTML = '<option value="" disabled selected>Select Doctor</option>';
    doctorSelect.disabled = false;
    
    // Filter doctors
    const filteredDocs = HospitalData.doctors.filter(doc => doc.department === selectedDeptId);
    
    if (filteredDocs.length > 0) {
      filteredDocs.forEach(doc => {
        const opt = document.createElement("option");
        opt.value = doc.id;
        opt.textContent = `${doc.name} (${doc.qualification})`;
        doctorSelect.appendChild(opt);
      });
    } else {
      // Fallback if no specific doctor assigned to a secondary department
      const opt = document.createElement("option");
      opt.value = "general-duty";
      opt.textContent = "General Duty Consultant Doctor";
      doctorSelect.appendChild(opt);
    }
    
    selectedDoctorData = null;
    timeSlotsContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 14px;">Select a doctor and date to load available time slots.</p>';
  }
  
  // Handle Doctor change
  function handleDoctorChange() {
    const docId = doctorSelect.value;
    selectedDoctorData = HospitalData.doctors.find(d => d.id === docId);
    
    if (dateInput.value) {
      loadTimeSlots();
    }
  }
  
  // Handle Date change
  function handleDateChange() {
    if (doctorSelect.value) {
      loadTimeSlots();
    }
  }
  
  // Load Time Slots
  function loadTimeSlots() {
    timeSlotsContainer.innerHTML = "";
    const selectedDate = new Date(dateInput.value);
    
    // Sunday checking (0 = Sunday, JavaScript getDay). In data.js 7 = Sunday
    let dayOfWeek = selectedDate.getDay();
    if (dayOfWeek === 0) dayOfWeek = 7;
    
    // Default slots fallback
    let slots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];
    
    if (selectedDoctorData) {
      // Check if doctor is available on this weekday
      if (!selectedDoctorData.daysAvailable.includes(dayOfWeek)) {
        timeSlotsContainer.innerHTML = `<p style="color: var(--color-danger); font-weight: 600; font-size: 14px;">Selected Doctor is not scheduled on this day of the week. Please choose a different date or doctor.</p>`;
        return;
      }
      slots = selectedDoctorData.availableSlots;
    }
    
    // Add slot radio elements
    slots.forEach((slot, index) => {
      const wrap = document.createElement("div");
      
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "time-slot";
      radio.value = slot;
      radio.id = `slot-${index}`;
      radio.className = "time-slot-radio";
      
      const label = document.createElement("label");
      label.htmlFor = `slot-${index}`;
      label.className = "time-slot-label";
      label.textContent = slot;
      
      wrap.appendChild(radio);
      wrap.appendChild(label);
      timeSlotsContainer.appendChild(wrap);
    });
  }
  
  // Step 1 Validation
  function validateStep1() {
    if (!departmentSelect.value) {
      showToast("Please select a department", "warning");
      return false;
    }
    if (!doctorSelect.value) {
      showToast("Please select a doctor", "warning");
      return false;
    }
    if (!dateInput.value) {
      showToast("Please choose an appointment date", "warning");
      return false;
    }
    
    // If doctor is chosen, verify weekday schedule
    if (selectedDoctorData) {
      const selectedDate = new Date(dateInput.value);
      let dayOfWeek = selectedDate.getDay();
      if (dayOfWeek === 0) dayOfWeek = 7;
      if (!selectedDoctorData.daysAvailable.includes(dayOfWeek)) {
        showToast("Selected doctor is not available on this weekday", "error");
        return false;
      }
    }
    
    return true;
  }
  
  // Step 2 Validation
  function validateStep2() {
    const checkedRadio = document.querySelector('input[name="time-slot"]:checked');
    if (!checkedRadio) {
      showToast("Please select a time slot", "warning");
      return false;
    }
    return true;
  }
  
  // Form submission handler
  function handleBookingSubmit(e) {
    e.preventDefault();
    
    const pName = document.getElementById("patient-name").value.trim();
    const pEmail = document.getElementById("patient-email").value.trim();
    const pPhone = document.getElementById("patient-phone").value.trim();
    const pGender = document.getElementById("patient-gender").value;
    const pAge = document.getElementById("patient-age").value;
    const pNotes = document.getElementById("patient-notes").value.trim();
    
    if (!pName || !pPhone || !pGender || !pAge) {
      showToast("Please fill in all required fields marked with *", "warning");
      return;
    }
    
    // Collect Booking Information
    const deptId = departmentSelect.value;
    const docId = doctorSelect.value;
    const date = dateInput.value;
    const slot = document.querySelector('input[name="time-slot"]:checked').value;
    
    const deptName = departmentSelect.options[departmentSelect.selectedIndex].text;
    const docName = doctorSelect.options[doctorSelect.selectedIndex].text.split(" (")[0];
    
    const bookingRef = "EH-" + Date.now().toString().slice(-6);
    
    const booking = {
      reference: bookingRef,
      patientName: pName,
      patientEmail: pEmail,
      patientPhone: pPhone,
      patientGender: pGender,
      patientAge: pAge,
      patientNotes: pNotes,
      departmentId: deptId,
      departmentName: deptName,
      doctorId: docId,
      doctorName: docName,
      date: date,
      timeSlot: slot,
      createdAt: new Date().toISOString()
    };
    
    // Save to Local Storage
    saveBooking(booking);
    
    // Show success ticket
    renderSuccessTicket(booking);
    
    // Reset booking wizard step 1
    departmentSelect.value = "";
    doctorSelect.innerHTML = '<option value="" disabled selected>Select Doctor</option>';
    dateInput.value = "";
    timeSlotsContainer.innerHTML = "";
    document.getElementById("booking-form").reset();
    
    // Success Toast
    showToast("Appointment Booked Successfully!", "success");
    
    // Route to confirmation / clear wizard
    goToStep(1);
    
    // Scroll to booking card top
    document.querySelector(".booking-wizard-card").scrollIntoView({ behavior: "smooth" });
  }
}

// Save appointment to Local Storage
function saveBooking(booking) {
  let bookings = [];
  try {
    const saved = localStorage.getItem("eranad_bookings");
    if (saved) {
      bookings = JSON.parse(saved);
    }
  } catch (e) {
    console.error(e);
  }
  
  bookings.unshift(booking); // Newest bookings first
  localStorage.setItem("eranad_bookings", JSON.stringify(bookings));
  
  // Trigger update event
  const event = new CustomEvent("bookingsUpdated");
  window.dispatchEvent(event);
}

// Render Success Receipt Ticket
function renderSuccessTicket(booking) {
  const wizardCard = document.querySelector(".booking-wizard-card");
  
  const successHTML = `
    <div class="booking-success-wrap">
      <div class="booking-success-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
      </div>
      <h3>Appointment Confirmed</h3>
      <p>Your appointment has been successfully scheduled. Please save or print this booking pass for your reference.</p>
      
      <div class="booking-ticket">
        <div class="ticket-row">
          <div class="ticket-label">Appointment ID</div>
          <div class="ticket-val highlight">${booking.reference}</div>
        </div>
        <div class="ticket-row">
          <div class="ticket-label">Patient Name</div>
          <div class="ticket-val">${booking.patientName} (${booking.patientAge} Yrs, ${booking.patientGender})</div>
        </div>
        <div class="ticket-row">
          <div class="ticket-label">Department</div>
          <div class="ticket-val">${booking.departmentName}</div>
        </div>
        <div class="ticket-row">
          <div class="ticket-label">Doctor</div>
          <div class="ticket-val">${booking.doctorName}</div>
        </div>
        <div class="ticket-row">
          <div class="ticket-label">Date</div>
          <div class="ticket-val">${formatDateFriendly(booking.date)}</div>
        </div>
        <div class="ticket-row">
          <div class="ticket-label">Time Slot</div>
          <div class="ticket-val highlight">${booking.timeSlot}</div>
        </div>
        <div class="ticket-row">
          <div class="ticket-label">Emergency Hotline</div>
          <div class="ticket-val">+91 4931 274 500</div>
        </div>
      </div>
      
      <div style="display: flex; gap: 16px; justify-content: center;">
        <button class="btn btn-primary" onclick="window.print()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg> Print Pass</button>
        <button class="btn btn-secondary" id="btn-success-done">Done</button>
      </div>
    </div>
  `;
  
  // Store original card HTML
  const originalHTML = wizardCard.innerHTML;
  wizardCard.innerHTML = successHTML;
  
  document.getElementById("btn-success-done").addEventListener("click", () => {
    wizardCard.innerHTML = originalHTML;
    initBookingWizard(); // Re-initialize logic
  });
}

function formatDateFriendly(dateStr) {
  const d = new Date(dateStr);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return d.toLocaleDateString('en-US', options);
}

// Toast notification helper
function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }
  
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  let icon = "";
  if (type === "success") {
    icon = `<svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
  } else if (type === "warning") {
    icon = `<svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`;
  } else {
    icon = `<svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
  }
  
  toast.innerHTML = `
    ${icon}
    <div class="toast-message">${message}</div>
  `;
  
  container.appendChild(toast);
  
  // Trigger slide-in transition
  setTimeout(() => {
    toast.classList.add("show");
  }, 50);
  
  // Remove after duration
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

// Expose toast to window so it can be called from main.js
window.showToast = showToast;
