// Initialize Lucide icons
const lucide = window.lucide;
lucide.createIcons();

// ============================================================
//  Custom Cursor
// ============================================================
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

if (cursorDot && cursorRing && window.innerWidth > 768) {
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX - 3 + 'px';
    cursorDot.style.top = mouseY - 3 + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = ringX - 18 + 'px';
    cursorRing.style.top = ringY - 18 + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverTargets = 'a, button, .project-card, .expertise-card, .contact-link, .skill-category, .competency-item, input, textarea';

  function refreshCursorListeners() {
    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
    });
  }
  refreshCursorListeners();
  window._refreshCursorListeners = refreshCursorListeners;
}

// ============================================================
//  Navigation
// ============================================================
const navButtons = document.querySelectorAll('[data-section]');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
let activeSection = 'hero';

function updateActiveNav() {
  const sections = ['hero', 'about', 'skills', 'experience', 'projects', 'timeline', 'contact'];
  const scrollPosition = window.scrollY + 120;

  for (const section of sections) {
    const element = document.getElementById(section);
    if (element) {
      const { offsetTop, offsetHeight } = element;
      if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
        activeSection = section;
        break;
      }
    }
  }

  navButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === activeSection);
  });
}

navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const section = document.getElementById(btn.dataset.section);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      mobileMenu.classList.add('hidden');
    }
  });
});

mobileMenuBtn?.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

// Smooth scroll buttons
document.querySelectorAll('[data-scroll]').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.scroll);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ============================================================
//  Theme Toggle
// ============================================================
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = themeToggle.querySelector('.sun-icon');
const moonIcon = themeToggle.querySelector('.moon-icon');

function setTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark');
    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');
  } else {
    document.body.classList.remove('dark');
    sunIcon.classList.remove('hidden');
    moonIcon.classList.add('hidden');
  }
  localStorage.setItem('theme', theme);
}

const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = document.body.classList.contains('dark') ? 'dark' : 'light';
  setTheme(current === 'dark' ? 'light' : 'dark');
  lucide.createIcons();
});

// ============================================================
//  Typing Animation (disabled — hero redesigned)
// ============================================================


// ============================================================
//  3D Hero Scene (Three.js)
// ============================================================
const canvas = document.getElementById('particle-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
camera.position.z = 30;

// Mouse tracking for 3D interaction
let mouse3D = { x: 0, y: 0, targetX: 0, targetY: 0 };
document.addEventListener('mousemove', (e) => {
  mouse3D.targetX = (e.clientX / window.innerWidth) * 2 - 1;
  mouse3D.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Floating wireframe geometries
const geometries = [];
const geoConfigs = [
  { geo: new THREE.IcosahedronGeometry(4, 1), pos: [-12, 6, -8], color: 0x00d4f5, speed: 0.003 },
  { geo: new THREE.OctahedronGeometry(3, 0), pos: [14, -4, -12], color: 0xa855f7, speed: 0.004 },
  { geo: new THREE.TorusGeometry(3, 0.8, 8, 16), pos: [-8, -8, -6], color: 0xec4899, speed: 0.002 },
  { geo: new THREE.DodecahedronGeometry(2.5, 0), pos: [10, 8, -10], color: 0x34d399, speed: 0.005 },
  { geo: new THREE.TetrahedronGeometry(3, 0), pos: [0, -12, -14], color: 0x00d4f5, speed: 0.003 },
  { geo: new THREE.IcosahedronGeometry(2, 0), pos: [-16, 0, -16], color: 0xa855f7, speed: 0.004 },
];

geoConfigs.forEach(config => {
  const material = new THREE.MeshBasicMaterial({
    color: config.color,
    wireframe: true,
    transparent: true,
    opacity: 0.25,
  });
  const mesh = new THREE.Mesh(config.geo, material);
  mesh.position.set(...config.pos);
  mesh.userData = {
    speed: config.speed,
    originalPos: [...config.pos],
    floatOffset: Math.random() * Math.PI * 2,
  };
  scene.add(mesh);
  geometries.push(mesh);
});

// 3D Particle field
const particleCount = 300;
const particleGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 80;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

  const colorChoice = Math.random();
  if (colorChoice < 0.33) {
    colors[i * 3] = 0; colors[i * 3 + 1] = 0.83; colors[i * 3 + 2] = 0.96;
  } else if (colorChoice < 0.66) {
    colors[i * 3] = 0.66; colors[i * 3 + 1] = 0.33; colors[i * 3 + 2] = 0.97;
  } else {
    colors[i * 3] = 0.93; colors[i * 3 + 1] = 0.28; colors[i * 3 + 2] = 0.6;
  }
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particleMaterial = new THREE.PointsMaterial({
  size: 0.12,
  vertexColors: true,
  transparent: true,
  opacity: 0.6,
  blending: THREE.AdditiveBlending,
});

const particleField = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particleField);

// Connection lines between nearby particles
const linesMaterial = new THREE.LineBasicMaterial({
  color: 0x00d4f5,
  transparent: true,
  opacity: 0.06,
  blending: THREE.AdditiveBlending,
});

// Animation loop
const clock = new THREE.Clock();

function animate3D() {
  requestAnimationFrame(animate3D);
  const elapsed = clock.getElapsedTime();

  // Smooth mouse follow
  mouse3D.x += (mouse3D.targetX - mouse3D.x) * 0.05;
  mouse3D.y += (mouse3D.targetY - mouse3D.y) * 0.05;

  // Rotate and float geometries
  geometries.forEach(mesh => {
    mesh.rotation.x += mesh.userData.speed;
    mesh.rotation.y += mesh.userData.speed * 0.7;
    mesh.rotation.z += mesh.userData.speed * 0.3;

    const floatY = Math.sin(elapsed * 0.5 + mesh.userData.floatOffset) * 1.5;
    const floatX = Math.cos(elapsed * 0.3 + mesh.userData.floatOffset) * 0.8;
    mesh.position.y = mesh.userData.originalPos[1] + floatY;
    mesh.position.x = mesh.userData.originalPos[0] + floatX;
  });

  // Rotate particle field
  particleField.rotation.y = elapsed * 0.02;
  particleField.rotation.x = elapsed * 0.01;

  // Camera follows mouse
  camera.position.x += (mouse3D.x * 3 - camera.position.x) * 0.02;
  camera.position.y += (mouse3D.y * 2 - camera.position.y) * 0.02;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

animate3D();

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ============================================================
//  3D Tilt Effect on Cards
// ============================================================
function init3DTilt() {
  const tiltCards = document.querySelectorAll(
    '.project-card, .skill-category, .experience-card, .achievement-card, .expertise-card, .contact-link, .timeline-content'
  );

  tiltCards.forEach(card => {
    card.style.transformStyle = 'preserve-3d';
    card.style.willChange = 'transform';

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
}

// Init tilt after content loads
setTimeout(init3DTilt, 200);
// Re-init after dynamic content renders
const _origRenderProjects = typeof renderProjects !== 'undefined' ? renderProjects : null;

// ============================================================
//  Skills Data (from Resume)
// ============================================================
const skillCategories = [
  {
    name: 'Programming',
    icon: 'code-2',
    skills: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C'],
  },
  {
    name: 'Frontend',
    icon: 'layout-dashboard',
    skills: ['React', 'Next.js', 'HTML', 'CSS', 'Tailwind CSS'],
  },
  {
    name: 'Backend',
    icon: 'server',
    skills: ['FastAPI', 'Flask', 'REST APIs', 'Node.js'],
  },
  {
    name: 'Databases',
    icon: 'database',
    skills: ['PostgreSQL', 'MongoDB', 'Redis', 'ChromaDB', 'FAISS'],
  },
  {
    name: 'Machine Learning',
    icon: 'brain',
    skills: ['PyTorch', 'TensorFlow', 'Scikit-Learn', 'OpenCV', 'Hugging Face', 'YOLO'],
  },
  {
    name: 'Tools',
    icon: 'wrench',
    skills: ['Git', 'GitHub', 'Streamlit'],
  },
];

const skillsGrid = document.getElementById('skills-grid');

skillCategories.forEach(category => {
  const categoryDiv = document.createElement('div');
  categoryDiv.className = 'skill-category reveal-on-scroll';

  categoryDiv.innerHTML = `
    <div class="skill-header">
      <i data-lucide="${category.icon}"></i>
      <h3>${category.name}</h3>
    </div>
    <div class="skill-tags">
      ${category.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
    </div>
  `;

  skillsGrid.appendChild(categoryDiv);
});

lucide.createIcons();

// ============================================================
//  Projects Data
// ============================================================
const projects = [
  {
    id: 1,
    title: 'PersonalOS Agent',
    subtitle: 'Autonomous Multi-Agent System',
    description:
      'Autonomous multi-agent AI system (Observer · Planner · Executor) for Gmail, Calendar, and filesystem automation using Redis queues, MCP protocol, LLM-powered planning, ChromaDB vector memory, WebSocket approval dashboard, and Twilio voice approvals.',
    metrics: 'Multi-Agent | WebSocket Dashboard | Voice Approval',
    tech: ['Python', 'FastAPI', 'Redis', 'OpenRouter', 'ChromaDB', 'Twilio'],
    github: 'https://github.com/Vikas-M-L/MCP',
    demo: '#',
    category: 'AI/ML',
    color: 'linear-gradient(135deg, #00d4f5, #a855f7)',
    badge: '🏆 SOLARIS X Hackathon 2026',
  },
  {
    id: 2,
    title: 'Pneumonia Detection System',
    subtitle: 'DenseNet121 + CBAM Chest X-Ray Classifier',
    description:
      'DenseNet121 + CBAM attention model achieving 0.97 AUROC and 91.4% accuracy on chest X-rays. Features patient-grouped 5-Fold CV with Focal Loss, 5-view Test-Time Augmentation, and a Streamlit dashboard with Grad-CAM++ heatmaps.',
    metrics: '0.97 AUROC | 91.4% Accuracy | 0.93 F1-Score',
    tech: ['Python', 'TensorFlow', 'DenseNet121', 'CBAM', 'Streamlit', 'Grad-CAM++'],
    github: '#',
    demo: '#',
    category: 'AI/ML',
    color: 'linear-gradient(135deg, #ec4899, #a855f7)',
    badge: null,
  },
  {
    id: 3,
    title: 'Rosetta 🪨',
    subtitle: 'AI Tutor with Misconception Engine',
    description:
      'Full-stack AI tutor that translates concepts into a student\'s interest domain, diagnoses the root cause behind every wrong answer via a 2-layer misconception engine (rules + Groq LLM), and adapts lesson modality in real time. Features Prism Mode with voice, sketch & notes evaluated by Gemini 2.0 Flash.',
    metrics: '2-Layer Misconception Engine | Adaptive Modality | Prism Mode',
    tech: ['Next.js', 'TypeScript', 'Prisma', 'OpenRouter', 'Groq', 'Gemini'],
    github: 'https://github.com/Vivekma05/CtrlAltDefeat',
    demo: 'https://ctrl-alt-defeat-ihdnadgvk-vivekma23cse-2469s-projects.vercel.app/',
    category: 'Full-Stack',
    color: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    badge: '🏆 Hackathon Project',
  },
  {
    id: 4,
    title: 'SafeRoute Mobile App 📱',
    subtitle: 'AI-Powered Safety Navigation',
    description:
      'AI-powered safety navigation PWA/Android app routing users along the safest path using a custom A* algorithm and XGBoost model trained on crime data, street lighting, and time of day. Features emergency protocol with Twilio/Gmail alerts and safety POI overlay.',
    metrics: 'Custom A* Algorithm | XGBoost Safety Scoring | Emergency Protocol',
    tech: ['XGBoost', 'Leaflet.js', 'Ionic Capacitor', 'Twilio', 'A* Algorithm'],
    github: 'https://github.com/Vivekma05/safest_path_app',
    demo: '#',
    category: 'AI/ML',
    color: 'linear-gradient(135deg, #34d399, #00d4f5)',
    badge: null,
  },
  {
    id: 5,
    title: 'Crypto Tracker Dashboard',
    subtitle: 'Real-Time Cryptocurrency Analytics',
    description:
      'Real-time cryptocurrency tracking dashboard with live price feeds, interactive charts, portfolio management, and market analysis powered by WebSocket streaming and the CoinGecko API.',
    metrics: 'Live Price Feeds | Interactive Charts | Portfolio Tracking',
    tech: ['React', 'WebSocket', 'Chart.js', 'CoinGecko API', 'Node.js'],
    github: 'https://github.com/Vivekma05/Crypto-Tracker-Dashboard',
    demo: '#',
    category: 'Full-Stack',
    color: 'linear-gradient(135deg, #fbbf24, #f97316)',
    badge: null,
  },
  {
    id: 6,
    title: 'HierAttn-NameNet',
    subtitle: 'Indian State Region Identification from Names',
    description:
      'Hierarchical multi-task deep learning NLP model using Transformer attention and BiLSTM to predict Indian state of origin from personal names. Features Ancestor Influence Attention, Masked Language Modeling pretraining on 150K names, and Integrated Gradients interpretability.',
    metrics: 'Transformer + BiLSTM | 150K Name Pretraining | Captum Interpretability',
    tech: ['Python', 'PyTorch', 'Transformers', 'BiLSTM', 'Hugging Face', 'Captum'],
    github: '#',
    demo: '#',
    category: 'AI/ML',
    color: 'linear-gradient(135deg, #4d7cff, #00d4f5)',
    badge: '🔬 Ongoing Research',
  },
  {
    id: 7,
    title: 'ISL Translator',
    subtitle: 'Real-time Sign Language Recognition',
    description:
      'AI-powered system that translates Indian Sign Language to text using computer vision and deep learning. Received Special Recognition at Mini Project Exhibition, Dept. of CSE.',
    metrics: 'Real-time Processing | Special Recognition Award',
    tech: ['MediaPipe', 'TensorFlow', 'OpenCV', 'Python'],
    github: '#',
    demo: '#',
    category: 'AI/ML',
    color: 'linear-gradient(135deg, #a855f7, #ec4899)',
    badge: '🏅 Special Recognition',
  },
];

const categories = [...new Set(projects.map(p => p.category))];
let selectedCategory = null;

const projectFilters = document.getElementById('project-filters');
const projectsGrid = document.getElementById('projects-grid');

// Create filters
const allBtn = document.createElement('button');
allBtn.className = 'filter-btn active';
allBtn.textContent = 'All';
allBtn.addEventListener('click', () => filterProjects(null));
projectFilters.appendChild(allBtn);

categories.forEach(cat => {
  const btn = document.createElement('button');
  btn.className = 'filter-btn';
  btn.textContent = cat;
  btn.addEventListener('click', () => filterProjects(cat));
  projectFilters.appendChild(btn);
});

function filterProjects(category) {
  selectedCategory = category;

  document.querySelectorAll('.filter-btn').forEach(btn => {
    if ((category === null && btn.textContent === 'All') || btn.textContent === category) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderProjects();
}

function renderProjects() {
  const filteredProjects = selectedCategory
    ? projects.filter(p => p.category === selectedCategory)
    : projects;

  projectsGrid.innerHTML = filteredProjects
    .map(project => `
    <div class="project-card">
      <div class="project-top-line" style="background: ${project.color}"></div>
      <div class="project-card-inner">
        <div class="project-header">
          <div class="project-header-top">
            <div class="project-category">${project.category}</div>
            ${project.badge ? `<div class="project-badge hackathon">${project.badge}</div>` : ''}
          </div>
          <h3 class="project-title">${project.title}</h3>
          <p class="project-subtitle">${project.subtitle}</p>
        </div>
        <div class="project-metrics">
          <p>${project.metrics}</p>
        </div>
        <p class="project-description">${project.description}</p>
        <div class="project-tech">
          ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
        <div class="project-links">
          <a href="${project.github}" ${project.github !== '#' ? 'target="_blank"' : ''} class="project-link">
            <i data-lucide="github"></i>
            <span>Code</span>
          </a>
          <a href="${project.demo}" ${project.demo !== '#' ? 'target="_blank"' : ''} class="project-link primary">
            <i data-lucide="arrow-up-right"></i>
            <span>Demo</span>
          </a>
        </div>
      </div>
    </div>
  `).join('');

  lucide.createIcons();

  if (typeof window._refreshCursorListeners === 'function') window._refreshCursorListeners();
  if (typeof init3DTilt === 'function') init3DTilt();
}

renderProjects();

// ============================================================
//  Timeline Data (from Resume)
// ============================================================
const timelineEvents = [
  {
    year: '2023',
    type: 'Education',
    title: '📚 Started B.E in CSE',
    description: 'Cambridge Institute of Technology, Bangalore — CGPA: 9.38/10',
  },
  {
    year: '2025',
    type: 'Experience',
    title: '🏢 Samsung PRISM Research Collaborator',
    description: 'Built Attend Ease, a web portal to digitize lab attendance, auto-calculate pro-rata salaries, and generate auditable monthly billing reports — Samsung R&D Institute India, Bangalore.',
  },
  {
    year: '2025',
    type: 'Project',
    title: '📱 SafeRoute Mobile App',
    description: 'AI-powered safety navigation with custom A* routing and XGBoost scoring for safest path.',
  },
  {
    year: '2026',
    type: 'Project',
    title: '🧬 Pneumonia Detection System',
    description: 'DenseNet121 + CBAM achieving 0.97 AUROC on chest X-ray classification with Grad-CAM++ explainability.',
  },
  {
    year: '2026',
    type: 'Hackathon',
    title: '🚀 SOLARIS X Hackathon — PersonalOS Agent',
    description: 'Built autonomous multi-agent system with WebSocket dashboard & Twilio voice approval.',
  },
  {
    year: '2026',
    type: 'Research',
    title: '🔬 HierAttn-NameNet — Ongoing Research',
    description: 'Hierarchical deep learning NLP model for Indian state identification from personal names using Transformers + BiLSTM.',
  },
  {
    year: '2027',
    type: 'Goal',
    title: '⭐ B.E Graduation & ML Engineer Role',
    description: 'Completing B.E in Computer Science & Engineering and transitioning to a professional ML Engineer / AI Systems Developer role.',
  },
];

const timelineEventsContainer = document.getElementById('timeline-events');

timelineEvents.forEach(event => {
  const eventDiv = document.createElement('div');
  eventDiv.className = 'timeline-event reveal-on-scroll';

  eventDiv.innerHTML = `
    <div class="timeline-dot"></div>
    <div class="timeline-content">
      <div class="timeline-meta">
        <span class="timeline-year">${event.year}</span>
        <span class="timeline-type">${event.type}</span>
      </div>
      <h4 class="timeline-title">${event.title}</h4>
      <p class="timeline-description">${event.description}</p>
    </div>
  `;

  timelineEventsContainer.appendChild(eventDiv);
});

lucide.createIcons();

// ============================================================
//  Contact Form
// ============================================================
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get('name').trim();
  const email = formData.get('email').trim();
  const subject = formData.get('subject')?.trim() || `Portfolio Contact from ${name}`;
  const message = formData.get('message').trim();

  if (!name || !email || !message) {
    formStatus.textContent = '✗ Please fill all required fields';
    formStatus.className = 'form-status error';
    formStatus.classList.remove('hidden');
    setTimeout(() => formStatus.classList.add('hidden'), 3000);
    return;
  }

  // Show loading state
  const submitBtn = contactForm.querySelector('.btn-submit');
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<span>Sending...</span>';
  submitBtn.disabled = true;

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: 'service_b3tfmpe',
        template_id: 'template_a0amy0r',
        user_id: 'FFl8in16VA08VkJ0L',
        template_params: {
          name: name,
          email: email,
          subject: subject,
          message: message,
        },
      }),
    });

    if (response.ok) {
      formStatus.textContent = '✓ Message sent successfully!';
      formStatus.className = 'form-status success';
      contactForm.reset();
    } else {
      const errorText = await response.text();
      console.error('EmailJS Error:', errorText);
      formStatus.textContent = '✗ Failed to send. Please try again.';
      formStatus.className = 'form-status error';
    }
  } catch (error) {
    console.error('Network Error:', error);
    formStatus.textContent = '✗ Network error. Please try again.';
    formStatus.className = 'form-status error';
  }

  submitBtn.innerHTML = originalBtnText;
  submitBtn.disabled = false;
  formStatus.classList.remove('hidden');
  setTimeout(() => formStatus.classList.add('hidden'), 4000);
});

// ============================================================
//  Scroll Reveal Animation
// ============================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.05,
  rootMargin: '0px 0px -50px 0px'
});

function initReveal() {
  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    revealObserver.observe(el);
  });
}

setTimeout(initReveal, 100);
