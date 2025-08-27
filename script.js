// Récupération des éléments
const diceContainer = document.getElementById("dice-container");
const rollBtn = document.getElementById("roll-btn");
const diceCountSelect = document.getElementById("dice-count");
const totalSpan = document.getElementById("total");

// Pour la modale
const infoBtn = document.getElementById("info-btn");
const modal = document.getElementById("info-modal");
const closeModal = document.getElementById("close-modal");

// Tableau des faces de dés
const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

// Fonction pour générer un dé aléatoire
function rollDie() {
    return Math.floor(Math.random() * 6);
}

// Création des dés (max 5 par ligne)
function createDice(count) {
    diceContainer.innerHTML = "";

    const dicePerRow = 5;
    const rows = Math.ceil(count / dicePerRow);

    for (let r = 0; r < rows; r++) {
        const row = document.createElement("div");
        row.classList.add("dice-row");

        for (let i = 0; i < dicePerRow && r * dicePerRow + i < count; i++) {
            const die = document.createElement("div");
            die.classList.add("die");

            const emojiSpan = document.createElement("span");
            emojiSpan.textContent = "🎲";
            emojiSpan.classList.add("placeholder");

            die.appendChild(emojiSpan);
            row.appendChild(die);
        }
        diceContainer.appendChild(row);
    }
}

// Lancer les dés avec animation
function rollDice() {
    const count = parseInt(diceCountSelect.value);
    const diceElements = diceContainer.querySelectorAll(".die span");
    const finalValues = [];

    rollBtn.disabled = true;
    diceCountSelect.disabled = true;

    let baseDelay = 100;
    let stepDelay = 50;
    if (count > 5 && count <= 10) {
        baseDelay = 80;
        stepDelay = 30;
    } else if (count > 10) {
        baseDelay = 60;
        stepDelay = 20;
    }

    diceElements.forEach((span, index) => {
        let iterations = 8 + Math.floor(Math.random() * 6);
        let currentIteration = 0;

        const interval = setInterval(() => {
            span.textContent = diceFaces[rollDie()];
            span.classList.remove("placeholder");
            span.parentElement.style.transform = `translate(${Math.random() * 6 - 3}px, ${Math.random() * 6 - 3}px)`;

            currentIteration++;
            if (currentIteration >= iterations) {
                clearInterval(interval);
                span.parentElement.style.transform = "translate(0,0)";
                finalValues[index] = diceFaces.indexOf(span.textContent) + 1;

                if (finalValues.filter(v => v !== undefined).length === count) {
                    const sum = finalValues.reduce((a, b) => a + b, 0);
                    totalSpan.textContent = sum;

                    rollBtn.disabled = false;
                    diceCountSelect.disabled = false;
                }
            }
        }, baseDelay + index * stepDelay);
    });
}

// Initialisation
createDice(parseInt(diceCountSelect.value));
diceCountSelect.addEventListener("change", () => {
    createDice(parseInt(diceCountSelect.value));
    totalSpan.textContent = "0";
});
rollBtn.addEventListener("click", rollDice);

// Gestion de la modale ℹ️ (contenu fixe)
infoBtn.addEventListener("click", () => {
    probabilitiesText = modal.querySelector("#probabilities");
    probabilitiesText.innerHTML = `
    <strong>Avec 10 dés :</strong> ~ <strong>1 chance sur 60 466 176</strong> d’obtenir le score minimum <strong>(10)</strong> ou maximum <strong>(60)</strong>.<br><br>
    <strong>Avec 15 dés :</strong> ~ <strong>1 chance sur 470 184 984 576</strong> d’obtenir le score minimum <strong>(15)</strong> ou maximum <strong>(90)</strong>.<br><br>
    Bonne chance pour obtenir le score maximum (ou minimum)
`;
    modal.style.display = "flex";
});

// Fermeture modale
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});
window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
});
