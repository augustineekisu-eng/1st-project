```javascript
const searchInput = document.getElementById("searchInput");
const gameCards = document.querySelectorAll(".game-card");

/* =========================
   GAME SEARCH
========================= */

if (searchInput) {
    searchInput.addEventListener("input", function () {
        const searchText = searchInput.value.toLowerCase();

        gameCards.forEach(function (card) {
            const gameName = card.querySelector("h3").textContent.toLowerCase();

            card.style.display = gameName.includes(searchText)
                ? "block"
                : "none";
        });
    });
}

/* =========================
   STREET RACER
========================= */

function playGame(gameName) {

    if (gameName !== "Street Racer") {
        alert(
            "🎮 " + gameName +
            " is coming soon!\n\nStreet Racer is playable now."
        );
        return;
    }

    startStreetRacer();
}

function startStreetRacer() {

    const oldGame = document.getElementById("racingGame");

    if (oldGame) {
        oldGame.remove();
    }

    const game = document.createElement("div");

    game.id = "racingGame";

    game.innerHTML = `
        <div class="race-header">
            <h2>🏎️ STREET RACER</h2>
            <div>
                Score: <span id="raceScore">0</span>
                |
                Lives: <span id="raceLives">3</span>
            </div>
        </div>

        <div class="race-area" id="raceArea">

            <div class="road-line line1"></div>
            <div class="road-line line2"></div>
            <div class="road-line line3"></div>

            <div class="player-car" id="playerCar">🏎️</div>

        </div>

        <div class="race-controls">
            <button id="leftBtn">⬅️</button>
            <button id="rightBtn">➡️</button>
        </div>

        <button class="restart-race" id="restartRace">
            🔄 RESTART
        </button>

        <p class="race-help">
            Use ← → arrow keys or the buttons to move your car.
            Avoid the traffic!
        </p>
    `;

    document.body.appendChild(game);

    addRaceStyles();

    const raceArea = document.getElementById("raceArea");
    const player = document.getElementById("playerCar");

    let playerX = 50;
    let score = 0;
    let lives = 3;
    let gameRunning = true;
    let enemies = [];
    let animation;

    player.style.left = playerX + "%";

    /* -------------------------
       MOVE PLAYER
    ------------------------- */

    function moveLeft() {
        if (!gameRunning) return;

        playerX -= 7;

        if (playerX < 20) {
            playerX = 20;
        }

        player.style.left = playerX + "%";
    }

    function moveRight() {
        if (!gameRunning) return;

        playerX += 7;

        if (playerX > 80) {
            playerX = 80;
        }

        player.style.left = playerX + "%";
    }

    document.addEventListener("keydown", keyHandler);

    function keyHandler(event) {

        if (event.key === "ArrowLeft") {
            moveLeft();
        }

        if (event.key === "ArrowRight") {
            moveRight();
        }
    }

    document.getElementById("leftBtn")
        .addEventListener("click", moveLeft);

    document.getElementById("rightBtn")
        .addEventListener("click", moveRight);

    /* -------------------------
       CREATE ENEMY
    ------------------------- */

    function createEnemy() {

        if (!gameRunning) return;

        const enemy = document.createElement("div");

        enemy.className = "enemy-car";

        enemy.textContent = Math.random() > 0.5
            ? "🚘"
            : "🚙";

        const lane = Math.floor(Math.random() * 3);

        const positions = [30, 50, 70];

        enemy.style.left = positions[lane] + "%";
        enemy.style.top = "-70px";

        raceArea.appendChild(enemy);

        enemies.push({
            element: enemy,
            y: -70,
            x: positions[lane]
        });
    }

    /* -------------------------
       COLLISION
    ------------------------- */

    function collision(a, b) {

        const rectA = a.getBoundingClientRect();
        const rectB = b.getBoundingClientRect();

        return !(
            rectA.bottom < rectB.top ||
            rectA.top > rectB.bottom ||
            rectA.right < rectB.left ||
            rectA.left > rectB.right
        );
    }

    /* -------------------------
       GAME LOOP
    ------------------------- */

    function gameLoop() {

        if (!gameRunning) return;

        enemies.forEach((enemy, index) => {

            enemy.y += 5;

            enemy.element.style.top = enemy.y + "px";

            if (collision(player, enemy.element)) {

                enemy.element.remove();

                enemies.splice(index, 1);

                lives--;

                document.getElementById("raceLives")
                    .textContent = lives;

                if (lives <= 0) {
                    endGame();
                }
            }

            if (enemy.y > raceArea.offsetHeight) {

                enemy.element.remove();

                enemies.splice(index, 1);

                score += 10;

                document.getElementById("raceScore")
                    .textContent = score;
            }

        });

        animation = requestAnimationFrame(gameLoop);
    }

    /* -------------------------
       SPAWN TRAFFIC
    ------------------------- */

    const trafficTimer = setInterval(() => {

        if (!gameRunning) {
            clearInterval(trafficTimer);
            return;
        }

        createEnemy();

    }, 900);

    /* -------------------------
       GAME OVER
    ------------------------- */

    function endGame() {

        gameRunning = false;

        cancelAnimationFrame(animation);

        document.removeEventListener(
            "keydown",
            keyHandler
        );

        document.getElementById("raceArea")
            .insertAdjacentHTML(
                "beforeend",
                `
                <div class="game-over">
                    <h1>💥 GAME OVER</h1>
                    <p>Your score: ${score}</p>
                    <button onclick="startStreetRacer()">
                        PLAY AGAIN
                    </button>
                </div>
                `
            );
    }

    document.getElementById("restartRace")
        .addEventListener("click", startStreetRacer);

    gameLoop();
}

/* =========================
   GAME CSS
========================= */

function addRaceStyles() {

    if (document.getElementById("raceStyles")) {
        return;
    }

    const style = document.createElement("style");

    style.id = "raceStyles";

    style.textContent = `

        #racingGame {
            position: fixed;
            inset: 0;
            z-index: 9999;
            background: #050505;
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 15px;
        }

        .race-header {
            width: min(500px, 95%);
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            background: #151515;
            border-radius: 8px;
            margin-bottom: 10px;
        }

        .race-header h2 {
            color: #ff3c00;
            margin: 0;
            font-size: 18px;
        }

        .race-area {
            position: relative;
            width: min(500px, 95%);
            height: 70vh;
            max-height: 650px;
            min-height: 450px;
            overflow: hidden;
            background:
                repeating-linear-gradient(
                    90deg,
                    #202020 0px,
                    #202020 32%,
                    #111 32%,
                    #111 34%,
                    #202020 34%,
                    #202020 66%,
                    #111 66%,
                    #111 68%,
                    #202020 68%
                );
            border-left: 8px solid #555;
            border-right: 8px solid #555;
            border-radius: 8px;
        }

        .road-line {
            position: absolute;
            width: 8px;
            height: 70px;
            background: white;
            left: 33%;
            opacity: .8;
            animation: roadMove .7s linear infinite;
        }

        .line2 {
            left: 66%;
            animation-delay: .25s;
        }

        .line3 {
            top: 200px;
            left: 33%;
            animation-delay: .45s;
        }

        @keyframes roadMove {
            from {
                transform: translateY(-150px);
            }
            to {
                transform: translateY(700px);
            }
        }

        .player-car {
            position: absolute;
            bottom: 30px;
            transform: translateX(-50%);
            font-size: 48px;
            z-index: 5;
            transition: left .12s;
        }

        .enemy-car {
            position: absolute;
            transform: translateX(-50%);
            font-size: 45px;
            z-index: 4;
        }

        .race-controls {
            display: flex;
            gap: 30px;
            margin-top: 12px;
        }

        .race-controls button,
        .restart-race,
        .game-over button {
            border: none;
            background: #ff3c00;
            color: white;
            font-size: 20px;
            font-weight: bold;
            padding: 12px 28px;
            border-radius: 8px;
            cursor: pointer;
        }

        .race-controls button {
            min-width: 100px;
        }

        .restart-race {
            margin-top: 10px;
            font-size: 14px;
        }

        .race-help {
            color: #aaa;
            text-align: center;
            margin: 8px;
        }

        .game-over {
            position: absolute;
            inset: 0;
            z-index: 20;
            background: rgba(0,0,0,.88);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
        }

        .game-over h1 {
            color: #ff3c00;
            font-size: 38px;
        }

        .game-over p {
            font-size: 22px;
            margin-bottom: 20px;
        }

        @media (max-width: 600px) {

            .race-area {
                height: 62vh;
                min-height: 400px;
            }

            .race-header {
                font-size: 14px;
            }

            .player-car {
                font-size: 42px;
            }

            .enemy-car {
                font-size: 40px;
            }
        }
    `;

    document.head.appendChild(style);
}
```
