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

// Reveal on scroll — triggers earlier so sections never appear black
const revealEls = document.querySelectorAll('[data-reveal]');
if (revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 60px 0px' });
  revealEls.forEach(el => observer.observe(el));
}

// Form validation helper
function showFieldError(input, message) {
  if (!input) return;
  input.classList.add('input-error');
  const div = document.createElement('div');
  div.className = 'field-error';
  div.textContent = message;
  input.parentNode.appendChild(div);
}

function clearFormErrors(form) {
  form.querySelectorAll('.field-error').forEach(el => el.remove());
  form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
}

function validateForm(form) {
  clearFormErrors(form);
  let valid = true;

  const name = form.querySelector('[name="name"]');
  if (name && !name.value.trim()) {
    showFieldError(name, 'Vardas yra privalomas');
    valid = false;
  }

  const phone = form.querySelector('[name="phone"]');
  if (phone) {
    if (!phone.value.trim()) {
      showFieldError(phone, 'Telefono numeris yra privalomas');
      valid = false;
    } else if (!/^[\+]?[\d\s\-\(\)]{7,}$/.test(phone.value.trim())) {
      showFieldError(phone, 'Įveskite teisingą telefono numerį');
      valid = false;
    }
  }

  const message = form.querySelector('[name="message"]');
  if (message && message.hasAttribute('required') && !message.value.trim()) {
    showFieldError(message, 'Aprašymas yra privalomas');
    valid = false;
  }

  return valid;
}

// Contact form — real submission via formsubmit.co AJAX
document.querySelectorAll('.contact-form').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm(form)) return;

    const btn = form.querySelector('[type="submit"]');
    const successEl = form.querySelector('.form__success');
    const errorEl = form.querySelector('.form__error');
    const originalHTML = btn.innerHTML;

    btn.innerHTML = 'Siunčiama...';
    btn.disabled = true;
    if (errorEl) errorEl.style.display = 'none';

    // Collect all form fields
    const data = { _subject: 'Nauja užklausa iš artego.lt' };
    new FormData(form).forEach((val, key) => { data[key] = val; });

    try {
      const res = await fetch('https://formsubmit.co/ajax/bg.artego@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        btn.innerHTML = 'Išsiųsta ✓';
        if (successEl) successEl.style.display = 'block';
        form.reset();
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.disabled = false;
          if (successEl) successEl.style.display = 'none';
        }, 5000);
      } else {
        throw new Error('server');
      }
    } catch {
      btn.innerHTML = originalHTML;
      btn.disabled = false;
      if (errorEl) errorEl.style.display = 'block';
    }
  });
});

// Lightbox
const lightbox = document.querySelector('.lightbox');
const lightboxClose = document.querySelector('.lightbox__close');
const lightboxContent = document.querySelector('.lightbox__content');

if (lightbox && lightboxClose && lightboxContent) {
  function openLightbox(imgEl) {
    const src = imgEl ? imgEl.src : '';
    const alt = imgEl ? imgEl.alt : '';
    lightboxContent.innerHTML = `<img src="${src}" alt="${alt}" style="max-width:80vw;max-height:80vh;object-fit:contain;display:block;">`;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  document.querySelectorAll('.gallery-item, .gallery-full-item').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      openLightbox(img);
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lightboxContent.innerHTML = '';
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
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
