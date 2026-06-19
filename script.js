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
  const sections = ['hero', 'about', 'skills', 'projects', 'timeline', 'contact'];
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
//  Typing Animation
// ============================================================
const typingSkills = ['Python', 'PyTorch', 'TensorFlow', 'FastAPI', 'LangChain', 'Deep Learning', 'NLP', 'Computer Vision'];
let currentSkillIndex = 0;
let displayText = '';
let isDeleting = false;
const typingElement = document.getElementById('typing-text');

function typeEffect() {
  const skill = typingSkills[currentSkillIndex];

  if (!isDeleting) {
    if (displayText.length < skill.length) {
      displayText = skill.substring(0, displayText.length + 1);
      typingElement.textContent = displayText;
      setTimeout(typeEffect, 120);
    } else {
      setTimeout(() => { isDeleting = true; typeEffect(); }, 1800);
    }
  } else {
    if (displayText.length > 0) {
      displayText = skill.substring(0, displayText.length - 1);
      typingElement.textContent = displayText;
      setTimeout(typeEffect, 60);
    } else {
      isDeleting = false;
      currentSkillIndex = (currentSkillIndex + 1) % typingSkills.length;
      setTimeout(typeEffect, 200);
    }
  }
}

typeEffect();

// ============================================================
//  Particle Canvas
// ============================================================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = [];
const particleCount = Math.min(70, Math.floor(window.innerWidth / 20));

for (let i = 0; i < particleCount; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 1.2,
    vy: (Math.random() - 0.5) * 1.2,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.3 + 0.05,
    hue: 180 + Math.random() * 60,
  });
}

let mouseParticle = { x: -9999, y: -9999 };
document.addEventListener('mousemove', (e) => {
  mouseParticle.x = e.clientX;
  mouseParticle.y = e.clientY;
});

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(particle => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.opacity += (Math.random() - 0.5) * 0.01;

    if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
    if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
    particle.opacity = Math.max(0.05, Math.min(0.4, particle.opacity));

    const dx = mouseParticle.x - particle.x;
    const dy = mouseParticle.y - particle.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 150) {
      const force = (150 - dist) / 150;
      particle.x -= dx * force * 0.02;
      particle.y -= dy * force * 0.02;
    }

    ctx.fillStyle = `hsla(${particle.hue}, 100%, 65%, ${particle.opacity})`;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();

    particles.forEach(other => {
      const ddx = particle.x - other.x;
      const ddy = particle.y - other.y;
      const distance = Math.sqrt(ddx * ddx + ddy * ddy);

      if (distance < 160) {
        const lineOpacity = 0.08 * (1 - distance / 160);
        ctx.strokeStyle = `hsla(${particle.hue}, 100%, 65%, ${lineOpacity})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
    });
  });

  requestAnimationFrame(animateParticles);
}

animateParticles();

// ============================================================
//  Skills Data (from Resume)
// ============================================================
const skillCategories = [
  {
    name: 'Languages',
    skills: [
      { name: 'Python', level: 95 },
      { name: 'JavaScript', level: 85 },
      { name: 'Java', level: 80 },
      { name: 'C', level: 78 },
    ],
  },
  {
    name: 'Machine Learning',
    skills: [
      { name: 'Deep Learning', level: 93 },
      { name: 'CNNs & Transformers', level: 91 },
      { name: 'NLP', level: 88 },
      { name: 'Computer Vision', level: 90 },
    ],
  },
  {
    name: 'ML Libraries & Tools',
    skills: [
      { name: 'PyTorch', level: 92 },
      { name: 'TensorFlow', level: 90 },
      { name: 'Scikit-learn', level: 88 },
      { name: 'LangChain', level: 85 },
    ],
  },
  {
    name: 'ML Tools & Platforms',
    skills: [
      { name: 'Hugging Face', level: 86 },
      { name: 'OpenCV / MediaPipe', level: 88 },
      { name: 'Streamlit', level: 87 },
      { name: 'NumPy / Pandas', level: 92 },
    ],
  },
  {
    name: 'Web & Backend',
    skills: [
      { name: 'FastAPI', level: 88 },
      { name: 'HTML / CSS', level: 85 },
      { name: 'REST APIs', level: 87 },
      { name: 'React / Next.js', level: 82 },
    ],
  },
  {
    name: 'Databases & DevOps',
    skills: [
      { name: 'PostgreSQL / MongoDB', level: 85 },
      { name: 'Redis / ChromaDB / FAISS', level: 83 },
      { name: 'Docker', level: 80 },
      { name: 'Git / GitHub / Linux', level: 90 },
    ],
  },
];

const skillsGrid = document.getElementById('skills-grid');

skillCategories.forEach(category => {
  const categoryDiv = document.createElement('div');
  categoryDiv.className = 'skill-category reveal-on-scroll';

  categoryDiv.innerHTML = `
    <div class="skill-header">
      <i data-lucide="zap"></i>
      <h3>${category.name}</h3>
    </div>
    <div class="skill-list">
      ${category.skills.map(skill => `
        <div class="skill-item">
          <div class="skill-info">
            <span class="skill-name">${skill.name}</span>
            <span class="skill-percent">${skill.level}%</span>
          </div>
          <div class="skill-bar">
            <div class="skill-progress" data-level="${skill.level}" style="width: 0%"></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  skillsGrid.appendChild(categoryDiv);
});

lucide.createIcons();

// Animate skill bars on scroll
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const progressBars = entry.target.querySelectorAll('.skill-progress');
      progressBars.forEach((bar, index) => {
        setTimeout(() => {
          bar.style.width = bar.dataset.level + '%';
        }, index * 120);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

skillObserver.observe(document.getElementById('skills'));

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

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  if (!name || !email || !message) {
    formStatus.textContent = '✗ Please fill all fields';
    formStatus.className = 'form-status error';
    formStatus.classList.remove('hidden');
    setTimeout(() => formStatus.classList.add('hidden'), 3000);
    return;
  }

  formStatus.textContent = '✓ Message sent successfully!';
  formStatus.className = 'form-status success';
  formStatus.classList.remove('hidden');
  contactForm.reset();

  setTimeout(() => formStatus.classList.add('hidden'), 3000);
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
