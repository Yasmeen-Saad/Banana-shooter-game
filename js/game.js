const canvas = document.getElementById('gamecanvas');
const context = canvas.getContext('2d');

let bananas = [];
let bombs = [];
let bullets = [];
let score = 0;
let timer = 180;
let gameover = false;

const monkey = { x: canvas.width / 2, y: canvas.height - 85, width: 85, height: 85 };
const monkeyImg = new Image();
const monkeyImg2 = new Image();
monkeyImg.src = '../images/monkey_armsup_happy.png';
monkeyImg2.src = '../images/monkey_armsup.png';
monkeyImg.onerror = () => {
    console.error('Failed to load monkey image.');
};

const bananaImg = new Image();
bananaImg.onerror = () => {
    console.error('Failed to load banana image.');
};

bananaImg.src = '../images/fruit_banana_100.png';
const bombImg = new Image();
bombImg.onerror = () => {
    console.error('Failed to load bomb image.');
};

bombImg.src = '../images/bomb_red.png';


let currentMonkeyImg = monkeyImg;
let keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ') {
        currentMonkeyImg = monkeyImg2;
        bullets.push({ x: monkey.x + monkey.width / 2 - 5, y: monkey.y, width: 15, height: 15});
        setTimeout(() => {
            currentMonkeyImg = monkeyImg;
        }, 200);
    } 
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function moveMonkey() {
    if (keys['ArrowLeft'] && monkey.x > 0) monkey.x -= 5;
    if (keys['ArrowRight'] && monkey.x < canvas.width - monkey.width) monkey.x += 5;
}

let bananaRows = 0;
let bombRows = 0;

function addRandomRow() {
    const elementsPerRow = 9;
    const spacing = canvas.width / elementsPerRow;

    for (let i = 0; i < elementsPerRow; i++) {
        if (Math.random() < 0.7) {
            bananas.push({ x: i * spacing, y: -60, width: 60, height: 60 });
        } else {
            bombs.push({ x: i * spacing, y: -60, width: 60, height: 60 });
        }
    }
}

function incrementRows() {
    bananas.forEach(banana => {
        banana.y += 60;
    });
    bombs.forEach(bomb => {
        bomb.y += 60;
    });
}

let id1 = setInterval(addRandomRow, 3000);
let id2 = setInterval(incrementRows, 3000);

function drawObjects() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(currentMonkeyImg, monkey.x, monkey.y, monkey.width, monkey.height);

    bananas.forEach((banana) => {
        context.drawImage(bananaImg, banana.x, banana.y, banana.width, banana.height);
    });

    bombs.forEach((bomb) => {
        context.drawImage(bombImg, bomb.x, bomb.y, bomb.width, bomb.height);
    });

    bullets.forEach((bullet, index) => {
        context.fillStyle = 'rgb(255, 119, 0)';
        context.beginPath();
        context.arc(bullet.x, bullet.y, bullet.width / 2, 0, Math.PI * 2);
        context.fill();
        bullet.y -= 5;
    });
}

function checkCollision() {
    bullets.forEach((bullet, bulletIndex) => {
        bananas.forEach((banana, bananaIndex) => {
            if (bullet.x < banana.x + banana.width && bullet.x + bullet.width > banana.x && 
                bullet.y < banana.y + banana.height && bullet.y + bullet.height > banana.y) {
                bananas.splice(bananaIndex, 1);
                bullets.splice(bulletIndex, 1);
                score++;
                document.getElementById('score').textContent = score;
            }
        });

        bombs.forEach((bomb, bombIndex) => {
            if (bullet.x < bomb.x + bomb.width && bullet.x + bullet.width > bomb.x && 
                bullet.y < bomb.y + bomb.height && bullet.y + bullet.height > bomb.y) {
                bombs.splice(bombIndex, 1);
                bullets.splice(bulletIndex, 1);
                const spacing = canvas.width / 9;
                const bombX = bomb.x;
                const bombY = bomb.y;

                bananas = bananas.filter(banana => {
                    const distance = Math.sqrt(
                        Math.pow(banana.x - bombX, 2) + 
                        Math.pow(banana.y - bombY, 2)
                    );
                    return distance > spacing;
                });
                bombs = bombs.filter(b => {
                    const distance = Math.sqrt(
                        Math.pow(b.x - bombX, 2) + 
                        Math.pow(b.y - bombY, 2)
                    );
                    return distance > spacing;
                });
            }
        });
    });

    function showGameOver() {
        context.fillStyle = 'rgb(255, 119, 0)';
        context.font = 'bold 60px Arial';
        context.textAlign = 'center';
        context.fillText('Game Over!', canvas.width/2 - 50, canvas.height/2 - 30);
        context.font = '24px Arial';
        context.fillText(`Final Score: ${score}`, canvas.width/2 - 50, canvas.height/2 + 30);
        clearInterval(id1);
        clearInterval(id2);
        gameover = true;
    }

    bombs.forEach((bomb, bombIndex) => {
        if (bomb.x < monkey.x + monkey.width && bomb.x + bomb.width > monkey.x && 
            bomb.y < monkey.y + monkey.height && bomb.y + bomb.height > monkey.y) {
            showGameOver();
        }
    })
    bananas.forEach((banana, bananaIndex) => {
        if (banana.x < monkey.x + monkey.width && banana.x + banana.width > monkey.x && 
            banana.y < monkey.y + monkey.height && banana.y + banana.height > monkey.y) {
            showGameOver();
        }
    })
}

function showWin() {
    if(score == 20){
        context.fillStyle = 'rgb(255, 119, 0)';
        context.font = 'bold 60px Arial';
        context.textAlign = 'center';
        context.fillText('You Win!', canvas.width/2 - 50, canvas.height/2 - 30);
        clearInterval(id1);
        clearInterval(id2);
        gameover = true;
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
function updateTimer() {
    if(!gameover){
        timer--;
    }
    document.getElementById('timer').textContent = formatTime(timer);
    if (timer <= 0) {
        showGameOver();
    }
}
setInterval(updateTimer, 1000);

function gameLoop() { 
    drawObjects();
    moveMonkey();
    checkCollision();
    showWin();
    requestAnimationFrame(gameLoop);
}

document.querySelector('.start').addEventListener('click', () => {
    document.getElementById("pop").style.display = 'none';
});
document.querySelector('.close').addEventListener('click', () => {
    window.location.replace("http://127.0.0.1:5500/index.html?");
})
 
currentMonkeyImg.onload = () => {
    bananaImg.onload = () => {
        bombImg.onload = () => {
            gameLoop();
        };
    };
};
