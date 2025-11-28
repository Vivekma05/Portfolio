// Initialize Lucide icons
const lucide = window.lucide // Declare the lucide variable
lucide.createIcons()

// Navigation
const navButtons = document.querySelectorAll("[data-section]")
const mobileMenuBtn = document.getElementById("mobile-menu-btn")
const mobileMenu = document.getElementById("mobile-menu")
let activeSection = "hero"

function updateActiveNav() {
  const sections = ["hero", "about", "skills", "projects", "timeline", "blog", "contact"]
  const scrollPosition = window.scrollY + 100

  for (const section of sections) {
    const element = document.getElementById(section)
    if (element) {
      const { offsetTop, offsetHeight } = element
      if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
        activeSection = section
        break
      }
    }
  }

  navButtons.forEach((btn) => {
    if (btn.dataset.section === activeSection) {
      btn.classList.add("active")
    } else {
      btn.classList.remove("active")
    }
  })
}

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const section = document.getElementById(btn.dataset.section)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
      mobileMenu.classList.add("hidden")
    }
  })
})

mobileMenuBtn?.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden")
})

window.addEventListener("scroll", updateActiveNav)
updateActiveNav()

// Smooth scroll buttons
document.querySelectorAll("[data-scroll]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = document.getElementById(btn.dataset.scroll)
    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
    }
  })
})

// Theme Toggle
const themeToggle = document.getElementById("theme-toggle")
const sunIcon = themeToggle.querySelector(".sun-icon")
const moonIcon = themeToggle.querySelector(".moon-icon")

function setTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark")
    sunIcon.classList.add("hidden")
    moonIcon.classList.remove("hidden")
  } else {
    document.body.classList.remove("dark")
    sunIcon.classList.remove("hidden")
    moonIcon.classList.add("hidden")
  }
  localStorage.setItem("theme", theme)
}

const savedTheme = localStorage.getItem("theme") || "light"
setTheme(savedTheme)

themeToggle.addEventListener("click", () => {
  const currentTheme = document.body.classList.contains("dark") ? "dark" : "light"
  setTheme(currentTheme === "dark" ? "light" : "dark")
  lucide.createIcons()
})

// Typing Animation
const skills = ["Python", "React", "Node.js", "TensorFlow", "LLMs", "Docker"]
let currentSkillIndex = 0
let displayText = ""
let isDeleting = false
const typingElement = document.getElementById("typing-text")

function typeEffect() {
  const skill = skills[currentSkillIndex]

  if (!isDeleting) {
    if (displayText.length < skill.length) {
      displayText = skill.substring(0, displayText.length + 1)
      typingElement.textContent = displayText
      setTimeout(typeEffect, 150)
    } else {
      setTimeout(() => {
        isDeleting = true
        typeEffect()
      }, 1500)
    }
  } else {
    if (displayText.length > 0) {
      displayText = skill.substring(0, displayText.length - 1)
      typingElement.textContent = displayText
      setTimeout(typeEffect, 100)
    } else {
      isDeleting = false
      currentSkillIndex = (currentSkillIndex + 1) % skills.length
      setTimeout(typeEffect, 150)
    }
  }
}

typeEffect()

// Particle Canvas
const canvas = document.getElementById("particle-canvas")
const ctx = canvas.getContext("2d")

function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

resizeCanvas()
window.addEventListener("resize", resizeCanvas)

const particles = []

for (let i = 0; i < 60; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.4 + 0.1,
  })
}

function animateParticles() {
  ctx.fillStyle = "rgba(255, 255, 255, 0.03)"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  particles.forEach((particle) => {
    particle.x += particle.vx
    particle.y += particle.vy
    particle.opacity += (Math.random() - 0.5) * 0.015

    if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
    if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

    particle.opacity = Math.max(0.1, Math.min(0.5, particle.opacity))

    ctx.fillStyle = `hsla(190, 100%, 45%, ${particle.opacity})`
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    ctx.fill()

    particles.forEach((other) => {
      const dx = particle.x - other.x
      const dy = particle.y - other.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 200) {
        const lineOpacity = (0.15 * (1 - distance / 200) * (particle.opacity + other.opacity)) / 2
        ctx.strokeStyle = `hsla(190, 100%, 45%, ${lineOpacity})`
        ctx.lineWidth = 0.7
        ctx.beginPath()
        ctx.moveTo(particle.x, particle.y)
        ctx.lineTo(other.x, other.y)
        ctx.stroke()
      }
    })
  })

  requestAnimationFrame(animateParticles)
}

animateParticles()

// Skills Data
const skillCategories = [
  {
    name: "Languages",
    skills: [
      { name: "Python", level: 95 },
      { name: "JavaScript", level: 90 },
      { name: "TypeScript", level: 88 },
      { name: "SQL", level: 85 },
    ],
  },
  {
    name: "AI/ML",
    skills: [
      { name: "TensorFlow", level: 92 },
      { name: "PyTorch", level: 90 },
      { name: "MediaPipe", level: 88 },
      { name: "LangChain", level: 85 },
    ],
  },
  {
    name: "Frontend",
    skills: [
      { name: "React", level: 93 },
      { name: "Next.js", level: 91 },
      { name: "Tailwind CSS", level: 94 },
      { name: "Framer Motion", level: 87 },
    ],
  },
  {
    name: "Backend",
    skills: [
      { name: "Node.js", level: 92 },
      { name: "Express", level: 90 },
      { name: "MongoDB", level: 88 },
      { name: "PostgreSQL", level: 86 },
    ],
  },
  {
    name: "Tools & DevOps",
    skills: [
      { name: "Docker", level: 89 },
      { name: "Git", level: 95 },
      { name: "AWS", level: 82 },
      { name: "Linux", level: 88 },
    ],
  },
]

const skillsGrid = document.getElementById("skills-grid")

skillCategories.forEach((category) => {
  const categoryDiv = document.createElement("div")
  categoryDiv.className = "skill-category"

  categoryDiv.innerHTML = `
    <div class="skill-header">
      <i data-lucide="zap"></i>
      <h3>${category.name}</h3>
    </div>
    <div class="skill-list">
      ${category.skills
        .map(
          (skill) => `
        <div class="skill-item">
          <div class="skill-info">
            <span class="skill-name">${skill.name}</span>
            <span class="skill-percent">${skill.level}%</span>
          </div>
          <div class="skill-bar">
            <div class="skill-progress" data-level="${skill.level}" style="width: 0%"></div>
          </div>
        </div>
      `,
        )
        .join("")}
    </div>
  `

  skillsGrid.appendChild(categoryDiv)
})

lucide.createIcons()

// Animate skill bars on scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const progressBars = entry.target.querySelectorAll(".skill-progress")
        progressBars.forEach((bar, index) => {
          setTimeout(() => {
            bar.style.width = bar.dataset.level + "%"
          }, index * 100)
        })
        observer.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.1 },
)

observer.observe(document.getElementById("skills"))

// Projects Data
const projects = [
  {
    id: 1,
    title: "ISL Translator",
    subtitle: "Real-time Sign Language Recognition",
    description:
      "AI-powered system that translates Indian Sign Language to text using computer vision and deep learning. Achieved 95% accuracy on custom dataset.",
    metrics: "95% Accuracy | Real-time Processing",
    tech: ["MediaPipe", "TensorFlow", "OpenCV", "Python"],
    github: "#",
    demo: "#",
    category: "AI/ML",
    color: "linear-gradient(to right, #22d3ee, #3b82f6)",
  },
  {
    id: 2,
    title: "Stock Management System",
    subtitle: "Full-Stack Inventory Dashboard",
    description:
      "Comprehensive stock management application with real-time inventory tracking, predictive analytics, and automated reorder alerts.",
    metrics: "10K+ Daily Transactions | 99.9% Uptime",
    tech: ["MERN Stack", "Redux", "MongoDB", "Socket.io"],
    github: "#",
    demo: "#",
    category: "Full-Stack",
    color: "linear-gradient(to right, #c084fc, #ec4899)",
  },
  {
    id: 3,
    title: "WhatsApp AI Agent",
    subtitle: "LLM-Powered Conversational Bot",
    description:
      "Intelligent chatbot integrated with WhatsApp API, powered by LangChain and LLMs. Handles customer support, FAQs, and context-aware conversations.",
    metrics: "50+ Conversations/Day | Context Aware",
    tech: ["LangChain", "OpenAI", "WhatsApp API", "Node.js"],
    github: "#",
    demo: "#",
    category: "AI/ML",
    color: "linear-gradient(to right, #34d399, #14b8a6)",
  },
  {
    id: 4,
    title: "Real-Time Analytics Dashboard",
    subtitle: "Data Visualization Platform",
    description:
      "High-performance dashboard processing and visualizing real-time data streams with interactive charts and custom metrics.",
    metrics: "100K Events/Sec | <100ms Latency",
    tech: ["React", "Recharts", "WebSockets", "PostgreSQL"],
    github: "#",
    demo: "#",
    category: "Full-Stack",
    color: "linear-gradient(to right, #fb923c, #ef4444)",
  },
  {
    id: 5,
    title: "ML Model Deployment Pipeline",
    subtitle: "Automated CI/CD for AI Models",
    description:
      "End-to-end pipeline for training, validating, and deploying ML models with automated versioning and rollback capabilities.",
    metrics: "10-min Deploy Time | A/B Testing",
    tech: ["Docker", "Kubernetes", "MLflow", "Jenkins"],
    github: "#",
    demo: "#",
    category: "DevOps",
    color: "linear-gradient(to right, #818cf8, #a78bfa)",
  },
  {
    id: 6,
    title: "AI Document Analyzer",
    subtitle: "Intelligent PDF Processing",
    description:
      "Extracts, analyzes, and summarizes information from documents using OCR and NLP. Supports multi-language processing.",
    metrics: "98% OCR Accuracy | 5M+ Pages Processed",
    tech: ["Pytesseract", "NLTK", "Flask", "FastAPI"],
    github: "#",
    demo: "#",
    category: "AI/ML",
    color: "linear-gradient(to right, #60a5fa, #818cf8)",
  },
]

const categories = [...new Set(projects.map((p) => p.category))]
let selectedCategory = null

const projectFilters = document.getElementById("project-filters")
const projectsGrid = document.getElementById("projects-grid")

// Create filters
const allBtn = document.createElement("button")
allBtn.className = "filter-btn active"
allBtn.textContent = "All"
allBtn.addEventListener("click", () => filterProjects(null))
projectFilters.appendChild(allBtn)

categories.forEach((cat) => {
  const btn = document.createElement("button")
  btn.className = "filter-btn"
  btn.textContent = cat
  btn.addEventListener("click", () => filterProjects(cat))
  projectFilters.appendChild(btn)
})

function filterProjects(category) {
  selectedCategory = category

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    if ((category === null && btn.textContent === "All") || btn.textContent === category) {
      btn.classList.add("active")
    } else {
      btn.classList.remove("active")
    }
  })

  renderProjects()
}

function renderProjects() {
  const filteredProjects = selectedCategory ? projects.filter((p) => p.category === selectedCategory) : projects

  projectsGrid.innerHTML = filteredProjects
    .map(
      (project) => `
    <div class="project-card">
      <div class="project-top-line" style="background: ${project.color}"></div>
      <div class="project-header">
        <div class="project-header-top">
          <div class="project-category">${project.category}</div>
        </div>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-subtitle">${project.subtitle}</p>
      </div>
      <div class="project-metrics">
        <p>${project.metrics}</p>
      </div>
      <p class="project-description">${project.description}</p>
      <div class="project-tech">
        ${project.tech.map((tech) => `<span class="tech-tag">${tech}</span>`).join("")}
      </div>
      <div class="project-links">
        <a href="${project.github}" class="project-link">
          <i data-lucide="github"></i>
          <span>Code</span>
        </a>
        <a href="${project.demo}" class="project-link primary">
          <i data-lucide="arrow-up-right"></i>
          <span>Demo</span>
        </a>
      </div>
    </div>
  `,
    )
    .join("")

  lucide.createIcons()
}

renderProjects()

// Timeline Data
const timelineEvents = [
  {
    year: "2023",
    type: "Hackathon",
    title: "Won AI Hackathon 2023",
    description: "Developed ISL Translator using MediaPipe and TensorFlow",
    icon: "🏆",
  },
  {
    year: "2023",
    type: "Project",
    title: "Stock Management System",
    description: "Built full-stack inventory platform with MERN stack",
    icon: "📦",
  },
  {
    year: "2024",
    type: "Hackathon",
    title: "Top 10 - AI/ML Hackathon",
    description: "WhatsApp AI Agent for customer support automation",
    icon: "🚀",
  },
  {
    year: "2024",
    type: "Achievement",
    title: "Tech Lead - University Club",
    description: "Leading 50+ members in AI/ML and web development projects",
    icon: "👥",
  },
  {
    year: "2024",
    type: "Project",
    title: "Real-Time Analytics Dashboard",
    description: "Processing 100K events/sec with <100ms latency",
    icon: "📊",
  },
  {
    year: "2025",
    type: "Goal",
    title: "Full-Time AI/ML Engineer",
    description: "Transitioning to professional role in AI systems development",
    icon: "⭐",
  },
]

const timelineEventsContainer = document.getElementById("timeline-events")

timelineEvents.forEach((event) => {
  const eventDiv = document.createElement("div")
  eventDiv.className = "timeline-event"

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
  `

  timelineEventsContainer.appendChild(eventDiv)
})

// Blog Data
const blogPosts = [
  {
    id: 1,
    title: "Building Production-Ready ML Systems",
    excerpt:
      "A comprehensive guide to deploying machine learning models safely and efficiently in production environments.",
    date: "Dec 15, 2024",
    readTime: "8 min read",
    tags: ["ML", "DevOps", "Production"],
    slug: "#",
  },
  {
    id: 2,
    title: "Real-Time Data Processing at Scale",
    excerpt:
      "Exploring architectures for processing 100K+ events per second with sub-100ms latency using modern tools.",
    date: "Dec 10, 2024",
    readTime: "12 min read",
    tags: ["Backend", "Architecture", "Performance"],
    slug: "#",
  },
  {
    id: 3,
    title: "From TensorFlow to Production: A Complete Pipeline",
    excerpt: "Step-by-step walkthrough of building an ML model in TensorFlow and deploying it as a scalable API.",
    date: "Dec 5, 2024",
    readTime: "10 min read",
    tags: ["ML", "TensorFlow", "API"],
    slug: "#",
  },
]

const blogGrid = document.getElementById("blog-grid")

blogPosts.forEach((post) => {
  const postLink = document.createElement("a")
  postLink.href = post.slug
  postLink.className = "blog-card"

  postLink.innerHTML = `
    <div class="blog-tags">
      ${post.tags.map((tag) => `<span class="blog-tag">${tag}</span>`).join("")}
    </div>
    <h3 class="blog-title">${post.title}</h3>
    <p class="blog-excerpt">${post.excerpt}</p>
    <div class="blog-meta">
      <div class="blog-readtime">
        <i data-lucide="clock"></i>
        ${post.readTime}
      </div>
      <span>${post.date}</span>
    </div>
    <div class="blog-cta">
      <span>Read More</span>
      <i data-lucide="arrow-right"></i>
    </div>
  `

  blogGrid.appendChild(postLink)
})

lucide.createIcons()

// Contact Form
const contactForm = document.getElementById("contact-form")
const formStatus = document.getElementById("form-status")

contactForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const formData = new FormData(contactForm)
  const name = formData.get("name")
  const email = formData.get("email")
  const message = formData.get("message")

  if (!name || !email || !message) {
    formStatus.textContent = "✗ Please fill all fields"
    formStatus.className = "form-status error"
    formStatus.classList.remove("hidden")
    setTimeout(() => formStatus.classList.add("hidden"), 3000)
    return
  }

  // Simulate form submission
  formStatus.textContent = "✓ Message sent successfully!"
  formStatus.className = "form-status success"
  formStatus.classList.remove("hidden")
  contactForm.reset()

  setTimeout(() => formStatus.classList.add("hidden"), 3000)
})
