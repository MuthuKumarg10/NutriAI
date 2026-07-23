// =========================================
// DARK MODE
// =========================================

const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const icon = themeToggle.querySelector("i");

    if (document.body.classList.contains("dark")) {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
    } else {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
    }

});


// =========================================
// SMOOTH SCROLL
// =========================================

document.querySelectorAll("nav a").forEach(link => {

    link.addEventListener("click", function (e) {

        e.preventDefault();

        const section = document.querySelector(this.getAttribute("href"));

        section.scrollIntoView({
            behavior: "smooth"
        });

    });

});


// =========================================
// NAVBAR SHADOW
// =========================================

window.addEventListener("scroll", () => {

    const nav = document.querySelector("nav");

    if (window.scrollY > 50) {

        nav.style.boxShadow = "0 8px 25px rgba(0,0,0,.15)";

    } else {

        nav.style.boxShadow = "0 5px 20px rgba(0,0,0,.05)";

    }

});


// =========================================
// SCROLL ANIMATION
// =========================================

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

});

document.querySelectorAll(".card,.planner-container,.result-card,.about").forEach(el => {

    el.classList.add("fade");

    observer.observe(el);

});


// =========================================
// FORM SUBMIT
// =========================================

const form = document.getElementById("nutritionForm");

const loading = document.querySelector(".loading");

const output = document.getElementById("planOutput");

form.addEventListener("submit", function (e) {

    e.preventDefault();

    loading.classList.remove("hidden");

    output.innerHTML = "";

    const name = form.querySelector("input[type='text']").value;

    const age = form.querySelectorAll("input")[1].value;

    const gender = form.querySelectorAll("select")[0].value;

    const height = form.querySelectorAll("input")[2].value;

    const weight = form.querySelectorAll("input")[3].value;

    const disease = form.querySelectorAll("select")[1].value;

    const activity = form.querySelectorAll("select")[2].value;

    const foodPreference = form.querySelectorAll("select")[3].value;

    const goal = form.querySelectorAll("select")[4].value;

    const allergies = form.querySelector("textarea").value;

    fetch("http://127.0.0.1:8000/generate-plan", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            name: name,
            age: Number(age),
            gender: gender,
            height: Number(height),
            weight: Number(weight),
            disease: disease,
            activity: activity,
            foodPreference: foodPreference,
            goal: goal,
            allergies: allergies

        })

    })

        .then(response => {

            if (!response.ok) {

                throw new Error("Backend Error");

            }

            return response.json();

        })

        .then(data => {

            loading.classList.add("hidden");

            output.innerHTML = data.plan;

            document.getElementById("result").scrollIntoView({

                behavior: "smooth"

            });

        })

        .catch(error => {

            loading.classList.add("hidden");

            output.innerHTML = `

            <div class="meal-card">

                <h3 style="color:red;">Error</h3>

                <p>${error.message}</p>

                <p>Please make sure the FastAPI backend is running.</p>

            </div>

            `;

            console.error(error);

        });

});


// =========================================
// BUTTON HOVER
// =========================================

document.querySelectorAll("button").forEach(btn => {

    btn.addEventListener("mouseenter", () => {

        btn.style.transform = "translateY(-4px)";

    });

    btn.addEventListener("mouseleave", () => {

        btn.style.transform = "translateY(0px)";

    });

});


// =========================================
// HERO BUTTON
// =========================================

document.querySelector(".primary-btn").addEventListener("click", () => {

    document.getElementById("planner").scrollIntoView({

        behavior: "smooth"

    });

});


// =========================================
// CARD HOVER EFFECT
// =========================================

document.querySelectorAll(".card").forEach(card => {

    card.addEventListener("mousemove", (e) => {

        const x = e.offsetX;

        const y = e.offsetY;

        card.style.background = `

        radial-gradient(circle at ${x}px ${y}px,

        rgba(0,200,150,.15),

        rgba(255,255,255,.8))

        `;

    });

    card.addEventListener("mouseleave", () => {

        card.style.background = "rgba(255,255,255,.75)";

    });

});


// =========================================
// FOOTER YEAR
// =========================================

const footer = document.querySelector("footer p:last-child");

footer.innerHTML = `© ${new Date().getFullYear()} All Rights Reserved`;


// =========================================
// PAGE LOAD
// =========================================

window.addEventListener("load", () => {

    console.log("NutriAI Loaded Successfully.");

});