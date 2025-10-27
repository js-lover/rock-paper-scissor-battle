const gameArea = document.getElementById("gameArea");
const playButton = document.getElementById("playButton");
let allObjects = [];

playButton.addEventListener("click", handlePlay);

function handlePlay() {
    allObjects = [];
    gameArea.innerHTML = "";

    const objects = {
        rock: Number(document.getElementById("rock-number").value),
        paper: Number(document.getElementById("paper-number").value),
        scissor: Number(document.getElementById("scissor-number").value),
    };

    const objSize = 40;
    const areaWidth = gameArea.clientWidth;
    const areaHeight = gameArea.clientHeight;

    function createObjects(type, count) {
        for (let i = 0; i < count; i++) {
            const obj = {
                type,
                x: Math.random() * (areaWidth - objSize),
                y: Math.random() * (areaHeight - objSize),
                dx: (Math.random() - 0.5) * 4,
                dy: (Math.random() - 0.5) * 4,
                element: null
            };

            const el = document.createElement("div");
            el.classList.add("object", type);
            el.textContent = type;
            gameArea.appendChild(el);
            obj.element = el;
            el.style.transform = `translate(${obj.x}px, ${obj.y}px)`;

            allObjects.push(obj);
        }
    }

    createObjects("rock", objects.rock);
    createObjects("paper", objects.paper);
    createObjects("scissor", objects.scissor);

    update();
}

function isColliding(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx*dx + dy*dy) < 40;
}

function getLoser(a, b) {
    if (a.type === b.type) return null;
    if (a.type === "rock" && b.type === "paper") return a;
    if (a.type === "rock" && b.type === "scissor") return b;
    if (a.type === "paper" && b.type === "scissor") return a;
    if (a.type === "paper" && b.type === "rock") return b;
    if (a.type === "scissor" && b.type === "rock") return a;
    if (a.type === "scissor" && b.type === "paper") return b;
}

function update() {
    const width = gameArea.clientWidth;
    const height = gameArea.clientHeight;

    let rockCount = 0, paperCount = 0, scissorCount = 0;

    for (let i = allObjects.length - 1; i >= 0; i--) {
        const obj = allObjects[i];
        obj.x += obj.dx;
        obj.y += obj.dy;

        if (obj.x <= 0 || obj.x >= width - 40) obj.dx *= -1;
        if (obj.y <= 0 || obj.y >= height - 40) obj.dy *= -1;

        obj.element.style.transform = `translate(${obj.x}px, ${obj.y}px)`;

        for (let j = i - 1; j >= 0; j--) {
            const other = allObjects[j];
            if (isColliding(obj, other)) {
                const loser = getLoser(obj, other);
                if (loser) {
                    loser.element.remove();
                    allObjects.splice(allObjects.indexOf(loser), 1);
                } else {
                    obj.dx *= -1; obj.dy *= -1;
                    other.dx *= -1; other.dy *= -1;
                }
            }
        }

        if (obj.type === "rock") rockCount++;
        if (obj.type === "paper") paperCount++;
        if (obj.type === "scissor") scissorCount++;
    }

    // Kalan türleri say
    const typesRemaining = [
        {type: "rock", count: rockCount},
        {type: "paper", count: paperCount},
        {type: "scissor", count: scissorCount}
    ].filter(t => t.count > 0);

    if (typesRemaining.length <= 1) {
        if (typesRemaining.length === 1) {
            alert(`${typesRemaining[0].type} kazandı!`);
        } else {
            alert("Berabere!");
        }
        return;
    }

    // İki tür kaldıysa kazananı belirle
    if (typesRemaining.length === 2) {
        const [t1, t2] = typesRemaining;
        let winnerType = null;

        if ((t1.type === "rock" && t2.type === "scissor") || (t2.type === "rock" && t1.type === "scissor")) {
            winnerType = "rock";
        } else if ((t1.type === "scissor" && t2.type === "paper") || (t2.type === "scissor" && t1.type === "paper")) {
            winnerType = "scissor";
        } else if ((t1.type === "paper" && t2.type === "rock") || (t2.type === "paper" && t1.type === "rock")) {
            winnerType = "paper";
        }

        if (winnerType) {
            alert(`${winnerType} kazandı!`);
            return;
        } else {
            alert("Berabere!");
            return;
        }
    }

    requestAnimationFrame(update);
}
