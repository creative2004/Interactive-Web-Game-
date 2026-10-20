
/*SCREEN*/

const startScreen = document.querySelector("#startScreen");
const gameScreen = document.querySelector("#gamescreen");
const winScreen = document.querySelector("#winScreen");

/*BUTTONS*/

const startButton = document.querySelector("#button");
const menuButton = document.querySelector("#menubutton");
const playAgainButton = document.querySelector("#PlayAgainButton");
const homeButton = document.querySelector("#HomeButton");

/*GAME ELEMENTS*/
const cardgrid = document.querySelector("#cardGrid");
const movesDisplay = document.querySelector("#moves");
const matchedDisplay= document.querySelector("#matched");
const finalMovesDisplay = document.querySelector("#finalmoves");

/*FRUIT IMAGES*/
const fruits = [
    { name: "strawberry", image: "images/strawberry.png" },
    { name: "orange", image: "images/orange.png" },
    { name: "cherries", image: "images/cherries.png" },
    { name: "pear", image: "images/pear.png" },
    { name: "watermelon", image: "images/watermelon.png" },
    { name: "mango", image: "images/mango.png" }
];

let firstCard = null;
let secondCard = null;
let moves = 0;
let matchedPairs = 0;
let boardLocked = false;
let mismatchTimer = null;

/*START A NEW GAME*/

function startGame() {
    startScreen.hidden = true;
    winScreen.hidden = true;
    gameScreen.hidden = false;

    firstCard = null;
    secondCard = null;
    moves = 0;
    matchedPairs = 0;
    boardLocked = false;

    clearTimeout(mismatchTimer);
    mismatchTimer = null;

    createCards();
}


/* CREATE AND SHUFFLE THE CARDS*/

function createCards() {
    cardGrid.innerHTML = "";

    const cardDeck = [...fruits, ...fruits];
   
    cardDeck.sort(() => Math.random() - 0.5);

    cardDeck.forEach((fruit) => {
        const card = document.createElement("button");

        card.type = "button";
        card.classList.add("memory-card");
        card.dataset.fruit = fruit.name;
        card.setAttribute("aria-label", "Face-down fruit card");

        const image = document.createElement("img");

        image.src = fruit.image;
        image.alt = fruit.name;
        image.hidden = true;

        card.appendChild(image);

        card.addEventListener("click", () => {
            flipCard(card);
        });

        cardGrid.appendChild(card);
    });
}

/* FLIP A CARD*/

function flipCard(card) {
   
    if (boardLocked) return;

    if (
        card.classList.contains("flipped") ||
        card.classList.contains("matched")
    ) {
        return;
    }

    /* Reveal the fruit*/
    card.classList.add("flipped");
    card.querySelector("img").hidden = false;
    card.setAttribute(
        "aria-label",
        card.dataset.fruit + " card"
    );

    if (firstCard === null) {
        firstCard = card;
        return;
    }

    secondCard = card;

    moves++;
    movesDisplay.textContent = moves;

    checkMatch();
}


/*CHECK FOR A MATCH*/

function checkMatch() {
    const isMatch =
        firstCard.dataset.fruit === secondCard.dataset.fruit;

    if (isMatch) {
        /* Note: Keep matching cards face-up*/
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        firstCard.disabled = true;
        secondCard.disabled = true;

        firstCard.setAttribute(
            "aria-label",
            firstCard.dataset.fruit + " matched"
        );
        secondCard.setAttribute(
            "aria-label",
            secondCard.dataset.fruit + " matched"
        );

        matchedPairs++;
        matchedDisplay.textContent = matchedPairs;

        /* Clear the selected cards*/
        resetSelectedCards();

        if (matchedPairs === fruits.length) {
            showWinScreen();
        }

    } else {
        
        boardLocked = true;

        mismatchTimer = setTimeout(() => {
            // Hide both fruit images again
            firstCard.querySelector("img").hidden = true;
            secondCard.querySelector("img").hidden = true;

            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");

            firstCard.setAttribute(
                "aria-label",
                "Face-down fruit card"
            );
            secondCard.setAttribute(
                "aria-label",
                "Face-down fruit card"
            );

            resetSelectedCards();
        }, 900);
    }
}

function resetSelectedCards() {
    firstCard = null;
    secondCard = null;
    boardLocked = false;
    mismatchTimer = null;
}

/* SHOW THE WINNING SCREEN*/

function showWinScreen() {
    finalMovesDisplay.textContent = moves;

    gameScreen.hidden = true;
    winScreen.hidden = false;
}


/*RETURN TO THE MAIN MENU*/

function showMenu() {
    clearTimeout(mismatchTimer);
    mismatchTimer = null;

    startScreen.hidden = false;
    gameScreen.hidden = true;
    winScreen.hidden = true;
}


/* BUTTON EVENTS*/

startButton.addEventListener("click", startGame);

menuButton.addEventListener("click", showMenu);

playAgainButton.addEventListener("click", startGame);

homeButton.addEventListener("click", showMenu);
