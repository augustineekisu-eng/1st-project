const searchInput = document.getElementById("searchInput");

if (searchInput) {
    searchInput.addEventListener("input", function () {
        const search = this.value.toLowerCase();
        document.querySelectorAll(".game-card").forEach(card => {
            card.style.display = card.innerText.toLowerCase().includes(search)
                ? ""
                : "none";
        });
    });
}

let gameRunning = false;
let animationId = null;

function playGame(gameName) {
    stopGame();

    const overlay = document.createElement("div");
    overlay.id = "gameOverlay";

    overlay.innerHTML = `
        <div id="gameBox">
            <button id="closeGame">✕ CLOSE</button>
            <h2 id="gameTitle">${gameName}</h2>
            <div id="gameInfo">Loading...</div>
            <canvas id="gameCanvas" width="800" height="500"></canvas>
            <div id="controls">Use your keyboard to play</div>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById("closeGame").onclick = stopGame;

    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    gameRunning = true;

    if (gameName === "Street Racer") {
        streetRacer(canvas, ctx);
    } else if (gameName === "Space Battle") {
        spaceBattle(canvas, ctx);
    } else if (gameName === "Football Star") {
        footballStar(canvas, ctx);
    } else if (gameName === "Warrior Quest") {
        warriorQuest(canvas, ctx);
    }
}

function stopGame() {
    gameRunning = false;

    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    const old = document.getElementById("gameOverlay");

    if (old) {
        old.remove();
    }
}

function setInfo(text) {
    const info = document.getElementById("gameInfo");

    if (info) {
        info.innerHTML = text;
    }
}

/* =========================
   STREET RACER
========================= */

function streetRacer(canvas, ctx) {
    setInfo("🏎️ Arrow keys = move | Avoid the cars | Survive as long as possible");

    const player = {
        x: 370,
        y: 410,
        width: 60,
        height: 90,
        speed: 7
    };

    const enemies = [];
    const keys = {};
    let score = 0;
    let speed = 5;
    let gameOver = false;

    function keyDown(e) {
        keys[e.key] = true;
    }

    function keyUp(e) {
        keys[e.key] = false;
    }

    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    for (let i = 0; i < 4; i++) {
        enemies.push({
            x: 260 + Math.random() * 280,
            y: -Math.random() * 700,
            width: 60,
            height: 90
        });
    }

    function drawCar(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 60, 90);

        ctx.fillStyle = "#111";
        ctx.fillRect(x + 8, y + 15, 44, 25);

        ctx.fillStyle = "#222";
        ctx.fillRect(x - 5, y + 15, 8, 20);
        ctx.fillRect(x + 57, y + 15, 8, 20);
        ctx.fillRect(x - 5, y + 60, 8, 20);
        ctx.fillRect(x + 57, y + 60, 8, 20);
    }

    function collision(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    function loop() {
        if (!gameRunning) return;

        ctx.fillStyle = "#222";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#444";
        ctx.fillRect(200, 0, 400, canvas.height);

        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 6;
        ctx.setLineDash([30, 30]);

        ctx.beginPath();
        ctx.moveTo(400, 0);
        ctx.lineTo(400, canvas.height);
        ctx.stroke();

        ctx.setLineDash([]);

        if (!gameOver) {
            if (keys["ArrowLeft"] && player.x > 210) {
                player.x -= player.speed;
            }

            if (keys["ArrowRight"] && player.x < 530) {
                player.x += player.speed;
            }

            if (keys["ArrowUp"] && player.y > 10) {
                player.y -= player.speed;
            }

            if (keys["ArrowDown"] && player.y < 400) {
                player.y += player.speed;
            }

            enemies.forEach(enemy => {
                enemy.y += speed;

                if (enemy.y > canvas.height) {
                    enemy.y = -100;
                    enemy.x = 220 + Math.random() * 330;
                    score++;
                    speed += 0.05;
                }

                if (collision(player, enemy)) {
                    gameOver = true;
                }
            });
        }

        drawCar(player.x, player.y, "#00aaff");

        enemies.forEach(enemy => {
            drawCar(enemy.x, enemy.y, "#ff3333");
        });

        ctx.fillStyle = "#fff";
        ctx.font = "24px Arial";
        ctx.fillText("Score: " + score, 20, 35);

        if (gameOver) {
            ctx.fillStyle = "rgba(0,0,0,0.75)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#fff";
            ctx.font = "50px Arial";
            ctx.fillText("GAME OVER", 280, 230);

            ctx.font = "25px Arial";
            ctx.fillText("Refresh and play again", 285, 280);
        }

        animationId = requestAnimationFrame(loop);
    }

    loop();
}

/* =========================
   SPACE BATTLE
========================= */

function spaceBattle(canvas, ctx) {
    setInfo("🚀 Arrow keys = move | SPACE = shoot");

    const player = {
        x: 370,
        y: 430,
        width: 60,
        height: 40,
        speed: 7
    };

    const bullets = [];
    const enemies = [];
    const keys = {};

    let score = 0;
    let gameOver = false;

    function keyDown(e) {
        keys[e.key] = true;

        if (e.code === "Space") {
            shoot();
        }
    }

    function keyUp(e) {
        keys[e.key] = false;
    }

    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    function shoot() {
        if (!gameRunning || gameOver) return;

        bullets.push({
            x: player.x + 27,
            y: player.y,
            width: 6,
            height: 15,
            speed: 9
        });
    }

    for (let i = 0; i < 6; i++) {
        enemies.push({
            x: 50 + Math.random() * 700,
            y: -Math.random() * 700,
            width: 45,
            height: 35,
            speed: 2 + Math.random() * 2
        });
    }

    function hit(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    function loop() {
        if (!gameRunning) return;

        ctx.fillStyle = "#05051a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < 80; i++) {
            ctx.fillStyle = "#fff";
            ctx.fillRect(
                (i * 97) % canvas.width,
                (i * 53) % canvas.height,
                2,
                2
            );
        }

        if (!gameOver) {
            if (keys["ArrowLeft"] && player.x > 0) {
                player.x -= player.speed;
            }

            if (keys["ArrowRight"] && player.x < 740) {
                player.x += player.speed;
            }

            bullets.forEach(b => {
                b.y -= b.speed;
            });

            enemies.forEach(enemy => {
                enemy.y += enemy.speed;

                if (enemy.y > canvas.height) {
                    enemy.y = -50;
                    enemy.x = Math.random() * 750;
                }

                if (hit(player, enemy)) {
                    gameOver = true;
                }
            });

            for (let i = bullets.length - 1; i >= 0; i--) {
                for (let j = enemies.length - 1; j >= 0; j--) {
                    if (hit(bullets[i], enemies[j])) {
                        bullets.splice(i, 1);
                        enemies[j].y = -50;
                        enemies[j].x = Math.random() * 750;
                        score++;
                        break;
                    }
                }
            }
        }

        ctx.fillStyle = "#00eaff";
        ctx.beginPath();
        ctx.moveTo(player.x + 30, player.y);
        ctx.lineTo(player.x, player.y + 40);
        ctx.lineTo(player.x + 60, player.y + 40);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#ffff00";

        bullets.forEach(b => {
            ctx.fillRect(b.x, b.y, b.width, b.height);
        });

        enemies.forEach(enemy => {
            ctx.fillStyle = "#ff3333";
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

            ctx.fillStyle = "#ff8800";
            ctx.fillRect(enemy.x + 10, enemy.y + 30, 25, 10);
        });

        ctx.fillStyle = "#fff";
        ctx.font = "24px Arial";
        ctx.fillText("Score: " + score, 20, 35);

        if (gameOver) {
            ctx.fillStyle = "rgba(0,0,0,0.75)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#fff";
            ctx.font = "50px Arial";
            ctx.fillText("GAME OVER", 280, 230);

            ctx.font = "25px Arial";
            ctx.fillText("Refresh to play again", 290, 280);
        }

        animationId = requestAnimationFrame(loop);
    }

    loop();
}

/* =========================
   FOOTBALL STAR
========================= */

function footballStar(canvas, ctx) {
    setInfo("⚽ Click the ball to shoot! Score as many goals as possible.");

    let score = 0;
    let shots = 0;
    let ballX = 400;
    let ballY = 410;
    let shooting = false;
    let targetX = 400;
    let targetY = 180;

    let keeper = {
        x: 350,
        y: 130,
        width: 100,
        height: 25,
        direction: 3
    };

    canvas.addEventListener("click", function (e) {
        if (shooting) return;

        const rect = canvas.getBoundingClientRect();

        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;

        if (targetY < 100) {
            targetY = 100;
        }

        shooting = true;
        shots++;
    });

    function drawField() {
        ctx.fillStyle = "#168a35";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 4;

        ctx.strokeRect(200, 60, 400, 160);

        ctx.strokeRect(280, 60, 240, 90);

        ctx.fillStyle = "#fff";
        ctx.fillRect(300, 40, 200, 10);
    }

    function drawBall(x, y) {
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#111";
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    function resetBall() {
        ballX = 400;
        ballY = 410;
        shooting = false;
    }

    function loop() {
        if (!gameRunning) return;

        drawField();

        keeper.x += keeper.direction;

        if (keeper.x < 290 || keeper.x > 410) {
            keeper.direction *= -1;
        }

        ctx.fillStyle = "#ffcc00";
        ctx.fillRect(
            keeper.x,
            keeper.y,
            keeper.width,
            keeper.height
        );

        if (shooting) {
            ballX += (targetX - ballX) * 0.08;
            ballY += (targetY - ballY) * 0.08;

            if (Math.abs(ballY - targetY) < 5) {
                const goal =
                    targetX > 300 &&
                    targetX < 500 &&
                    targetY > 50 &&
                    targetY < 150;

                const saved =
                    ballX > keeper.x &&
                    ballX < keeper.x + keeper.width &&
                    ballY < keeper.y + 40;

                if (goal && !saved) {
                    score++;
                }

                setTimeout(resetBall, 500);
            }
        }

        drawBall(ballX, ballY);

        ctx.fillStyle = "#fff";
        ctx.font = "24px Arial";
        ctx.fillText("Goals: " + score, 20, 35);
        ctx.fillText("Shots: " + shots, 650, 35);

        animationId = requestAnimationFrame(loop);
    }

    loop();
}

/* =========================
   WARRIOR QUEST
========================= */

function warriorQuest(canvas, ctx) {
    setInfo("⚔️ Arrow keys = move | SPACE = attack");

    const player = {
        x: 380,
        y: 350,
        width: 40,
        height: 50,
        speed: 5,
        health: 100,
        attacking: false
    };

    const keys = {};
    const enemies = [];

    let score = 0;
    let gameOver = false;

    for (let i = 0; i < 5; i++) {
        enemies.push({
            x: Math.random() * 740,
            y: Math.random() * 300,
            width: 40,
            height: 40,
            health: 30,
            speed: 1.2
        });
    }

    function keyDown(e) {
        keys[e.key] = true;

        if (e.code === "Space") {
            player.attacking = true;

            setTimeout(() => {
                player.attacking = false;
            }, 250);
        }
    }

    function keyUp(e) {
        keys[e.key] = false;
    }

    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    function collision(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    function loop() {
        if (!gameRunning) return;

        ctx.fillStyle = "#182818";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#315531";

        for (let x = 0; x < canvas.width; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }

        for (let y = 0; y < canvas.height; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        if (!gameOver) {
            if (keys["ArrowLeft"] && player.x > 0) {
                player.x -= player.speed;
            }

            if (keys["ArrowRight"] && player.x < 760) {
                player.x += player.speed;
            }

            if (keys["ArrowUp"] && player.y > 0) {
                player.y -= player.speed;
            }

            if (keys["ArrowDown"] && player.y < 440) {
                player.y += player.speed;
            }

            enemies.forEach(enemy => {
                const dx = player.x - enemy.x;
                const dy = player.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance > 1) {
                    enemy.x += (dx / distance) * enemy.speed;
                    enemy.y += (dy / distance) * enemy.speed;
                }

                if (collision(player, enemy)) {
                    player.health -= 0.3;
                }

                if (
                    player.attacking &&
                    Math.abs(player.x - enemy.x) < 70 &&
                    Math.abs(player.y - enemy.y) < 70
                ) {
                    enemy.health -= 1;

                    if (enemy.health <= 0) {
                        enemy.x = Math.random() * 740;
                        enemy.y = Math.random() * 400;
                        enemy.health = 30;
                        score++;
                    }
                }
            });

            if (player.health <= 0) {
                gameOver = true;
            }
        }

        ctx.fillStyle = "#3498db";
        ctx.fillRect(
            player.x,
            player.y,
            player.width,
            player.height
        );

        ctx.fillStyle = "#ffe0bd";
        ctx.beginPath();
        ctx.arc(
            player.x + 20,
            player.y - 5,
            15,
            0,
            Math.PI * 2
        );
        ctx.fill();

        if (player.attacking) {
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 8;
            ctx.beginPath();
            ctx.moveTo(player.x + 20, player.y + 20);
            ctx.lineTo(player.x + 75, player.y - 20);
            ctx.stroke();
        }

        enemies.forEach(enemy => {
            ctx.fillStyle = "#d63031";
            ctx.fillRect(
                enemy.x,
                enemy.y,
                enemy.width,
                enemy.height
            );

            ctx.fillStyle = "#000";
            ctx.fillRect(
                enemy.x,
                enemy.y - 8,
                40,
                5
            );

            ctx.fillStyle = "#00ff00";
            ctx.fillRect(
                enemy.x,
                enemy.y - 8,
                40 * (enemy.health / 30),
                5
            );
        });

        ctx.fillStyle = "#fff";
        ctx.font = "22px Arial";
        ctx.fillText("Score: " + score, 20, 30);
        ctx.fillText(
            "Health: " + Math.max(0, Math.round(player.health)),
            20,
            60
        );

        if (gameOver) {
            ctx.fillStyle = "rgba(0,0,0,0.75)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#fff";
            ctx.font = "50px Arial";
            ctx.fillText("YOU DIED", 300, 230);

            ctx.font = "25px Arial";
            ctx.fillText("Refresh to play again", 290, 280);
        }

        animationId = requestAnimationFrame(loop);
    }

    loop();
}
