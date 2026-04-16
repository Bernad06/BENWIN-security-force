const navShell = document.querySelector(".nav-shell");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".nav-links a");
const hashNavLinks = document.querySelectorAll('.nav-links a[href^="#"]');

if (menuToggle && navShell) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navShell.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navShell.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (hashNavLinks.length) {
  const sections = [...hashNavLinks]
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const setActiveLink = (id) => {
    hashNavLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
  };

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-35% 0px -45% 0px",
        threshold: 0.1,
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const managedForms = document.querySelectorAll("form");
const phoneInputs = document.querySelectorAll('input[data-phone="true"]');

const syncFieldState = (field) => {
  const shell = field.closest(".input-shell");

  if (!shell) {
    return;
  }

  shell.classList.remove("is-valid", "is-invalid");

  if (!field.value) {
    return;
  }

  shell.classList.add(field.checkValidity() ? "is-valid" : "is-invalid");
};

phoneInputs.forEach((input) => {
  const validatePhone = () => {
    const digitsOnly = input.value.replace(/\D/g, "").slice(0, 10);
    input.value = digitsOnly;

    if (!digitsOnly || /^\d{10}$/.test(digitsOnly)) {
      input.setCustomValidity("");
    } else {
      input.setCustomValidity("Please enter a valid 10-digit phone number.");
    }

    syncFieldState(input);
  };

  input.addEventListener("input", validatePhone);
  input.addEventListener("blur", validatePhone);
});

managedForms.forEach((form) => {
  const formNote =
    form.querySelector(".form-note") ||
    (form.id === "contactForm" ? document.querySelector("#formNote") : null);

  if (!formNote) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    form.classList.add("was-validated");

    form.querySelectorAll("input, select, textarea").forEach((field) => {
      syncFieldState(field);
    });

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    formNote.textContent =
      form.dataset.successMessage ||
      "Thank you. Your enquiry has been noted and we will contact you soon.";
    form.reset();
    form.classList.remove("was-validated");

    form.querySelectorAll(".input-shell").forEach((shell) => {
      shell.classList.remove("is-valid", "is-invalid");
    });
  });
});

document.querySelectorAll(".input-shell input, .input-shell select, .input-shell textarea").forEach((field) => {
  field.addEventListener("input", () => syncFieldState(field));
  field.addEventListener("change", () => syncFieldState(field));
});
