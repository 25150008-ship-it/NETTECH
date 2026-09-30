/* ==========================================================================
   CONFIGURACIÓN DE GOOGLE FORMS (EDITAR AQUÍ SUS ENLACES REALES)
   ========================================================================== */
const GOOGLE_FORM_URL = ""; 
// Ejemplo de uso: const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform";

const GOOGLE_RESULTS_URL = ""; 
// Ejemplo de uso: const GOOGLE_RESULTS_URL = "https://docs.google.com/spreadsheets/d/...";

/* ==========================================================================
   ESTRUCTURA DE DATOS PARA LOS ESTÁNDARES
   ========================================================================== */
const STANDARDS = {
  T568A: [
    { name: "Blanco/Verde", color: "linear-gradient(90deg, #4caf50 50%, #ffffff 50%)", key: "bv" },
    { name: "Verde", color: "#4caf50", key: "v" },
    { name: "Blanco/Naranja", color: "linear-gradient(90deg, #ff9800 50%, #ffffff 50%)", key: "bn" },
    { name: "Azul", color: "#2196f3", key: "a" },
    { name: "Blanco/Azul", color: "linear-gradient(90deg, #2196f3 50%, #ffffff 50%)", key: "ba" },
    { name: "Naranja", color: "#ff9800", key: "n" },
    { name: "Blanco/Marrón", color: "linear-gradient(90deg, #795548 50%, #ffffff 50%)", key: "bm" },
    { name: "Marrón", color: "#795548", key: "m" }
  ],
  T568B: [
    { name: "Blanco/Naranja", color: "linear-gradient(90deg, #ff9800 50%, #ffffff 50%)", key: "bn" },
    { name: "Naranja", color: "#ff9800", key: "n" },
    { name: "Blanco/Verde", color: "linear-gradient(90deg, #4caf50 50%, #ffffff 50%)", key: "bv" },
    { name: "Azul", color: "#2196f3", key: "a" },
    { name: "Blanco/Azul", color: "linear-gradient(90deg, #2196f3 50%, #ffffff 50%)", key: "ba" },
    { name: "Verde", color: "#4caf50", key: "v" },
    { name: "Blanco/Marrón", color: "linear-gradient(90deg, #795548 50%, #ffffff 50%)", key: "bm" },
    { name: "Marrón", color: "#795548", key: "m" }
  ]
};

/* Preguntas para el Quiz */
const QUIZ_QUESTIONS = [
  {
    question: "1. ¿Cuáles pines cambian de posición al alternar entre el estándar T568A y T568B?",
    options: ["Pines 4, 5, 7 y 8", "Pines 1, 2, 3 y 6", "Pines 1, 3, 5 y 7", "Todos los 8 pines cambian"],
    correct: 1
  },
  {
    question: "2. ¿Qué par de colores realiza la transmisión (TX) en los pines 1 y 2 en el estándar T568B?",
    options: ["Par Verde", "Par Azul", "Par Naranja", "Par Marrón"],
    correct: 2
  },
  {
    question: "3. ¿Cuál es el ancho de banda (frecuencia) máximo certificado para la Categoría 6?",
    options: ["100 MHz", "250 MHz", "500 MHz", "1000 MHz"],
    correct: 1
  },
  {
    question: "4. ¿Cómo se construye un cable Ethernet cruzado (Crossover) tradicional?",
    options: ["Un extremo T568A y el otro extremo T568A", "Un extremo T568A y el otro extremo T568B", "Un extremo T568B y el otro extremo T568B", "Ignorando el código de colores"],
    correct: 1
  },
  {
    question: "5. ¿Qué componente físico interno distingue la construcción de Cat 6 respecto a Cat 5e?",
    options: ["Funda exterior metálica", "Separador plástico en cruceta (Spline)", "Solo 2 pares trenzados", "Conector de oro macizo"],
    correct: 1
  }
];

// Variables de estado del taller interactivo
let currentAssembly = Array(8).fill(null);
let attempts = 0;
let selectedWireIndex = null;

/* ==========================================================================
   INICIALIZACIÓN AL CARGAR EL DOM
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initRJ45Hover();
  initActivity();
  initAnatomyInteraction();
  initQuiz();
  initGoogleForms();
  initAccordion();
  initContactForm();
  
  window.addEventListener("scroll", updateProgressBar);
});

/* ==========================================================================
   1. NAVEGACIÓN Y BARRA DE PROGRESO DE LECTURA
   ========================================================================== */
function initNavigation() {
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });
}

function updateProgressBar() {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  
  document.getElementById("progressBar").style.width = scrolled + "%";
  document.getElementById("progressPercentage").textContent = Math.round(scrolled) + "%";
}

/* ==========================================================================
   2. RJ45 INTERACTIVO
   ========================================================================== */
function initRJ45Hover() {
  setupConnectorsHover("rj45-a", "info-a");
  setupConnectorsHover("rj45-b", "info-b");
}

function setupConnectorsHover(connectorId, infoBoxId) {
  const pins = document.querySelectorAll(`#${connectorId} .pin`);
  const infoBox = document.getElementById(infoBoxId);

  pins.forEach(pin => {
    pin.addEventListener("mouseenter", () => {
      const pinNum = pin.getAttribute("data-pin");
      const color = pin.getAttribute("data-color");
      const pair = pin.getAttribute("data-pair");

      infoBox.innerHTML = `
        <span class="info-title">Pin ${pinNum}: ${color}</span>
        <span class="info-desc">Función: ${pair}</span>
      `;
    });
  });
}

/* ==========================================================================
   3. TALLER INTERACTIVO DE ORDENAMIENTO DE CABLES
   ========================================================================== */
function initActivity() {
  const standardSelect = document.getElementById("standardSelect");
  const resetBtn = document.getElementById("resetActivity");
  const checkBtn = document.getElementById("checkAssembly");

  standardSelect.addEventListener("change", resetActivity);
  resetBtn.addEventListener("click", resetActivity);
  checkBtn.addEventListener("click", checkAssembly);

  resetActivity();
}

function resetActivity() {
  const selectedStandard = document.getElementById("standardSelect").value;
  const targetColors = [...STANDARDS[selectedStandard]];
  
  // Mezclar array
  const shuffled = targetColors.sort(() => Math.random() - 0.5);
  currentAssembly = Array(8).fill(null);
  selectedWireIndex = null;

  renderPalette(shuffled);
  renderSlots();
  document.getElementById("activityFeedback").textContent = "";
}

function renderPalette(wires) {
  const palette = document.getElementById("colorPalette");
  palette.innerHTML = "";

  wires.forEach((wire, idx) => {
    const el = document.createElement("div");
    el.className = "wire-item";
    el.style.background = wire.color;
    el.textContent = wire.name;
    el.dataset.key = wire.key;
    
    el.addEventListener("click", () => {
      placeWireInNextSlot(wire, el);
    });

    palette.appendChild(el);
  });
}

function renderSlots() {
  const slotsContainer = document.getElementById("wireSlots");
  slotsContainer.innerHTML = "";

  for (let i = 0; i < 8; i++) {
    const slot = document.createElement("div");
    slot.className = "slot";
    slot.dataset.slotNum = `Pin ${i + 1}`;
    
    if (currentAssembly[i]) {
      const wire = currentAssembly[i];
      slot.style.background = wire.color;
      slot.textContent = wire.name;
      slot.style.border = "none";
      
      slot.addEventListener("click", () => {
        removeFromSlot(i);
      });
    }

    slotsContainer.appendChild(slot);
  }
}

function placeWireInNextSlot(wire, element) {
  const emptyIndex = currentAssembly.findIndex(item => item === null);
  if (emptyIndex !== -1) {
    currentAssembly[emptyIndex] = wire;
    element.style.visibility = "hidden";
    renderSlots();
  }
}

function removeFromSlot(index) {
  const removed = currentAssembly[index];
  if (removed) {
    currentAssembly[index] = null;
    
    // Restaurar visibilidad en paleta
    const paletteItems = document.querySelectorAll(".wire-item");
    paletteItems.forEach(item => {
      if (item.dataset.key === removed.key && item.style.visibility === "hidden") {
        item.style.visibility = "visible";
      }
    });

    renderSlots();
  }
}

function checkAssembly() {
  attempts++;
  document.getElementById("attemptsCount").textContent = attempts;
  
  const selectedStandard = document.getElementById("standardSelect").value;
  const correctPattern = STANDARDS[selectedStandard];
  const feedback = document.getElementById("activityFeedback");

  let isCorrect = true;
  for (let i = 0; i < 8; i++) {
    if (!currentAssembly[i] || currentAssembly[i].key !== correctPattern[i].key) {
      isCorrect = false;
      break;
    }
  }

  if (isCorrect) {
    feedback.style.color = "var(--accent-green)";
    feedback.textContent = `¡Excelente! El ordenamiento para ${selectedStandard} es 100% correcto.`;
  } else {
    feedback.style.color = "var(--accent-red)";
    feedback.textContent = "Hay algunos conductores fuera de posición. Revisa e inténtalo nuevamente.";
  }
}

/* ==========================================================================
   4. ANATOMÍA INTERACTIVA
   ========================================================================== */
function initAnatomyInteraction() {
  const items = document.querySelectorAll(".anatomy-item");
  const detailBox = document.getElementById("anatomyDetail");

  items.forEach(item => {
    item.addEventListener("click", () => {
      const info = item.getAttribute("data-info");
      detailBox.innerHTML = `<strong>${item.querySelector("h4").textContent}:</strong> ${info}`;
    });
  });
}

/* ==========================================================================
   5. MINI QUIZ INTERACTIVO
   ========================================================================== */
function initQuiz() {
  const quizBox = document.getElementById("quizBox");
  quizBox.innerHTML = "";

  QUIZ_QUESTIONS.forEach((q, qIndex) => {
    const block = document.createElement("div");
    block.className = "question-block";

    const title = document.createElement("div");
    title.className = "question-title";
    title.textContent = q.question;
    block.appendChild(title);

    const optsList = document.createElement("div");
    optsList.className = "options-list";

    q.options.forEach((opt, oIndex) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = opt;
      btn.dataset.question = qIndex;
      btn.dataset.option = oIndex;

      btn.addEventListener("click", () => selectOption(qIndex, oIndex));
      optsList.appendChild(btn);
    });

    block.appendChild(optsList);
    quizBox.appendChild(block);
  });

  // Botón de evaluación
  const submitBtn = document.createElement("button");
  submitBtn.className = "btn btn-primary mt-3";
  submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Evaluar Mini-Quiz`;
  submitBtn.addEventListener("click", evaluateQuiz);
  quizBox.appendChild(submitBtn);

  document.getElementById("retryQuiz").addEventListener("click", resetQuiz);
}

const userAnswers = {};

function selectOption(qIndex, oIndex) {
  userAnswers[qIndex] = oIndex;
  
  const buttons = document.querySelectorAll(`.option-btn[data-question="${qIndex}"]`);
  buttons.forEach(btn => {
    btn.classList.remove("selected");
    if (parseInt(btn.dataset.option) === oIndex) {
      btn.classList.add("selected");
    }
  });
}

function evaluateQuiz() {
  let score = 0;
  QUIZ_QUESTIONS.forEach((q, idx) => {
    if (userAnswers[idx] === q.correct) {
      score++;
    }
  });

  const quizBox = document.getElementById("quizBox");
  const resultBox = document.getElementById("quizResult");
  const scoreText = document.getElementById("quizScoreText");
  const msg = document.getElementById("quizFeedbackMessage");

  quizBox.classList.add("hidden");
  resultBox.classList.remove("hidden");

  scoreText.textContent = `Tu resultado: ${score} / ${QUIZ_QUESTIONS.length}`;

  if (score === QUIZ_QUESTIONS.length) {
    msg.textContent = "¡Perfecto! Tienes un dominio completo sobre cableado de redes y estándares TIA.";
  } else if (score >= 3) {
    msg.textContent = "¡Buen trabajo! Tienes bases sólidas, pero puedes repasar algunas secciones.";
  } else {
    msg.textContent = "Te sugerimos repasar la guía e intentarlo de nuevo para afianzar conceptos.";
  }
}

function resetQuiz() {
  for (let key in userAnswers) delete userAnswers[key];
  document.getElementById("quizResult").classList.add("hidden");
  document.getElementById("quizBox").classList.remove("hidden");
  
  const buttons = document.querySelectorAll(".option-btn");
  buttons.forEach(b => b.classList.remove("selected"));
}

/* ==========================================================================
   6. CONFIGURACIÓN E INTEGRACIÓN CON GOOGLE FORMS
   ========================================================================== */
function initGoogleForms() {
  const openExamBtn = document.getElementById("openExamBtn");
  const viewResultsBtn = document.getElementById("viewResultsBtn");
  const iframeContainer = document.getElementById("iframeContainer");


  // Mostrar u ocultar botón de resultados según la variable
  if (GOOGLE_RESULTS_URL && GOOGLE_RESULTS_URL.trim() !== "" && !GOOGLE_RESULTS_URL.includes("PEGAR_AQUI")) {
    viewResultsBtn.href = GOOGLE_RESULTS_URL;
    viewResultsBtn.classList.remove("hidden");
  }

  // Si existe una URL de formulario válida, incrustarla opcionalmente en un iframe
  if (GOOGLE_FORM_URL && GOOGLE_FORM_URL.includes("docs.google.com/forms")) {
    iframeContainer.classList.remove("hidden");
    iframeContainer.innerHTML = `
      <!-- Opción Formulario Incrustado -->
      <iframe src="${GOOGLE_FORM_URL}" title="Formulario de Examen Final">Cargando formulario...</iframe>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 7. LÓGICA DEL ACCORDION / GLOSARIO
  // ==========================================
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  if (accordionHeaders.length > 0) {
    accordionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const currentItem = header.parentElement;
        if (currentItem) {
          currentItem.classList.toggle('active');
        }
      });
    });
  }

  // ==========================================
  // 2. LÓGICA DEL FORMULARIO DE CONTACTO
  // ==========================================
  const formulario = document.getElementById('contactForm');

  if (formulario) {
    formulario.addEventListener('submit', function(e) {
      e.preventDefault(); // Evita recargar la página

      // ⚠️ REEMPLAZA CON TU URL DE GOOGLE APPS SCRIPT
      const scriptURL = 'AQUÍ_PEGA_TU_URL_DE_APPS_SCRIPT'; 

      const btn = formulario.querySelector('button[type="submit"]');
      const estado = document.getElementById('formStatus');

      // Deshabilitar botón temporalmente mientras envía
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
      }

      // Obtener valores con los IDs de tu HTML
      const datos = {
        nombreCompleto: document.getElementById('fullName') ? document.getElementById('fullName').value : '',
        correo: document.getElementById('email') ? document.getElementById('email').value : '',
        asunto: document.getElementById('subject') ? document.getElementById('subject').value : '',
        mensaje: document.getElementById('message') ? document.getElementById('message').value : ''
      };

      // Enviar datos a Google Apps Script
      fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      })
      .then(() => {
        if (estado) {
          estado.style.display = 'block';
          estado.style.color = '#4caf50'; // Verde
          estado.innerText = '¡Tu mensaje ha sido enviado correctamente!';
        }
        formulario.reset(); // Limpia los campos
      })
      .catch(error => {
        if (estado) {
          estado.style.display = 'block';
          estado.style.color = '#f44336'; // Rojo
          estado.innerText = 'Hubo un error al enviar el mensaje. Inténtalo de nuevo.';
        }
        console.error('Error al enviar:', error);
      })
      .finally(() => {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar Mensaje';
        }
      });
    });
  }

});

/* ==========================================================================
   8. VALIDACIÓN DEL FORMULARIO DE CONTACTO
   ========================================================================== */
   document.addEventListener('DOMContentLoaded', function() {
  
  // Capturamos tu formulario por su id real: 'contactForm'
  const formulario = document.getElementById('contactForm');

  if (formulario) {
    formulario.addEventListener('submit', function(e) {
      e.preventDefault(); // Evita recargar la página

      // ⚠️ REEMPLAZA ESTA URL CON LA TUYA DE GOOGLE APPS SCRIPT
      const scriptURL = 'https://script.google.com/macros/s/AKfycbwyIag54X2yY3AwZHvyRH_V4rxwexCkldNHojTskLP1Ig_t2KQx-ikv4WAUyO_yrKhckA/exec'; 

      const btn = formulario.querySelector('button[type="submit"]');
      const estado = document.getElementById('formStatus');

      // Deshabilitar botón temporalmente mientras envía
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
      }

      // Obtener los valores con los IDs reales de tu HTML
      const datos = {
        nombreCompleto: document.getElementById('fullName').value,
        correo: document.getElementById('email').value,
        asunto: document.getElementById('subject').value,
        mensaje: document.getElementById('message').value
      };

      // Enviar datos a Google Apps Script en segundo plano
      fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      })
      .then(() => {
        if (estado) {
          estado.style.display = 'block';
          estado.style.color = '#4caf50'; // Verde de éxito
          estado.innerText = '¡Tu mensaje ha sido enviado correctamente!';
        }
        formulario.reset(); // Limpia los campos del formulario
      })
      .catch(error => {
        if (estado) {
          estado.style.display = 'block';
          estado.style.color = '#f44336'; // Rojo de error
          estado.innerText = 'Hubo un error al enviar el mensaje. Inténtalo de nuevo.';
        }
        console.error('Error al enviar:', error);
      })
      .finally(() => {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar Mensaje';
        }
      });
    });
  }
});

function initContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    const name = document.getElementById("fullName");
    const email = document.getElementById("email");
    const message = document.getElementById("message");

    // Reset mensajes de error
    document.querySelectorAll(".error-msg").forEach(e => e.style.display = "none");

    if (!name.value.trim()) {
      document.getElementById("nameError").style.display = "block";
      valid = false;
    }

    if (!email.value.trim() || !validateEmail(email.value)) {
      document.getElementById("emailError").style.display = "block";
      valid = false;
    }

    if (!message.value.trim()) {
      document.getElementById("messageError").style.display = "block";
      valid = false;
    }

    if (valid) {
      status.style.color = "var(--accent-green)";
      status.textContent = "✓ Mensaje de prueba listo. (Este formulario es demostrativo sin backend conectado).";
      form.reset();
    }
  });
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}