"use strict";
//used 'ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);'
//to calculate the centers of each row.
//full_block_height = 101px; overlap = 18px; visible_block_height = 83px;



var ROW0 = 65,
    ROW1 = 148,
    ROW2 = 231,
    ROWSTART = 314,
    ROWWIN = -18,
    crash = false,
    crashCount = 0,
    winCount = 0,
    won = false,
    lost = false,
    rows = [ROW0, ROW1, ROW2],
    explosion;

// Enemies our player must avoid
var Enemy = function(y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = "images/enemy-bug.png";
    this.y = y;
    //Random integer generator found @
    //https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
    //set a random speed for each enemy
    this.speed = randomizer(50, 200);
    //set a random start order for each enemy by placing them
    //off-screen to the left at random distances
    this.x = randomizer(-500, -100);
    // this.checkCollisions = checkCollisions;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if(this.x < 500) {
        //if enemy is on screen, move the emeny
        this.x = this.x + (dt * this.speed);
        } else {
            //else, if enemy is off screeen, restart the enemy
            // with new speed and start location.
            this.x = randomizer(-500, -100);
            this.speed = randomizer(50, 200);
        }
    };

Enemy.prototype.checkCollisions = function() {
    if(this.y == player.y) {
         if(this.x < player.x + 70 && this.x + 70 > player.x) {
            explosion = new Explosion(player.x, player.y);
            crash = true;
        }
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(y) {
    this.sprite = "images/char-boy.png";
    // start player in middle column
    this.x = 202;
    this.y = y;
};

Player.prototype.render = function() {
    //Added 8 to this.y to keep top of player from rendering outsite
    // the top blocks when at top row.
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y + 8);
};

Player.prototype.update = function() {
    if(this.y == ROWWIN) {
        won = true;
    }
    //Keep player on the canvas
    if(this.y < ROWWIN) {
        this.y = ROWWIN;
    }
    if(this.y > ROWSTART) {
        this.y = ROWSTART;
    }
    if(this.x < 0) {
        this.x = 0;
    }
    if(this.x > 404) {
        this.x = 404;
    }
};

Player.prototype.handleInput = function(key) {
    switch(key) {
        case "left":
            this.x -= 101;
            break;
        case "up":
            this.y -= 83;
            break;
        case "right":
            this.x += 101;
            break;
        case "down":
            this.y += 83;
            break;
    }
};

// function checkCollisions() {
//     //find all of the enemies on the row that player currently occupies
//     var enemiesAtPlayerRow = [];
//     if(this.y == player.y) {
//         enemiesAtPlayerRow.push(this);
//     }
//     enemiesAtPlayerRow.forEach(function(e) {
//         // if(e.x - 70 < p.x < e.x + 70) {
//         // if statement from : https://github.com/Ksan8/arcade-game/blob/collision/js/app.js#L153
//         if(e.x < player.x + 70 && e.x + 70 > player.x) {
//             explosion = new Explosion(player.x, player.y);
//             crash = true;
//         }
//     })
// }

function randomizer(min, max) {
    var randomValue = Math.floor(Math.random()*(min) + max);
    return randomValue;
}

//Message obj used for alerts when player wins or loses.
var Message = function(text, fill, line, width, fontSize, x, y) {
    this.text = text;
    this.fill = fill;
    this.line = line;
    this.width = width;
    this.fontSize = fontSize;
    this.text = text;
    this.x = x;
    this.y = y;
};

Message.prototype.render = function() {
    ctx.fillStyle = this.fill;
    ctx.strokeStyle = this.line;
    ctx.lineWidth = this.width;
    ctx.lineJoin = "round";
    ctx.font = this.fontSize;
    ctx.textAlign = "center";
    ctx.strokeText(this.text, this.x, this.y);
    ctx.fillText(this.text, this.x, this.y);
};

var Scoreboard = function() {
    this.score = 0;
};

//object to display score at bottom of screen
Scoreboard.prototype.update = function() {
        this.score += 100;
};

Scoreboard.prototype.render = function() {
    ctx.fillStyle = "white";
    ctx.lineWidth = "0.1";
    ctx.lineJoin = "round";
    ctx.font =  "20pt impact";
    ctx.textAlign = "center";
    ctx.fillText(this.score + " pts", 253, 540);
};

Scoreboard.prototype.getScore = function() {
    return this.score;
};

//object to give visual indication of collision
var Explosion = function(x, y) {
    // Sprite resources:
    // https://scratch.mit.edu/discuss/topic/205929/?page=1#post-2072127
    // http://1.bp.blogspot.com/-h4gHvGnPfH0/UmFUg1riZlI/AAAAAAAAAFU/FGgUImTIGbU/s640/explosjon3.png
    //Adjusted x & y to get spite centered.
    this.x = x - 15;
    this.y = y + 50;
    this.sprite = "images/boom.png";
};

Explosion.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var enemy0 = new Enemy(ROW0),
    enemy1 = new Enemy(ROW1),
    enemy2 = new Enemy(ROW2),
    enemy3 = new Enemy(ROW0),
    enemy4 = new Enemy(ROW1),
    enemy5 = new Enemy(ROW2);

// Place all enemy objects in an array called allEnemies
var allEnemies = [enemy0, enemy1, enemy2, enemy3, enemy4, enemy5];

// Place the player object in a variable called player
var player = new Player(ROWSTART);

var scoreboard = new Scoreboard();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener("keyup", function(e) {
    var allowedKeys = {
        37: "left",
        38: "up",
        39: "right",
        40: "down"
    };

    player.handleInput(allowedKeys[e.keyCode]);
});