```javascript
function playGame(gameName) {
    alert("🎮 " + gameName + " is starting soon!");
}

/* Game search */

const searchInput = document.getElementById("searchInput");
const gameCards = document.querySelectorAll(".game-card");

searchInput.addEventListener("input", function () {

    const searchText = searchInput.value.toLowerCase();

    gameCards.forEach(function(card) {

        const gameName = card.querySelector("h3").textContent.toLowerCase();

        if (gameName.includes(searchText)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });

});
```
