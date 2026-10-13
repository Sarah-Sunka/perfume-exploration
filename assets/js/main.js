/* Épée & Fluide — shared site behaviour */
(function () {
  "use strict";

  /* ---------- Mobile navigation ---------- */
  var navToggle = document.getElementById("nav-toggle");
  var mobileMenu = document.getElementById("mobile-menu");

  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", function () {
      var open = mobileMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Product archetype filters (home page) ---------- */
  var applyProductFilter = null;
  var filterRow = document.getElementById("persona-filters");
  if (filterRow) {
    var chips = filterRow.querySelectorAll(".chip");
    var cards = document.querySelectorAll("#product-grid .product-card");
    var countNote = document.getElementById("filter-count");

    applyProductFilter = function (filter) {
      var shown = 0;
      chips.forEach(function (c) {
        var active = c.getAttribute("data-filter") === filter;
        c.classList.toggle("active", active);
        c.setAttribute("aria-pressed", active ? "true" : "false");
      });
      cards.forEach(function (card) {
        var match = filter === "all" || card.getAttribute("data-archetype") === filter;
        card.classList.toggle("is-hidden", !match);
        if (match) shown++;
      });
      if (countNote) {
        countNote.textContent = shown + (shown === 1 ? " formula shown" : " formulas shown");
      }
    };

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        applyProductFilter(chip.getAttribute("data-filter"));
      });
    });

    // Deep link from the search panel (index.html?filter=sensualist#wardrobe)
    var presetFilter = new URLSearchParams(window.location.search).get("filter");
    if (presetFilter) {
      var known = Array.from(chips).some(function (c) { return c.getAttribute("data-filter") === presetFilter; });
      if (known) {
        applyProductFilter(presetFilter);
        setTimeout(function () {
          var target = document.getElementById("wardrobe");
          if (target) target.scrollIntoView({ behavior: "smooth" });
        }, 200);
      }
    }
  }

  /* ---------- Search panel: preset fragrance questions ---------- */
  var searchToggle = document.querySelector("[data-search-toggle]");
  var searchPanel = document.getElementById("search-panel");
  if (searchToggle && searchPanel) {
    var setSearchOpen = function (open) {
      searchPanel.hidden = !open;
      searchToggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        if (mobileMenu) mobileMenu.classList.remove("open");
        var first = searchPanel.querySelector(".search-q");
        if (first) first.focus();
      } else {
        searchToggle.focus();
      }
    };

    searchToggle.addEventListener("click", function (event) {
      event.stopPropagation();
      setSearchOpen(searchPanel.hidden);
    });
    document.addEventListener("click", function (event) {
      if (!searchPanel.hidden && !searchPanel.contains(event.target)) {
        setSearchOpen(false);
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !searchPanel.hidden) setSearchOpen(false);
    });

    searchPanel.querySelectorAll(".search-q").forEach(function (q) {
      q.addEventListener("click", function () {
        var filter = q.getAttribute("data-filter");
        if (applyProductFilter) {
          applyProductFilter(filter);
          setSearchOpen(false);
          var target = document.getElementById("wardrobe");
          if (target) target.scrollIntoView({ behavior: "smooth" });
        } else {
          window.location.href = "index.html?filter=" + encodeURIComponent(filter) + "#wardrobe";
        }
      });
    });
  }

  /* ---------- Quick quiz banner (home page) ---------- */
  var quickOptions = document.querySelectorAll(".quick-option");
  if (quickOptions.length) {
    quickOptions.forEach(function (opt) {
      opt.addEventListener("click", function () {
        quickOptions.forEach(function (o) { o.classList.remove("selected"); });
        opt.classList.add("selected");
      });
    });
    var quickStart = document.getElementById("quick-start-btn");
    if (quickStart) {
      quickStart.addEventListener("click", function () {
        var picked = document.querySelector(".quick-option.selected");
        var target = "quiz.html";
        if (picked) target += "?energy=" + encodeURIComponent(picked.getAttribute("data-val") || "");
        window.location.href = target;
      });
    }
  }

  /* ---------- Scent persona quiz (quiz page) ---------- */
  var quizSteps = document.querySelectorAll(".quiz-step");
  if (quizSteps.length) {
    var totalSteps = quizSteps.length;
    var currentStep = 1;
    var answers = {}; // question key -> archetype weights

    var progressFill = document.getElementById("quiz-progress");
    var phaseLabel = document.getElementById("quiz-phase");
    var nameLabel = document.getElementById("quiz-phase-name");
    var pctLabel = document.getElementById("quiz-pct");
    var btnPrev = document.getElementById("quiz-prev");
    var btnNext = document.getElementById("quiz-next");

    var stepNames = [];
    quizSteps.forEach(function (step) {
      stepNames.push(step.getAttribute("data-name") || "Question");
    });

    var RESULTS = {
      visionary: {
        archetype: "The Amber Visionary",
        product: "Solaire 04",
        price: "$145",
        img: "assets/img/product-solaire-04.png",
        desc: "Bold amber resin sharpened with atlas cedar, radiating deliberate warmth and non-conformist sovereignty.",
        notes: [
          ["Bitter Blood Orange", "Radiant Opening", "sienna"],
          ["Smoked Amber & Saffron", "Resinous Warmth", "amber"],
          ["Virginian Cedarwood", "Grounded Drydown", "fig"]
        ]
      },
      solitary: {
        archetype: "The Quiet Solitary",
        product: "Cuir Blanc",
        price: "$145",
        img: "assets/img/product-cuir-blanc.png",
        desc: "An intimate second skin of Florentine iris, steamed white tea, and paper-thin white leather. Poised and contemplative.",
        notes: [
          ["White Tea Steam", "Airy Opening", "sienna"],
          ["Florentine Iris Pallida", "Powdered Calm", "amber"],
          ["Buffed White Suede", "Soft Persistence", "fig"]
        ]
      },
      sensualist: {
        archetype: "The Velvet Sensualist",
        product: "Fumée Velours",
        price: "$145",
        img: "assets/img/product-fumee-velours.png",
        desc: "Dark Damson plum laced with smoky vanilla orchid and tactile cashmere woods. Daring, tactile, magnetic.",
        notes: [
          ["Black Plum & Davana", "Opulent Opening", "sienna"],
          ["Smoked Bourbon Orchid", "Textural Depth", "amber"],
          ["Roasted Tonka Bean", "Sweet Resonance", "fig"]
        ]
      },
      catalyst: {
        archetype: "The Free Catalyst",
        product: "Nectar Sauvage",
        price: "$145",
        img: "assets/img/product-nectar-sauvage.png",
        desc: "Sparkling Calabrian bergamot infused with wild Mediterranean cypress needles and luminous crushed fig wood.",
        notes: [
          ["Sunlit Bergamot", "Electric Opening", "sienna"],
          ["Green Cypress Leaf", "Crisp Momentum", "amber"],
          ["Amberwood & Vetiver", "Clean Trail", "fig"]
        ]
      },
      philosopher: {
        archetype: "The Midnight Philosopher",
        product: "Ambre Minuit",
        price: "$145",
        img: "assets/img/product-ambre-minuit.png",
        desc: "Cracked green cardamom pods resting on Omani frankincense, blackened leather, and aged golden amber tears.",
        notes: [
          ["Green Cardamom", "Spiced Spark", "sienna"],
          ["Frankincense Tears", "Sacred Smoke", "amber"],
          ["Blackened Amber & Myrrh", "Nocturnal Depth", "fig"]
        ]
      }
    };

    function tally() {
      var totals = {};
      Object.keys(answers).forEach(function (q) {
        var weights = answers[q];
        Object.keys(weights).forEach(function (a) {
          totals[a] = (totals[a] || 0) + weights[a];
        });
      });
      var best = "visionary";
      Object.keys(totals).forEach(function (a) {
        if ((totals[a] || 0) > (totals[best] || 0)) best = a;
      });
      return best;
    }

    function renderResult() {
      var key = tally();
      var r = RESULTS[key];
      if (!r) return;

      var answered = Object.keys(answers).length;
      var score = 90 + answered * 2; // 92–98%

      var setText = function (id, text) {
        var el = document.getElementById(id);
        if (el) el.textContent = text;
      };
      var setImg = function (id, src, alt) {
        var el = document.getElementById(id);
        if (el) { el.src = src; el.alt = alt; }
      };

      setText("match-archetype", r.archetype);
      setText("match-product", r.product);
      setText("match-desc", r.desc);
      setText("match-price", r.price + " USD");
      setText("match-score", score + "% Synergy Score");
      setImg("match-img", r.img, r.product + " perfume flacon");

      var notesBox = document.getElementById("match-notes");
      if (notesBox) {
        notesBox.innerHTML = "";
        r.notes.forEach(function (n) {
          var row = document.createElement("div");
          row.className = "match-note";
          row.innerHTML =
            '<span class="left"><span class="swatch ' + n[2] + '"></span>' + n[0] + "</span>" +
            '<span class="right">' + n[1] + "</span>";
          notesBox.appendChild(row);
        });
      }

      var buyBtn = document.getElementById("match-buy");
      if (buyBtn) buyBtn.textContent = "Claim My Scent Match — " + r.price;
    }

    function updateQuizView() {
      quizSteps.forEach(function (step, i) {
        step.hidden = i + 1 !== currentStep;
      });

      var pct = Math.round((currentStep / totalSteps) * 100);
      var roman = ["I", "II", "III", "IV", "V"];
      if (progressFill) progressFill.style.width = pct + "%";
      if (phaseLabel) phaseLabel.textContent = "Phase " + (roman[currentStep - 1] || currentStep) + " of " + (roman[totalSteps - 1] || totalSteps);
      if (nameLabel) nameLabel.textContent = stepNames[currentStep - 1] || "";
      if (pctLabel) pctLabel.textContent = pct + "% Complete";

      document.querySelectorAll(".step-dot").forEach(function (dot, i) {
        dot.classList.toggle("current", i + 1 === currentStep);
        dot.classList.toggle("done", i + 1 < currentStep);
      });

      if (btnPrev) {
        btnPrev.disabled = currentStep === 1;
        btnPrev.classList.toggle("btn-disabled", currentStep === 1);
      }
      if (btnNext) {
        var label = btnNext.querySelector(".btn-label");
        if (label) label.textContent = currentStep === totalSteps ? "Lock My Match" : "Next Phase";
      }
    }

    // Option selection
    document.querySelectorAll(".quiz-options").forEach(function (group) {
      var question = group.getAttribute("data-question");
      group.querySelectorAll(".quiz-opt").forEach(function (opt) {
        opt.addEventListener("click", function () {
          group.querySelectorAll(".quiz-opt").forEach(function (o) {
            o.classList.remove("selected");
            o.setAttribute("aria-pressed", "false");
          });
          opt.classList.add("selected");
          opt.setAttribute("aria-pressed", "true");

          var weights = {};
          (opt.getAttribute("data-archetype") || "").split(",").forEach(function (pair) {
            var parts = pair.split(":");
            if (parts.length === 2) weights[parts[0]] = parseInt(parts[1], 10);
          });
          answers[question] = weights;
          renderResult();
        });
      });
    });

    if (btnNext) {
      btnNext.addEventListener("click", function () {
        if (currentStep < totalSteps) {
          currentStep++;
          updateQuizView();
        } else {
          renderResult();
          var panel = document.getElementById("match-panel");
          if (panel) panel.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }
    if (btnPrev) {
      btnPrev.addEventListener("click", function () {
        if (currentStep > 1) {
          currentStep--;
          updateQuizView();
        }
      });
    }
    document.querySelectorAll(".step-dot").forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        currentStep = i + 1;
        updateQuizView();
      });
    });

    var resetBtn = document.getElementById("quiz-reset");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        answers = {};
        currentStep = 1;
        document.querySelectorAll(".quiz-opt.selected").forEach(function (o) {
          o.classList.remove("selected");
          o.setAttribute("aria-pressed", "false");
        });
        renderResult();
        updateQuizView();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    // Deep link from the home banner (quiz.html?energy=magnetic)
    var params = new URLSearchParams(window.location.search);
    var preset = params.get("energy");
    if (preset) {
      document.querySelectorAll('.quiz-opt[data-val="' + preset + '"]').forEach(function (opt) {
        opt.click();
      });
    }

    renderResult();
    updateQuizView();
  }

  /* ---------- Contact form ---------- */
  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    var statusBox = document.getElementById("form-status");

    function setError(fieldId, message) {
      var field = document.getElementById(fieldId);
      if (!field) return;
      var wrap = field.closest(".field");
      var msg = wrap ? wrap.querySelector(".error-msg") : null;
      if (message) {
        if (wrap) wrap.classList.add("has-error");
        field.setAttribute("aria-invalid", "true");
        if (msg) msg.textContent = message;
      } else {
        if (wrap) wrap.classList.remove("has-error");
        field.removeAttribute("aria-invalid");
        if (msg) msg.textContent = "";
      }
    }

    function validEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = document.getElementById("cf-name");
      var email = document.getElementById("cf-email");
      var topic = document.getElementById("cf-topic");
      var message = document.getElementById("cf-message");
      var ok = true;

      if (!name.value.trim()) { setError("cf-name", "Please tell us your name."); ok = false; }
      else setError("cf-name", "");

      if (!validEmail(email.value.trim())) { setError("cf-email", "Please enter a valid email address."); ok = false; }
      else setError("cf-email", "");

      if (!topic.value) { setError("cf-topic", "Please choose a topic."); ok = false; }
      else setError("cf-topic", "");

      if (message.value.trim().length < 10) { setError("cf-message", "Please write a message of at least 10 characters."); ok = false; }
      else setError("cf-message", "");

      if (!ok) {
        var firstError = contactForm.querySelector(".has-error input, .has-error select, .has-error textarea");
        if (firstError) firstError.focus();
        if (statusBox) {
          statusBox.className = "form-status error";
          statusBox.textContent = "Please fix the highlighted fields and try again.";
        }
        return;
      }

      if (statusBox) {
        statusBox.className = "form-status success";
        statusBox.textContent = "Thank you, " + name.value.trim().split(" ")[0] + ". Your note has been received — our atelier replies within one business day.";
      }
      contactForm.reset();
    });

    ["cf-name", "cf-email", "cf-topic", "cf-message"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", function () { setError(id, ""); });
        el.addEventListener("change", function () { setError(id, ""); });
      }
    });
  }

  /* ---------- Newsletter (footer) ---------- */
  document.querySelectorAll(".newsletter-form").forEach(function (form) {
    var input = form.querySelector("input[type='email']");
    var msg = form.parentElement.querySelector(".newsletter-msg");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var value = input ? input.value.trim() : "";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        if (msg) {
          msg.textContent = "Please enter a valid email address.";
          msg.style.color = "var(--error)";
          msg.classList.add("show");
        }
        if (input) input.focus();
        return;
      }
      if (msg) {
        msg.textContent = "Welcome to the Gazette — your 10% invitation is on its way.";
        msg.style.color = "var(--success)";
        msg.classList.add("show");
      }
      form.reset();
    });
  });
})();
