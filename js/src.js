(function() {
    var enemyImage = new Image(),
        avatarImage = new Image();
    avatarImage.src = "images/hero.png";
    enemyImage.src = "images/vampire.png";
    avatarImage.avatarX = 0;
    avatarImage.avatarY = 0;
    var setUpGame = {
        gameCanvas: document.getElementById("gameCanvas"),
        gameOver: document.getElementById("gameOver"),
        gameScore: document.getElementById("gameScore"),
        pauseGameBtn: document.getElementById("end-game"),
        resumeGameBtn: document.getElementById("resume-game"),
        startGameBtn: document.getElementById("start-game"),
        intro: document.getElementById("intro"),
        canvasWidth: this.gameCanvas.width,
        canvasHeight: this.gameCanvas.height,
        enemyPositionX: [],
        enemyPositionY: [],
        enemyY: 0,
        score: 0,
        bestScore: function() {
            return (localStorage.getItem("bestScore")) ? localStorage.getItem("bestScore") : 0;
        },
        mainScreen: function() {
            this.pauseGameBtn.style.display = "none";
            this.resumeGameBtn.style.display = "none";
            this.startGameBtn.style.display = "block";
            this.gameScore.style.display = "none";
            this.playGameobj("START GAME", 250, 175, 175);
            var gameCanva = this.gameCanvas;
            gameCanva.getContext("2d").font = "26px Patua One";
            gameCanva.getContext("2d").textBaseline = "top";
            gameCanva.getContext("2d").fillStyle = "black";
            var title = "Escape from enemies";
            gameCanva.getContext("2d").fillText(title, 15, 10);
            // gameCanva.getContext("2d").beginPath();
            gameCanva.getContext("2d").moveTo(15, 50);
            gameCanva.getContext("2d").lineTo(585, 50);
            gameCanva.getContext("2d").stroke();
            gameCanva.getContext("2d").font = "20px Patua One";
            gameCanva.getContext("2d").fillStyle = "black";
            var intro = "Stay away from enemies as long as possible to score high";
            gameCanva.getContext("2d").fillText(intro, 20, 70);
        },
        playGameobj: function(btnDispTxt, topPos, leftPos, rightPos) {
            var startGameBtn = this.startGameBtn;
            startGameBtn.width = startGameBtn.width;
            startGameBtn.getContext("2d").font = "25px Patua One";
            startGameBtn.getContext("2d").textBaseline = "top";
            startGameBtn.getContext("2d").fillStyle = "white";
            startGameBtn.getContext("2d").fillText(btnDispTxt, 15, 10);
            startGameBtn.style.top = topPos + "px";
            startGameBtn.style.left = leftPos + "px";
            startGameBtn.style.right = rightPos + "px";
            startGameBtn.addEventListener("click", gameControls.initGame);
        },
        scoreGameObj: function() {
            var gameScore = this.gameScore;
            gameScore.getContext("2d").font = "26px Patua One";
            gameScore.getContext("2d").textBaseline = "top";
            gameScore.getContext("2d").fillStyle = "yellow";
            gameScore.getContext("2d").fillText("Score: " + setUpGame.score, 15, 10);
        },
        pauseGameObj: function() {
            var pauseGameBtn = this.pauseGameBtn;
            pauseGameBtn.getContext("2d").font = "25px Patua One";
            pauseGameBtn.getContext("2d").textBaseline = "top";
            pauseGameBtn.getContext("2d").fillStyle = "white";
            pauseGameBtn.getContext("2d").fillText("|| PAUSE GAME", 15, 10);
            pauseGameBtn.addEventListener("click", gameControls.pauseGame);
        },
        resumeGameObj: function() {
            var resumeGameBtn = this.resumeGameBtn;
            resumeGameBtn.getContext("2d").font = "25px Patua One";
            resumeGameBtn.getContext("2d").textBaseline = "top";
            resumeGameBtn.getContext("2d").fillStyle = "white";
            resumeGameBtn.getContext("2d").fillText("RESUME GAME", 15, 10);
            resumeGameBtn.addEventListener("click", gameControls.resumeGame);
        },
        gameOverObj: function() {
            this.gameScore.style.display = "none";
            var gameOver = this.gameOver;
            gameOver.width = gameOver.width;
            gameOver.getContext("2d").font = "30px Patua One";
            gameOver.getContext("2d").textBaseline = "top";
            gameOver.getContext("2d").fillStyle = "red";
            gameOver.getContext("2d").fillText("Game Over", 70, 10);
            gameOver.getContext("2d").font = "18px Patua One";
            gameOver.getContext("2d").fillStyle = "black";
            gameOver.getContext("2d").fillText("You hit an enemy", 75, 50);
            gameOver.getContext("2d").font = "24px Patua One";
            gameOver.getContext("2d").fillStyle = "blue";
            gameOver.getContext("2d").fillText("Your Score is " + setUpGame.score, 60, 80);
        },
        // create enemies Coordinates x and Y axis
        enemiesCreate: {
            enemyPositionOffStartX: 5,
            enemyPositionOffEndX: 5,
            incrementX: 31,
            calculateX: function() {
                var enemyPosition = [this.enemyPositionOffStartX],
                    currentPos = 0,
                    enemyPositionEnd = setUpGame.canvasWidth - this.enemyPositionOffEndX;
                while (enemyPosition[currentPos] < enemyPositionEnd) {
                    var nextPos = currentPos + 1;
                    enemyPosition[nextPos] = this.enemyPositionOffStartX + (this.incrementX * (nextPos));
                    currentPos = nextPos;
                }
                enemyPosition.pop(); //removes lastElement
                return enemyPosition;
            },
            calculateY: function() {
                var totalEnemies = (setUpGame.enemiesCreate.calculateX()).length,
                    enemyPositionY = [],
                    currentY = 0;
                while (currentY < totalEnemies) {
                    enemyPositionY[currentY] = -(Math.round(Math.random() * setUpGame.canvasHeight));
                    currentY = currentY + 1;
                }
                return enemyPositionY;
            }
        },
        handleMouseMove: function(event) {
            //event.offsetX is not working in Firefox
            avatarImage.avatarX = (event.offsetX) == undefined ? event.layerX : event.offsetX;
            avatarImage.avatarY = (event.offsetY) == undefined ? event.layerY : event.offsetY;
        },
        handleKeyMovements: function(event) {
            var gameCanvas = setUpGame.gameCanvas;
            switch (event.keyCode) {
                case 37:
                    avatarImage.avatarX -= 30;
                    break;
                case 38:
                    avatarImage.avatarY -= 30;
                    break;
                case 39:
                    avatarImage.avatarX += 30;
                    break;
                case 40:
                    avatarImage.avatarY += 30;
            }
        },
        handleTick: function() {
            var gameCanvas = this.gameCanvas,
                avatarX = avatarImage.avatarX,
                avatarY = avatarImage.avatarY,
                enemyPositionY = setUpGame.enemyPositionY,
                enemyPositionX = setUpGame.enemyPositionX,
                score = setUpGame.score,
                bestScore = setUpGame.bestScore;
            gameCanvas.width = setUpGame.canvasWidth;
            gameCanvas.getContext("2d").drawImage(avatarImage, avatarImage.avatarX, avatarImage.avatarY);
            var totalEnemies = enemyPositionX.length;
            var currentEnemyNumber = 0;
            if (totalEnemies != 0) {
                while (currentEnemyNumber < totalEnemies) {
                    enemyPositionY[currentEnemyNumber] = enemyPositionY[currentEnemyNumber] + 1;
                    if (enemyPositionY[currentEnemyNumber] <= setUpGame.canvasHeight) {
                        gameCanvas.getContext("2d").drawImage(enemyImage, enemyPositionX[currentEnemyNumber], enemyPositionY[currentEnemyNumber]);
                    } else {
                        var newenemyY = -(Math.round(Math.random() * setUpGame.canvasHeight));
                        enemyPositionY[currentEnemyNumber] = newenemyY;
                        gameCanvas.getContext("2d").drawImage(enemyImage, enemyPositionX[currentEnemyNumber], enemyPositionY[currentEnemyNumber]);
                    }
                    if (((avatarX < enemyPositionX[currentEnemyNumber] && enemyPositionX[currentEnemyNumber] < avatarX + avatarImage.width) || (enemyPositionX[currentEnemyNumber] < avatarX && avatarX < enemyPositionX[currentEnemyNumber] + avatarImage.width)) && ((avatarY < enemyPositionY[currentEnemyNumber] && enemyPositionY[currentEnemyNumber] < avatarY + avatarImage.height) || (enemyPositionY[currentEnemyNumber] < avatarY && avatarY < enemyPositionY[currentEnemyNumber] + avatarImage.height))) {
                        if (score > parseInt(bestScore)) {
                            setUpGame.bestScore = score;
                            alert("New record.Your best score is " + setUpGame.bestScore);
                            localStorage.setItem("bestScore", setUpGame.bestScore);
                        }
                        gameControls.endGame();
                    }
                    currentEnemyNumber = currentEnemyNumber + 1;
                }
                setUpGame.score = score + 1;
                this.gameScore.width = this.gameScore.width;
                setUpGame.scoreGameObj();
            }
        }
    }
    var gameControls = (function() {
        var setGamePlay;
        var running = false;

        function setGamePlayFn() {
            if (running == false) {
                setGamePlay = setInterval(setUpGame.handleTick, 4);
                running = true;
            }
        }
        return {
            initGame: function() {
                setUpGame.enemyPositionX = setUpGame.enemiesCreate.calculateX();
                setUpGame.enemyPositionY = setUpGame.enemiesCreate.calculateY();
                setUpGame.score = 0;
                (setUpGame.gameOver).style.display = "none";
                (setUpGame.gameScore).style.display = "block";
                (setUpGame.pauseGameBtn).style.display = "block";
                (setUpGame.resumeGameBtn).style.display = "none";
                (setUpGame.startGameBtn).style.display = "none";
                // setUpGame.playGameobj("RESTART GAME", 400, 50, 25);
                setUpGame.pauseGameObj();
                setUpGame.resumeGameObj();
                (setUpGame.gameCanvas).addEventListener("mousemove", setUpGame.handleMouseMove);
                document.addEventListener("keydown", setUpGame.handleKeyMovements);
                setGamePlayFn();
            },
            pauseGame: function() {
                clearInterval(setGamePlay);
                (setUpGame.pauseGameBtn).style.display = "none";
                (setUpGame.resumeGameBtn).style.display = "block";
                //setUpgame.resumeGameBtn();
                running = false;
            },
            resumeGame: function() {
                setGamePlayFn();
                (setUpGame.resumeGameBtn).style.display = "none";
                (setUpGame.pauseGameBtn).style.display = "block";
                setUpgame.pauseGameObj();
            },
            endGame: function() {
                setUpGame.enemyPositionX = [];
                setUpGame.enemyPositionY = [];
                setUpGame.playGameobj("TRY AGAIN", 290, 190, 0);
                (setUpGame.pauseGameBtn).style.display = "none";
                (setUpGame.resumeGameBtn).style.display = "none";
                (setUpGame.startGameBtn).style.display = "block";
                setUpGame.gameOverObj();
                (setUpGame.gameOver).style.display = "blocK";
                setUpGame.score = 0;
            }
        }
    })();
    setUpGame.mainScreen();
    // gameControls.initGame();
})();
