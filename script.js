// Récupération des éléments
const diceContainer = document.getElementById("dice-container");
const rollBtn = document.getElementById("roll-btn");
const diceCountSelect = document.getElementById("dice-count");
const totalSpan = document.getElementById("total");

// Tableau des faces de dés
const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

// Fonction pour générer un dé aléatoire (0 à 5 pour l'index du tableau)
function rollDie() {
    return Math.floor(Math.random() * 6);
}

// Fonction pour créer les dés dans le container (max 5 par ligne)
function createDice(count) {
    diceContainer.innerHTML = ""; // vide le container

    const dicePerRow = 5;
    const rows = Math.ceil(count / dicePerRow);

    for (let r = 0; r < rows; r++) {
        const row = document.createElement("div");
        row.classList.add("dice-row");

        for (let i = 0; i < dicePerRow && r * dicePerRow + i < count; i++) {
            const die = document.createElement("div");
            die.classList.add("die");

            // Crée le span à l'intérieur pour l'emoji
            const emojiSpan = document.createElement("span");
            emojiSpan.textContent = "🎲";
            emojiSpan.classList.add("placeholder"); // classe spécifique
            die.appendChild(emojiSpan);

            row.appendChild(die);
        }

        diceContainer.appendChild(row);
    }
}

// Fonction pour animer et lancer les dés
function rollDice() {
    const count = parseInt(diceCountSelect.value);
    const diceElements = diceContainer.querySelectorAll(".die span");
    const finalValues = [];

    // Désactivation du bouton et select pendant l'animation
    rollBtn.disabled = true;
    diceCountSelect.disabled = true;

    // Ajustement du timing selon le nombre de dés
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
        let iterations = 8 + Math.floor(Math.random() * 6); // un peu moins de tours
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


// Initialisation : créer le nombre de dés sélectionné au chargement
createDice(parseInt(diceCountSelect.value));

// Quand on change le nombre de dés
diceCountSelect.addEventListener("change", () => {
    createDice(parseInt(diceCountSelect.value));
    totalSpan.textContent = "0";
});

// Quand on clique sur lancer
rollBtn.addEventListener("click", rollDice);
