

const pages = Array.from(document.querySelectorAll(".page"));
let currentPage = Math.max(
    0,
    pages.findIndex(page => page.classList.contains("active"))
);

let roseIndex = 0;



const animationStyles = document.createElement("style");

animationStyles.textContent = `
    .page {
        will-change: opacity, transform;
    }

    .page.active {
        animation: romanticPageIn 0.65s cubic-bezier(.2,.8,.2,1) both;
    }

    @keyframes romanticPageIn {
        from {
            opacity: 0;
            transform: translateY(25px) scale(.98);
            filter: blur(4px);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
        }
    }

    .love-particle {
        position: fixed;
        z-index: 99999;
        pointer-events: none;
        font-size: 22px;
        line-height: 1;
        animation: loveFloat 1.15s ease-out forwards;
    }

    @keyframes loveFloat {
        0% {
            opacity: 0;
            transform: translate(0, 0) scale(.3) rotate(0deg);
        }
        15% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            transform: translate(var(--move-x), var(--move-y))
                       scale(1.5) rotate(var(--rotate));
        }
    }

    .btn {
        position: relative;
        overflow: hidden;
        -webkit-tap-highlight-color: transparent;
        transition:
            transform .25s ease,
            box-shadow .25s ease,
            filter .25s ease;
    }

    .btn:active {
        transform: scale(.94);
        filter: brightness(1.2);
    }

    .navbar a {
        transition: color .25s ease, text-shadow .25s ease;
    }

    .navbar a.nav-active {
        color: #ff75a9;
        text-shadow: 0 0 12px rgba(255, 117, 169, .65);
    }

    .letter-paper.show,
    .surprise-message.show {
        animation: romanticReveal .65s cubic-bezier(.2,.8,.2,1) both;
    }

    @keyframes romanticReveal {
        from {
            opacity: 0;
            transform: translateY(18px) scale(.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .page.active,
        .love-particle,
        .letter-paper.show,
        .surprise-message.show {
            animation-duration: .01ms !important;
        }
    }
`;

document.head.appendChild(animationStyles);



function makeHearts(x, y, amount = 9) {
    const symbols = ["❤️", "💕", "💖", "💗", "🌹"];

    for (let i = 0; i < amount; i++) {
        const heart = document.createElement("span");

        heart.className = "love-particle";
        heart.textContent =
            symbols[Math.floor(Math.random() * symbols.length)];

        heart.style.left = x + "px";
        heart.style.top = y + "px";
        heart.style.setProperty(
            "--move-x",
            (Math.random() * 180 - 90) + "px"
        );
        heart.style.setProperty(
            "--move-y",
            (-50 - Math.random() * 150) + "px"
        );
        heart.style.setProperty(
            "--rotate",
            (Math.random() * 100 - 50) + "deg"
        );
        heart.style.fontSize = (16 + Math.random() * 17) + "px";

        document.body.appendChild(heart);

        setTimeout(() => heart.remove(), 1300);
    }
}

function heartBurstFrom(element, amount = 9) {
    if (!element) return;

    const rect = element.getBoundingClientRect();

    makeHearts(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        amount
    );
}



function showPage(index) {
    if (!pages.length) return;
    if (index < 0 || index >= pages.length) return;

    if (pages[currentPage]) {
        pages[currentPage].classList.remove("active");
    }

    currentPage = index;

    pages[currentPage].classList.remove("active");
    void pages[currentPage].offsetWidth;
    pages[currentPage].classList.add("active");

    updatePageNumber();
    updateActiveNavigation();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    const content = pages[currentPage].querySelector(".content");

    if (content) {
        const rect = content.getBoundingClientRect();

        makeHearts(
            window.innerWidth / 2,
            Math.max(100, rect.top + 20),
            5
        );
    }
}

function nextPage() {
    showPage((currentPage + 1) % pages.length);
}

function previousPage() {
    showPage((currentPage - 1 + pages.length) % pages.length);
}

function updatePageNumber() {
    const number = document.getElementById("pageNumber");

    if (number) {
        number.textContent =
            (currentPage + 1) + " / " + pages.length;
    }
}

function updateActiveNavigation() {
    const links = document.querySelectorAll(".navbar a");

    links.forEach((link, index) => {
        link.classList.toggle("nav-active", index === currentPage);
    });
}




const roseQuotes = [
    "You make my little world more beautiful. ❤️",
    "Every flower reminds me of you. 🌷",
    "You are my favourite reason to smile. 💖",
    "My world is more beautiful with you in it. 🌹",
    "You will always be special to me. 💕",
    "If love were a flower, you would be my whole garden. 🌸",
    "One rose for you, and a thousand feelings in my heart. ❤️"
];

function pickRose() {
    roseIndex = (roseIndex + 1) % roseQuotes.length;

    const quote = document.getElementById("roseQuote");
    const title = document.getElementById("roseTitle");
    const rose = document.querySelector(".big-rose");

    if (quote) {
        quote.textContent = roseQuotes[roseIndex];
    }

    if (title) {
        title.textContent = "Rose Number " +
            (roseIndex + 1) + " for My Lovely 🌹";
    }

    if (rose) {
        rose.animate(
            [
                { transform: "scale(1) rotate(0deg)" },
                { transform: "scale(1.3) rotate(-10deg)" },
                { transform: "scale(1) rotate(0deg)" }
            ],
            {
                duration: 550,
                easing: "ease-out"
            }
        );

        heartBurstFrom(rose, 12);
    }
}



function openLetter() {
    const letter = document.getElementById("letterPaper");

    if (!letter) return;

    letter.classList.add("show");

    const button = document.querySelector(
        "#letter .letter-box .btn"
    );

    heartBurstFrom(button || letter, 10);
}

function closeLetter() {
    const letter = document.getElementById("letterPaper");

    if (letter) {
        letter.classList.remove("show");
    }
}



function openSurprise() {
    const message = document.getElementById("surpriseMessage");

    if (!message) return;

    message.classList.add("show");

    const gift = document.querySelector(".gift");

    if (gift) {
        gift.animate(
            [
                { transform: "scale(1) rotate(0deg)" },
                { transform: "scale(1.2) rotate(8deg)" },
                { transform: "scale(1.1) rotate(-8deg)" },
                { transform: "scale(1) rotate(0deg)" }
            ],
            {
                duration: 700,
                easing: "ease-in-out"
            }
        );
    }

    
    makeHearts(
        window.innerWidth / 2,
        window.innerHeight / 2,
        28
    );
}


document.querySelectorAll(".btn").forEach(button => {
    button.addEventListener("click", function () {
        heartBurstFrom(this, 5);
    });
});



document.addEventListener("keydown", function (event) {
    const tag = event.target.tagName;

    if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        event.target.isContentEditable
    ) {
        return;
    }

    if (event.key === "ArrowRight") {
        nextPage();
    }

    if (event.key === "ArrowLeft") {
        previousPage();
    }
});


pages.forEach((page, index) => {
    page.classList.toggle("active", index === currentPage);
});

updatePageNumber();
updateActiveNavigation();
