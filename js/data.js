// Eranad Hospital & Research Centre - Master Data Module

const HospitalData = {
  specialities: {
    primary: [
      {
        id: "pediatrics",
        name: "Pediatrics & Neonatology",
        icon: "baby",
        desc: "Expert child healthcare services featuring comprehensive newborn screening, immunization, and growth monitoring. Led by specialist pediatricians.",
        doctor: "Dr. Shaheer M",
        qualification: "MBBS, DNB-Pediatrics",
        details: [
          "Neonatal Intensive Care (NICU) backup",
          "Comprehensive developmental assessments",
          "Immunization & pediatric wellness programs",
          "Childhood asthma & allergy clinic"
        ]
      },
      {
        id: "cardiology",
        name: "Cardiology",
        icon: "heart",
        desc: "Comprehensive heart care including diagnostic cardiological services, heart health counseling, and management of acute and chronic cardiac issues.",
        doctor: "Dr. Anwar K",
        qualification: "MBBS, MD, DNB, DrNB Cardiology",
        details: [
          "Daily outpatient cardiac consultations",
          "Echocardiogram (Echo) & TMT assessment",
          "Hypertension & lipid disorder management",
          "Post-cardiac surgery rehabilitation support"
        ]
      },
      {
        id: "general-medicine",
        name: "General Medicine",
        icon: "stethoscope",
        desc: "Diagnosis and management of complex infectious diseases, lifestyle disorders like diabetes and hypertension, and general health checkups.",
        doctor: "Dr. Asif Rahman",
        qualification: "MBBS, DNB Medicine",
        details: [
          "Specialized care for Viral Fevers, Dengue, and Typhoid",
          "Diabetes and Thyroid disorder care clinics",
          "Geriatric (elderly) medicine programs",
          "Preventative health checkup packages"
        ]
      },
      {
        id: "emergency-medicine",
        name: "Emergency Medicine",
        icon: "ambulance",
        desc: "24/7 Trauma and Critical Care response. Staffed by qualified senior medical officers trained in handling acute clinical emergencies.",
        doctor: "Dr. Logeswaran I",
        qualification: "MBBS, Senior Medical Officer",
        details: [
          "Round-the-clock emergency medical response",
          "Fully equipped trauma & resuscitation bays",
          "Cardiac, respiratory, and stroke emergency care",
          "24/7 critical care ambulance support"
        ]
      }
    ],
    secondary: [
      { id: "gynecology", name: "Gynecology & Obstetrics", icon: "activity" },
      { id: "orthopedics", name: "Orthopedics & Joint Care", icon: "bone" },
      { id: "ophthalmology", name: "Ophthalmology (Eye)", icon: "eye" },
      { id: "gastroenterology", name: "Gastroenterology", icon: "shield" },
      { id: "oncology", name: "Medical & Radiation Oncology", icon: "target" },
      { id: "ent", name: "Otorhinolaryngology (ENT)", icon: "hearing-aid" }
    ]
  },
  
  doctors: [
    {
      id: "doc-shaheer",
      name: "Dr. Shaheer M",
      qualification: "MBBS, DNB (Pediatrics)",
      designation: "Chief Pediatrician & Neonatologist",
      department: "pediatrics",
      departmentName: "Pediatrics & Neonatology",
      experience: "12+ Years",
      languages: "English, Malayalam, Hindi",
      timings: "Mon - Sat: 9:00 AM - 1:00 PM, 4:00 PM - 7:00 PM",
      daysAvailable: [1, 2, 3, 4, 5, 6], // Mon=1 to Sat=6
      availableSlots: ["09:30 AM", "10:30 AM", "11:30 AM", "12:30 PM", "04:30 PM", "05:30 PM", "06:30 PM"],
      avatar: "doctor_shaheer.jpg", // Will create premium avatar fallback via SVG in JS if file missing
      bio: "Dr. Shaheer is a highly respected pediatrician dedicated to child development and critical neonatal care. He has extensive training in managing complex developmental issues in children."
    },
    {
      id: "doc-anwar",
      name: "Dr. Anwar K",
      qualification: "MBBS, MD, DNB, DrNB (Cardiology)",
      designation: "Senior Consultant Cardiologist",
      department: "cardiology",
      departmentName: "Cardiology",
      experience: "15+ Years",
      languages: "English, Malayalam, Tamil",
      timings: "Mon - Fri: 10:00 AM - 3:00 PM",
      daysAvailable: [1, 2, 3, 4, 5],
      availableSlots: ["10:15 AM", "11:00 AM", "11:45 AM", "01:30 PM", "02:15 PM"],
      avatar: "doctor_anwar.jpg",
      bio: "Dr. Anwar K is a leading cardiologist specializing in diagnostic cardiac testing, preventive heart care, and advanced management of coronary artery disease and heart failures."
    },
    {
      id: "doc-asif",
      name: "Dr. Asif Rahman",
      qualification: "MBBS, DNB (Medicine)",
      designation: "Consultant Physician",
      department: "general-medicine",
      departmentName: "General Medicine",
      experience: "10+ Years",
      languages: "English, Malayalam, Arabic",
      timings: "Mon - Sat: 9:00 AM - 4:00 PM",
      daysAvailable: [1, 2, 3, 4, 5, 6],
      availableSlots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"],
      avatar: "doctor_asif.jpg",
      bio: "Dr. Asif Rahman has a strong clinical background in managing critical systemic illnesses, infectious diseases like dengue, viral fevers, and chronic metabolic disorders like diabetes."
    },
    {
      id: "doc-logeswaran",
      name: "Dr. Logeswaran I",
      qualification: "MBBS",
      designation: "Senior Medical Officer (Emergency Medicine)",
      department: "emergency-medicine",
      departmentName: "Emergency Medicine",
      experience: "8+ Years",
      languages: "English, Tamil, Malayalam",
      timings: "Available 24/7 (Emergency Duty Roster)",
      daysAvailable: [1, 2, 3, 4, 5, 6, 7], // 7 = Sunday
      availableSlots: ["08:00 AM", "12:00 PM", "04:00 PM", "08:00 PM"],
      avatar: "doctor_logeswaran.jpg",
      bio: "Dr. Logeswaran leads the emergency and trauma response squad. He is exceptionally skilled in acute cardiopulmonary resuscitation, trauma surgery stabilization, and rapid clinical triaging."
    },
    {
      id: "doc-gyn-radhika",
      name: "Dr. Radhika Nair",
      qualification: "MBBS, MD (Gynecology & Obstetrics)",
      designation: "Consultant Gynecologist",
      department: "gynecology",
      departmentName: "Gynecology & Obstetrics",
      experience: "11+ Years",
      languages: "English, Malayalam, Hindi",
      timings: "Mon - Sat: 9:30 AM - 1:30 PM",
      daysAvailable: [1, 2, 3, 4, 5, 6],
      availableSlots: ["09:45 AM", "10:45 AM", "11:45 AM", "12:45 PM"],
      avatar: "doctor_radhika.jpg",
      bio: "Dr. Radhika specializes in high-risk pregnancies, maternal medicine, laparoscopic gynecological surgeries, and general women's health wellness checkups."
    },
    {
      id: "doc-ortho-menon",
      name: "Dr. Vijay Menon",
      qualification: "MBBS, MS (Orthopedics)",
      designation: "Senior Joint Replacement Surgeon",
      department: "orthopedics",
      departmentName: "Orthopedics & Joint Care",
      experience: "14+ Years",
      languages: "English, Malayalam, Kannada",
      timings: "Tue, Thu, Sat: 2:00 PM - 6:00 PM",
      daysAvailable: [2, 4, 6],
      availableSlots: ["02:30 PM", "03:30 PM", "04:30 PM", "05:30 PM"],
      avatar: "doctor_menon.jpg",
      bio: "Dr. Vijay Menon has successfully performed hundreds of joint replacements and arthroscopic surgeries. His clinical interests include sports medicine and complex fracture management."
    }
  ],
  
  facilities: [
    {
      id: "ultrasound",
      title: "Advanced Ultrasound Scan",
      subtitle: "Daily Diagnostic Imaging Services",
      desc: "Our state-of-the-art ultrasound department offers daily screening using advanced high-resolution imaging technology. This guarantees rapid, precise diagnosis for pediatric, obstetrics, cardiology, and general medicine fields.",
      checklist: ["High-definition imaging", "Daily availability", "Expert radiologist reports", "Pregnancy anomaly scans"],
      image: "diagnostic_ultrasound.jpg"
    },
    {
      id: "accessibility",
      title: "Hospital Accessibility Support",
      subtitle: "Comfortable and Inclusive Care Environment",
      desc: "Eranad Hospital is committed to providing seamless medical access to all individuals. Our facilities feature dedicated physical accommodations and flexible payment methods to guarantee a hassle-free patient journey.",
      checklist: [
        "Wheelchair-accessible entrance & ramp",
        "Wheelchair-friendly designated parking lot",
        "Card payment support (Visa/Mastercard)",
        "NFC, UPI, and digital mobile wallet methods"
      ],
      image: "hospital_accessibility.jpg"
    }
  ]
};

// Expose data globally if script is included directly in browser
if (typeof window !== 'undefined') {
  window.HospitalData = HospitalData;
}
export default HospitalData;
