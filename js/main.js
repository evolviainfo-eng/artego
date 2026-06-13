// Nav scroll effect
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// Mobile menu
const burger = document.querySelector('.nav__burger');
const mobileMenu = document.querySelector('.nav__mobile');
const mobileClose = document.querySelector('.nav__mobile-close');

if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  const closeMobile = () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  };
  if (mobileClose) mobileClose.addEventListener('click', closeMobile);
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobile));
}

// Reveal on scroll
const revealEls = document.querySelectorAll('[data-reveal]');
if (revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => observer.observe(el));
}

// Contact form
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const success = form.querySelector('.form__success');
    btn.textContent = 'Siunčiama...';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Išsiųsta ✓';
      if (success) success.style.display = 'block';
      form.reset();
      setTimeout(() => {
        btn.textContent = 'Siųsti užklausą';
        btn.disabled = false;
        if (success) success.style.display = 'none';
      }, 4000);
    }, 1200);
  });
}

// Lightbox
const lightbox = document.querySelector('.lightbox');
const lightboxClose = document.querySelector('.lightbox__close');
if (lightbox && lightboxClose) {
  document.querySelectorAll('.gallery-item, .gallery-full-item').forEach(item => {
    item.addEventListener('click', () => lightbox.classList.add('open'));
  });
  lightboxClose.addEventListener('click', () => lightbox.classList.remove('open'));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.classList.remove('open');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lightbox.classList.remove('open');
  });
}

// Active nav link
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPath || (currentPath === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});
