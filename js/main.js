document.documentElement.classList.add("js-ready");

const header = document.getElementById("header");
const nav = document.getElementById("nav");
const toggle = document.getElementById("menu-toggle");
const links = [...document.querySelectorAll(".nav__link")];
const sections = [...document.querySelectorAll("main section[id]")];

toggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Закрити меню" : "Відкрити меню");
});

const closeMenu = () => {
  nav?.classList.remove("is-open");
  toggle?.setAttribute("aria-expanded", "false");
  toggle?.setAttribute("aria-label", "Відкрити меню");
};

document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (link) closeMenu();
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
);

document.querySelectorAll(".reveal").forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
  observer.observe(el);
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
    el.classList.add("is-visible");
    observer.unobserve(el);
  }
});

const setActiveLink = () => {
  const y = window.scrollY + header.offsetHeight + 8;
  let current = sections[0]?.id;

  sections.forEach((section) => {
    if (section.offsetTop <= y) current = section.id;
  });

  links.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${current}`);
  });
};

window.addEventListener("scroll", setActiveLink, { passive: true });
setActiveLink();

const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".portfolio-grid .portfolio-card");

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    const type = button.dataset.filter;
    cards.forEach((card, index) => {
      const match = type === "all" || card.dataset.category === type;
      card.style.animationDelay = `${0.05 + (index * 0.07)}s`;
      card.classList.toggle("is-hidden", !match);
    });
  });
});

const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.reportValidity()) {
    status.textContent = "Перевірте поля форми.";
    return;
  }

  status.textContent = "Дякую! Повідомлення збережено локально — підключіть відправку пізніше.";
  form.reset();
});

// Modal functionality
const websiteData = {
  landing: {
    title: "Лендінг",
    description: "Односторінковий сайт для запуску послуги, продукту чи акції. Ідеальний рішення для швидкого старту та фокусування на одній цілі.",
    price: "від 12 000 ₴",
    term: "7–14 днів",
    features: [
      "Унікальний дизайн",
      "Адаптив під мобільні",
      "Форма заявки",
      "Анімації на скроллі",
      "SEO-оптимізація"
    ]
  },
  corporate: {
    title: "Корпоративний сайт",
    description: "Багатосторінковий сайт компанії з послугами, блогом і контактами. Повноцінний представницький ресурс для вашого бізнесу.",
    price: "від 28 000 ₴",
    term: "3–5 тижнів",
    features: [
      "До 8 сторінок",
      "Адмін-панель",
      "SEO-база",
      "Інтеграція з соціальними мережами",
      "Форми зворотного зв'язку"
    ]
  },
  store: {
    title: "Інтернет-магазин",
    description: "Каталог, кошик, оплата та облік замовлень для продажу онлайн. Повноцінний e-commerce рішення для вашого бізнесу.",
    price: "від 55 000 ₴",
    term: "5–8 тижнів",
    features: [
      "Каталог і фільтри",
      "Оплата та доставка",
      "Особистий кабінет",
      "Інтеграція платіжних систем",
      "Адміністративна панель"
    ]
  }
};

const detailsModal = document.getElementById("details-modal");
const formModal = document.getElementById("form-modal");
const priceCards = document.querySelectorAll(".price-card");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalTerm = document.getElementById("modal-term");
const modalPrice = document.getElementById("modal-price");
const modalFeatures = document.getElementById("modal-features");
const modalDiscussBtn = document.getElementById("modal-discuss-btn");
const modalForm = document.getElementById("modal-form");
const formWebsiteType = document.getElementById("form-website-type");
const formBudget = document.getElementById("form-budget");
const otherBudgetLabel = document.getElementById("other-budget-label");
const formOtherBudget = document.getElementById("form-other-budget");

let currentWebsiteType = "";

// Open details modal on card click
priceCards.forEach((card) => {
  card.addEventListener("click", () => {
    const type = card.dataset.type;
    if (!type || !websiteData[type]) return;

    currentWebsiteType = type;
    const data = websiteData[type];

    modalTitle.textContent = data.title;
    modalDescription.textContent = data.description;
    modalTerm.textContent = data.term;
    modalPrice.textContent = data.price;
    modalFeatures.innerHTML = data.features.map((feature) => `<li>${feature}</li>`).join("");

    openModal(detailsModal);
  });
});

// Open form modal on "Обговорити проект" button click
modalDiscussBtn?.addEventListener("click", () => {
  formWebsiteType.value = websiteData[currentWebsiteType].title;
  closeModal(detailsModal);
  openModal(formModal);
});

// Handle budget dropdown change
formBudget?.addEventListener("change", () => {
  if (formBudget.value === "other") {
    otherBudgetLabel.classList.remove("hidden");
    formOtherBudget.required = true;
  } else {
    otherBudgetLabel.classList.add("hidden");
    formOtherBudget.required = false;
    formOtherBudget.value = "";
  }
});

// Handle form submission - redirect to Telegram
modalForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!modalForm.reportValidity()) return;

  const formData = new FormData(modalForm);
  const name = formData.get("name");
  const telegram = formData.get("telegram");
  const websiteType = formData.get("website-type");
  let budget = formData.get("budget");

  if (budget === "other") {
    budget = formData.get("other-budget") || "Вкажу інше";
  }
  const description = formData.get("description");

  const message = `Ім'я: ${name}%0AТип сайту: ${websiteType}%0AБюджет: ${budget}%0AОпис: ${description}`;
  const telegramUrl = `https://t.me/MaryanLep?text=${message}`;

  window.open(telegramUrl, "_blank");
  closeModal(formModal);
  modalForm.reset();
  formBudget.value = "";
  otherBudgetLabel.classList.add("hidden");
});

// Modal open/close functions
function openModal(modal) {
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal(modal) {
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// Close modal on overlay click or close button
document.querySelectorAll("[data-close-modal]").forEach((element) => {
  element.addEventListener("click", (event) => {
    const modal = event.target.closest(".modal");
    if (modal) closeModal(modal);
  });
});

// Close modal on Escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.querySelectorAll(".modal[aria-hidden='false']").forEach((modal) => {
      closeModal(modal);
    });
  }
});

// Load more functionality for portfolio
const loadMoreBtn = document.getElementById("load-more-btn");
const hiddenCards = document.querySelectorAll(".portfolio-card--hidden");
let isExpanded = false;

loadMoreBtn?.addEventListener("click", () => {
  if (!isExpanded) {
    // Show all cards
    hiddenCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.remove("portfolio-card--hidden");
        card.classList.add("visible");
      }, index * 100);
    });
    loadMoreBtn.textContent = "Сховати";
    isExpanded = true;
  } else {
    // Hide extra cards
    hiddenCards.forEach((card) => {
      card.classList.add("portfolio-card--hidden");
      card.classList.remove("visible");
    });
    loadMoreBtn.textContent = "Показати ще";
    isExpanded = false;
  }
});
