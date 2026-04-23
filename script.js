// --- CUSTOM CURSOR ---
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
const hoverTargets = document.querySelectorAll('.hover-target');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  
  // Slight delay for the follower
  setTimeout(() => {
    cursorFollower.style.left = e.clientX + 'px';
    cursorFollower.style.top = e.clientY + 'px';
  }, 50);
});

hoverTargets.forEach(target => {
  target.addEventListener('mouseenter', () => {
    cursor.classList.add('hovering');
    cursorFollower.classList.add('hovering');
  });
  target.addEventListener('mouseleave', () => {
    cursor.classList.remove('hovering');
    cursorFollower.classList.remove('hovering');
  });
});

// --- MAGNETIC BUTTONS ---
hoverTargets.forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const h = rect.width / 2;
    const v = rect.height / 2;
    const x = e.clientX - rect.left - h;
    const y = e.clientY - rect.top - v;
    
    // Move button slightly towards cursor
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  });
  
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = `translate(0px, 0px)`;
    // Adding a quick spring transition
    btn.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)";
    setTimeout(() => {
      btn.style.transition = ""; // remove transition to not conflict with hover
    }, 500);
  });
});

// --- NAVBAR SCROLL EFFECT ---
const nav = document.querySelector('.glass-nav');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  // Scrolled padding effect
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
  
  // Hide/Show on scroll direction
  if (window.scrollY > lastScrollY && window.scrollY > 100) {
    // Scrolling down
    nav.classList.add('hidden');
  } else {
    // Scrolling up
    nav.classList.remove('hidden');
  }
  
  lastScrollY = window.scrollY;
});

// --- TYPING EFFECT ---
const typingText = document.querySelector('.typing-text');
const words = [
  "Full-Stack Applications.",
  "Scalable Web Apps.",
  "Modern MERN Projects.",
  "High-Performance Solutions."
];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  if(!typingText) return;
  const currentWord = words[wordIndex];
  
  if (isDeleting) {
    typingText.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingText.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
  }

  let typeSpeed = isDeleting ? 50 : 100;

  if (!isDeleting && charIndex === currentWord.length) {
    typeSpeed = 2000; // Pause at end of word
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    typeSpeed = 500; // Pause before next word
  }

  setTimeout(typeEffect, typeSpeed);
}
// Start typing effect
setTimeout(typeEffect, 1000);

// --- HACKER TEXT DECODE EFFECT ---
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*";
function decodeText(element) {
  let iteration = 0;
  const originalText = element.dataset.value || element.innerText;
  if (!element.dataset.value) element.dataset.value = originalText;
  
  clearInterval(element.decodeInterval);
  
  element.decodeInterval = setInterval(() => {
    element.innerText = originalText
      .split("")
      .map((letter, index) => {
        if(index < iteration) {
          return originalText[index];
        }
        return letters[Math.floor(Math.random() * 26)];
      })
      .join("");
    
    if(iteration >= originalText.length){ 
      clearInterval(element.decodeInterval);
    }
    
    iteration += 1 / 3;
  }, 30);
}

// --- REVEAL ANIMATIONS ---
const reveals = document.querySelectorAll(".reveal");
const observerOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px"
};

let revealDelay = 0;
let resetDelayTimeout = null;

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      setTimeout(() => {
        entry.target.classList.add("show");
        
        // Trigger decode effect if it's a section header
        const gradientText = entry.target.querySelector('.gradient-text') || (entry.target.classList.contains('gradient-text') ? entry.target : null);
        if(gradientText) decodeText(gradientText);
        
      }, revealDelay);
      
      revealDelay += 150; // stagger by 150ms
      observer.unobserve(entry.target);
    }
  });
  
  // Reset delay for the next batch of scrolls
  clearTimeout(resetDelayTimeout);
  resetDelayTimeout = setTimeout(() => {
    revealDelay = 0;
  }, 100);
}, observerOptions);

reveals.forEach(el => observer.observe(el));

// --- 3D TILT EFFECT & SPOTLIGHT ---
const tiltElements = document.querySelectorAll('.tilt-element');

tiltElements.forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;  
    
    // Spotlight effect variables
    el.style.setProperty('--mouse-x', `${x}px`);
    el.style.setProperty('--mouse-y', `${y}px`);
    
    // Only tilt if it has the class
    if (el.classList.contains('project-card')) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10; 
      const rotateY = ((x - centerX) / centerX) * 10;
      
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    }
  });
  
  el.addEventListener('mouseleave', () => {
    if (el.classList.contains('project-card')) {
      el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    }
  });
});

// --- PROJECT FILTERING ---
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const filterValue = btn.getAttribute('data-filter');
    
    projectCards.forEach(card => {
      if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
        card.classList.remove('hidden');
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// --- EMAILJS INIT & FORM SUBMISSION ---
(function(){
  if(typeof emailjs !== 'undefined') {
    emailjs.init("A7UV0jvX80HU2xNGA");
  }
})();

const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

if(form) {
  form.addEventListener("submit", function(e){
    e.preventDefault();
    status.textContent = "Sending message...";
    status.style.color = "var(--text-muted)";

    if(typeof emailjs === 'undefined') {
      status.textContent = "Error: EmailJS not loaded.";
      status.style.color = "#ef4444";
      return;
    }

    emailjs.sendForm(
      "service_inkz10e", 
      "template_g9hpu4i", 
      this
    )
    .then(() => {
      status.textContent = "Message sent successfully ✔";
      status.style.color = "var(--accent-primary)";
      form.reset();
    })
    .catch((err) => {
      console.error(err);
      status.textContent = "Failed to send message. Please try again.";
      status.style.color = "#ef4444";
    });
  });
}

// --- 3D TAG CLOUD INIT ---
const myTags = [
  'JavaScript', 'CSS', 'HTML', 'React', 'Node.js',
  'Express', 'MongoDB', 'Python', 'Django', 'Git',
  'GitHub', 'REST API', 'JSON', 'Frontend', 'Backend',
  'C', 'Java', 'DSA'
];
if(typeof TagCloud !== 'undefined') {
  TagCloud('.sphere', myTags, {
    radius: 200,
    maxSpeed: 'normal',
    initSpeed: 'normal',
    direction: 135,
    keep: true
  });
}

// --- INTERACTIVE PARTICLE BACKGROUND ---
const canvas = document.getElementById('particle-canvas');
if(canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particlesArray;

  // get mouse position
  let mouse = {
    x: null,
    y: null,
    radius: 150
  }

  window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
  });

  window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  });

  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.color = color;
    }
    // method to draw individual particle
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    // check particle position, mouse position, move the particle, draw the particle
    update() {
      if (this.x > canvas.width || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.directionY = -this.directionY;
      }

      // check collision detection - mouse position / particle position
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx*dx + dy*dy);
      
      // Repel from mouse slightly
      if (distance < mouse.radius + this.size) {
        if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
          this.x += 2;
        }
        if (mouse.x > this.x && this.x > this.size * 10) {
          this.x -= 2;
        }
        if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
          this.y += 2;
        }
        if (mouse.y > this.y && this.y > this.size * 10) {
          this.y -= 2;
        }
      }
      
      this.x += this.directionX;
      this.y += this.directionY;
      this.draw();
    }
  }

  function initParticles() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 12000;
    for (let i = 0; i < numberOfParticles; i++) {
      let size = (Math.random() * 2) + 1;
      let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
      let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
      let directionX = (Math.random() * 1) - 0.5;
      let directionY = (Math.random() * 1) - 0.5;
      let color = 'rgba(20, 184, 166, 0.5)'; // Accent primary color
      particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
  }

  function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                       ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
        if (distance < (canvas.width / 7) * (canvas.height / 7)) {
          opacityValue = 1 - (distance / 20000);
          ctx.strokeStyle = `rgba(20, 184, 166, ${opacityValue * 0.2})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    connect();
  }

  initParticles();
  animateParticles();
  
  // Clear mouse on mouseleave
  window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
  });
}
