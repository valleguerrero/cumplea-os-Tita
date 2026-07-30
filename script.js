const gamesData = [
    { 
        id: 0, 
        title: "1. Puzzle Fotográfico", 
        subtitle: "Completa el puzzle en Jigsaw Planet", 
        letter: "V", 
        type: "external", 
        url: "https://www.jigsawplanet.com/?rc=play&pid=070c5dbdbded" 
    },
    { 
        id: 1, 
        title: "2. Sopa de Letras Avanzada", 
        subtitle: "Completada y verificada", 
        letter: "I", 
        type: "iframe", 
        url: "https://wordwall.net/es/embed/bb134222761b4265aad13ebb1a7ba268?themeId=1&templateId=38&fontStackId=0" 
    },
    { 
        id: 2, 
        title: "3. Tetris Arcade", 
        subtitle: "Juega al Tetris táctil optimizado para móvil", 
        letter: "D", 
        type: "external", 
        url: "https://tetris.com/play-tetris" // Versión oficial web móvil perfecta y fluida
    },
    { 
        id: 3, 
        title: "4. Comecocos (Pac-Man)", 
        subtitle: "Juega al Pac-Man táctil optimizado para móvil", 
        letter: "E", 
        type: "external", 
        url: "https://www.google.com/logos/2010/pacman10-i.html" // Versión clásica de Google optimizada para pantallas táctiles
    },
    { 
        id: 4, 
        title: "5. Tres en Raya Desafiante", 
        subtitle: "Derrota a la IA avanzada (Modo Difícil)", 
        letter: "O",
        type: "tictactoe" // Este se queda integrado en la web porque funciona genial al tacto
    }
];

let unlocked = [false, false, false, false, false];

document.addEventListener("DOMContentLoaded", () => {
    const slotsContainer = document.getElementById("letter-slots-container");
    const gridContainer = document.getElementById("games-grid");

    gamesData.forEach((game, index) => {
        slotsContainer.innerHTML += `<div class="letter-slot" id="slot-${index}">?</div>`;
        gridContainer.innerHTML += `
            <div class="game-item" id="game-card-${index}">
                <div class="game-info">
                    <h3>${game.title}</h3>
                    <p>${game.subtitle}</p>
                </div>
                <button class="btn-primary" onclick="openGame(${index})">Jugar</button>
            </div>
        `;
    });
});

function goToMenu() {
    document.getElementById("welcome-view").classList.add("hidden");
    document.getElementById("menu-view").classList.remove("hidden");
}

function openGame(index) {
    const modal = document.getElementById("game-modal");
    const title = document.getElementById("modal-title");
    const body = document.getElementById("modal-body");
    modal.classList.add("active");
    title.innerText = gamesData[index].title;

    const game = gamesData[index];

    if (game.type === "iframe") {
        // Sopa de letras integrada
        body.innerHTML = `
            <p style="font-size: 0.85rem; margin-bottom: 8px; color: #78909c;">Resuelve el reto directamente aquí abajo:</p>
            <iframe src="${game.url}" style="width:100%; height:350px; border:none; border-radius:10px;" allowfullscreen></iframe>
            <button class="btn-primary" onclick="winGame(${index})" style="background:#66bb6a; margin-top:12px;">¡Reto Superado y Verificado!</button>
        `;
    } else if (game.type === "external") {
        // Puzzle, Tetris y Pac-Man optimizados para abrirse en móvil de forma impecable
        body.innerHTML = `
            <p style="margin-bottom: 15px;">Haz clic en el botón para abrir el juego en una pestaña nueva con controles táctiles perfectos:</p>
            <a href="${game.url}" target="_blank" class="btn-primary" style="display:inline-block; margin-bottom:20px; text-decoration:none;">Jugar en Pestaña Nueva ↗</a>
            <hr style="border:0; border-top:1px solid #eee; margin:15px 0;">
            <p style="font-size: 0.85rem; color: #78909c; margin-bottom: 10px;">¿Ya lo has superado?</p>
            <button id="verify-btn-${index}" class="btn-primary" onclick="verifyExternalGame(${index})" style="background:#b0bec5; cursor:not-allowed;" disabled>Completa el reto primero...</button>
        `;

        setTimeout(() => {
            const btn = document.getElementById(`verify-btn-${index}`);
            if (btn) {
                btn.style.background = "#66bb6a";
                btn.style.cursor = "pointer";
                btn.removeAttribute("disabled");
                btn.innerText = "¡Ya he superado el reto! Validar Letra";
            }
        }, 10000); // 10 segundos de seguridad obligatorios

    } else if (game.type === "tictactoe") {
        // Tres en Raya táctil integrado
        body.innerHTML = `
            <p>La máquina juega en <b>modo inteligente</b>. ¡Demuestra que puedes ganarle!</p>
            <div class="tictactoe-board" id="hard-ttt" style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px; max-width:200px; margin:15px auto;">
                <div class="ttt-cell" onclick="hardTttClick(0)"></div>
                <div class="ttt-cell" onclick="hardTttClick(1)"></div>
                <div class="ttt-cell" onclick="hardTttClick(2)"></div>
                <div class="ttt-cell" onclick="hardTttClick(3)"></div>
                <div class="ttt-cell" onclick="hardTttClick(4)"></div>
                <div class="ttt-cell" onclick="hardTttClick(5)"></div>
                <div class="ttt-cell" onclick="hardTttClick(6)"></div>
                <div class="ttt-cell" onclick="hardTttClick(7)"></div>
                <div class="ttt-cell" onclick="hardTttClick(8)"></div>
            </div>
            <p id="ttt-status" style="font-size:0.85rem; color:#78909c;">Tu turno (X)</p>
        `;
        window.hardBoard = ["", "", "", "", "", "", "", "", ""];
        window.hardTurn = true;
    }
}

function verifyExternalGame(index, question) {
    if (confirm(question)) {
        // Cierra la ventana emergente (modal) de los juegos al instante
        closeGame();
        
        // Vuelve a la vista del menú principal de forma automática y suave
        document.getElementById("welcome-view").classList.add("hidden");
        document.getElementById("menu-view").classList.remove("hidden");
        
        // Registra la letra y comprueba si se ha completado el juego entero
        winGame(index);
    }
}

function closeGame() {
    document.getElementById("game-modal").classList.remove("active");
}

function winGame(index) {
    if (!unlocked[index]) {
        unlocked[index] = true;
        const game = gamesData[index];
        
        const slot = document.getElementById(`slot-${index}`);
        slot.classList.add("unlocked");
        slot.innerText = game.letter;

        const card = document.getElementById(`game-card-${index}`);
        card.classList.add("completed");
        card.querySelector("button").innerText = "¡Superado!";

        closeGame();
        alert(`¡Enhorabuena! Has conseguido la letra: ${game.letter}`);

        if (unlocked.every(v => v === true)) {
            document.getElementById("final-section").classList.remove("hidden");
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        }
    }
}

// --- TRES EN RAYA AVANZADO (IA Inteligente) ---
function hardTttClick(idx) {
    if (window.hardBoard[idx] === "" && window.hardTurn) {
        window.hardBoard[idx] = "X";
        document.getElementById("hard-ttt").children[idx].innerText = "X";
        window.hardTurn = false;

        if (checkHardWin("X")) {
            setTimeout(() => winGame(4), 300);
            return;
        }

        setTimeout(() => {
            if (unlocked[4]) return;

            let bestMove = findBestAiMove();
            if (bestMove !== null) {
                window.hardBoard[bestMove] = "O";
                document.getElementById("hard-ttt").children[bestMove].innerText = "O";

                if (checkHardWin("O")) {
                    alert("¡La máquina te ha ganado por poco! Vuelve a intentarlo.");
                    openGame(4);
                }
            }
            window.hardTurn = true;
        }, 400);
    }
}

function findBestAiMove() {
    let emptyCells = window.hardBoard.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    if (emptyCells.length === 0) return null;

    for (let i of emptyCells) {
        window.hardBoard[i] = "O";
        if (checkHardWin("O")) {
            window.hardBoard[i] = "";
            return i;
        }
        window.hardBoard[i] = "";
    }

    for (let i of emptyCells) {
        window.hardBoard[i] = "X";
        if (checkHardWin("X")) {
            window.hardBoard[i] = "";
            return i;
        }
        window.hardBoard[i] = "";
    }

    if (window.hardBoard[4] === "") return 4;

    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function checkHardWin(player) {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    return wins.some(c => c.every(i => window.hardBoard[i] === player));
}

function checkSecret() {
    const val = document.getElementById("secret-input").value.trim().toUpperCase();
    if (val === "VIDEO") {
        document.getElementById("menu-view").classList.add("hidden");
        document.getElementById("video-view").classList.remove("hidden");
        window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
        alert("Código incorrecto. Reúne las letras de los 5 juegos para formar la palabra secreta (V-I-D-E-O).");
    }
}