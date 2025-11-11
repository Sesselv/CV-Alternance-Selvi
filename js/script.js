// main.js - Animations et interactions avancées

class PortfolioApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initParticles();
    this.initCustomCursor();
    this.initScrollAnimations();
    this.initTypingAnimation();
    this.initCounterAnimations();
    this.initSmoothScroll();
    this.initNavigation();
    this.initFormValidation();
    this.initParallaxEffects();
    this.updateCurrentYear();
  }

  setupEventListeners() {
    window.addEventListener("load", () => {
      document.body.classList.add("loaded");
    });

    window.addEventListener(
      "resize",
      this.debounce(() => {
        this.handleResize();
      }, 100)
    );
  }

  // Système de particules Canvas
  initParticles() {
    const canvas = document.getElementById("particlesCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let particles = [];
    let mouse = { x: 0, y: 0 };

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.life = Math.random() * 100 + 50;
        this.maxLife = this.life;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;

        // Interaction avec la souris
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const force = (100 - distance) / 100;
          this.vx += dx * force * 0.001;
          this.vy += dy * force * 0.001;
        }

        // Bordures
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Fade out
        this.opacity = (this.life / this.maxLife) * 0.5;

        if (this.life <= 0) {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.life = this.maxLife;
          this.vx = (Math.random() - 0.5) * 0.5;
          this.vy = (Math.random() - 0.5) * 0.5;
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = getComputedStyle(document.documentElement)
          .getPropertyValue("--accent-primary")
          .trim();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(
        50,
        Math.floor((canvas.width * canvas.height) / 15000)
      );
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      // Connexions entre particules
      const accentColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent-primary")
        .trim();
      ctx.strokeStyle = accentColor
        .replace(")", ", 0.2)")
        .replace("rgb", "rgba");
      ctx.lineWidth = 1;

      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 80) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener("resize", () => {
      resizeCanvas();
      initParticles();
    });
  }

  // Curseur personnalisé
  initCustomCursor() {
    const cursorDot = document.querySelector("[data-cursor-dot]");
    const cursorOutline = document.querySelector("[data-cursor-outline]");

    if (!cursorDot || !cursorOutline) return;

    let mousePosition = { x: 0, y: 0 };
    let dotPosition = { x: 0, y: 0 };
    let outlinePosition = { x: 0, y: 0 };

    const updateCursor = (e) => {
      mousePosition.x = e.clientX;
      mousePosition.y = e.clientY;
    };

    const animateCursor = () => {
      // Dot suit immédiatement
      dotPosition.x = mousePosition.x;
      dotPosition.y = mousePosition.y;

      // Outline suit avec un délai
      outlinePosition.x += (mousePosition.x - outlinePosition.x) * 0.1;
      outlinePosition.y += (mousePosition.y - outlinePosition.y) * 0.1;

      cursorDot.style.left = `${dotPosition.x}px`;
      cursorDot.style.top = `${dotPosition.y}px`;
      cursorOutline.style.left = `${outlinePosition.x}px`;
      cursorOutline.style.top = `${outlinePosition.y}px`;

      requestAnimationFrame(animateCursor);
    };

    document.addEventListener("mousemove", updateCursor);
    document.addEventListener("mouseenter", () => {
      cursorDot.style.opacity = 1;
      cursorOutline.style.opacity = 1;
    });
    document.addEventListener("mouseleave", () => {
      cursorDot.style.opacity = 0;
      cursorOutline.style.opacity = 0;
    });

    // Effet hover sur les éléments interactifs
    const interactiveElements = document.querySelectorAll(
      "a, button, [data-cursor-hover]"
    );
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursorDot.style.transform = "translate(-50%, -50%) scale(2)";
        cursorOutline.style.transform = "translate(-50%, -50%) scale(1.5)";
      });
      el.addEventListener("mouseleave", () => {
        cursorDot.style.transform = "translate(-50%, -50%) scale(1)";
        cursorOutline.style.transform = "translate(-50%, -50%) scale(1)";
      });
    });

    animateCursor();
  }

  // Animations de scroll avec IntersectionObserver
  initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");

          // Animation en cascade pour les enfants
          const children = entry.target.querySelectorAll(
            ".reveal-delay-1, .reveal-delay-2, .reveal-delay-3"
          );
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add("revealed");
            }, index * 100);
          });
        }
      });
    }, observerOptions);

    // Observer tous les éléments avec la classe reveal
    document.querySelectorAll(".reveal").forEach((el) => {
      observer.observe(el);
    });

    // Auto-ajout de la classe reveal aux éléments de section
    document.querySelectorAll("section").forEach((section) => {
      const elements = section.querySelectorAll(
        "h2, h3, p, .project-card, .timeline-item, .skill-category"
      );
      elements.forEach((el, index) => {
        if (!el.classList.contains("reveal")) {
          el.classList.add("reveal");
          if (index > 0) {
            el.classList.add(`reveal-delay-${Math.min(index, 3)}`);
          }
          observer.observe(el);
        }
      });
    });
  }

  // Animation de frappe pour le titre
  initTypingAnimation() {
    const typingElement = document.querySelector(".typing-text");
    if (!typingElement) return;

    const text =
      typingElement.getAttribute("data-text") || typingElement.textContent;
    let index = 0;

    typingElement.textContent = "";

    const type = () => {
      if (index < text.length) {
        typingElement.textContent += text.charAt(index);
        index++;
        setTimeout(type, 100);
      } else {
        // Retire le curseur après un délai
        setTimeout(() => {
          typingElement.classList.add("typing-complete");
        }, 2000);
      }
    };

    // Démarre après un délai
    setTimeout(type, 1000);
  }

  // Animation des compteurs
  initCounterAnimations() {
    const counters = document.querySelectorAll("[data-count]");

    const animateCounter = (counter) => {
      const target = parseInt(counter.getAttribute("data-count"));
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        if (current < target) {
          current += step;
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      updateCounter();
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    });

    counters.forEach((counter) => {
      counterObserver.observe(counter);
    });
  }

  // Scroll fluide
  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }

  // Navigation
  initNavigation() {
    const nav = document.getElementById("mainNav");
    const navToggle = document.getElementById("navToggle");
    const navLinks = document.querySelectorAll(".nav-links a");

    // Scroll listener pour la navigation
    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 100) {
        nav.style.background = "rgba(17, 17, 24, 0.95)";
        nav.style.backdropFilter = "blur(20px)";
      } else {
        nav.style.background = "rgba(17, 17, 24, 0.8)";
        nav.style.backdropFilter = "blur(20px)";
      }

      // Auto-hide/show navigation
      if (currentScrollY > lastScrollY && currentScrollY > 500) {
        if (window.innerWidth > 768) {
          nav.style.transform = "translateX(-50%) translateY(-100%)";
        } else {
          nav.style.transform = "translateY(-100%)";
        }
      } else {
        if (window.innerWidth > 768) {
          nav.style.transform = "translateX(-50%) translateY(0)";
        } else {
          nav.style.transform = "translateY(0)";
        }
      }

      lastScrollY = currentScrollY;
    });

    // Active nav link highlighting
    const sections = document.querySelectorAll("section[id]");

    window.addEventListener("scroll", () => {
      let current = "";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 200;
        if (scrollY >= sectionTop) {
          current = section.getAttribute("id");
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href").slice(1) === current) {
          link.classList.add("active");
        }
      });
    });

    // Mobile navigation
    if (navToggle) {
      navToggle.addEventListener("click", () => {
        nav.classList.toggle("nav-open");
        document.body.classList.toggle("no-scroll");
      });
    }
  }

  // Validation de formulaire
  initFormValidation() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const submitBtn = form.querySelector(".btn-submit");
    const btnText = submitBtn.querySelector(".btn-text");
    const btnLoading = submitBtn.querySelector(".btn-loading");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Animation de loading
      submitBtn.classList.add("loading");

      // Simulation d'envoi (remplacer par vraie logique)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Reset
      submitBtn.classList.remove("loading");

      // Feedback de succès
      this.showNotification("Message envoyé avec succès !", "success");
      form.reset();
    });

    // Validation en temps réel
    const inputs = form.querySelectorAll("input, textarea, select");
    inputs.forEach((input) => {
      input.addEventListener("blur", () => {
        this.validateField(input);
      });
    });
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;

    // Règles de validation
    switch (field.type) {
      case "email":
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        break;
      case "text":
        isValid = value.length >= 2;
        break;
      default:
        isValid = value.length > 0;
    }

    // Feedback visuel
    if (isValid) {
      field.classList.remove("error");
      field.classList.add("valid");
    } else {
      field.classList.remove("valid");
      field.classList.add("error");
    }

    return isValid;
  }

  // Effets de parallax
  initParallaxEffects() {
    const parallaxElements = document.querySelectorAll("[data-parallax]");

    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;

      parallaxElements.forEach((element) => {
        const rate = scrolled * -0.5;
        element.style.transform = `translateY(${rate}px)`;
      });
    });

    // Parallax pour les cartes flottantes
    const floatingCards = document.querySelectorAll(".floating-card");
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;

      floatingCards.forEach((card, index) => {
        const rate = scrolled * (0.1 + index * 0.05);
        card.style.transform = `translateY(${rate}px)`;
      });
    });
  }

  // Notifications
  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

    document.body.appendChild(notification);

    // Auto-remove
    setTimeout(() => {
      notification.remove();
    }, 5000);

    // Close button
    notification
      .querySelector(".notification-close")
      .addEventListener("click", () => {
        notification.remove();
      });
  }

  // Année actuelle
  updateCurrentYear() {
    const yearElement = document.getElementById("currentYear");
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  // Gestion du redimensionnement
  handleResize() {
    // Recalculer les particules si nécessaire
    this.initParticles();
  }

  // Utilitaire debounce
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Styles CSS pour les notifications (à ajouter au CSS global)
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        background: rgba(0, 212, 170, 0.1);
        border: 1px solid rgba(0, 212, 170, 0.3);
        border-radius: 12px;
        color: #00d4aa;
        backdrop-filter: blur(10px);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 12px;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
    }
    
    .notification-error {
        background: rgba(255, 107, 107, 0.1);
        border-color: rgba(255, 107, 107, 0.3);
        color: #ff6b6b;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        font-size: 18px;
        cursor: pointer;
        opacity: 0.7;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    /* Styles pour la validation de formulaire */
    .form-group input.valid,
    .form-group textarea.valid,
    .form-group select.valid {
        border-color: var(--success);
        box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
    }
    
    .form-group input.error,
    .form-group textarea.error,
    .form-group select.error {
        border-color: var(--error);
        box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
    }
`;

// Injection des styles
const styleSheet = document.createElement("style");
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Initialisation de l'application
document.addEventListener("DOMContentLoaded", () => {
  new PortfolioApp();
});

// Performance monitoring (optionnel)
if ("performance" in window) {
  window.addEventListener("load", () => {
    const perfData = performance.getEntriesByType("navigation")[0];
    console.log(
      `Page loaded in ${perfData.loadEventEnd - perfData.loadEventStart}ms`
    );
  });
}
