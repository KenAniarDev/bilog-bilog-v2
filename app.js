const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 500
canvas.height = 600

// CONSTANT
const COLORS = [
    "#5554A2",
    "#E31E70",
    "#3E889D",
    "#6231A4",
    "#87049E"
]


// PLAYER
const PLAYER_X = canvas.width / 2
const PLAYER_Y = canvas.height
const PLAYER_RADIUS = 20
const PLAYER_COLOR =  '#79D65A'
const PLAYER_VELOCITY = { x: 0, y: 0 }
const PLAYER_SPEED = 5

// BULLET
const BULLET_X = canvas.width / 2
const BULLET_Y = canvas.height
const BULLET_RADIUS = 5
const BULLET_COLOR =  '#F1226A'
const BULLET_VELOCITY = { x: 0, y: 0 }
const BULLET_SPEED = 2

// ENEMY
const ENEMY_X = 24
const ENEMY_Y = 20
const ENEMY_RADIUS = 20
const ENEMY_COLOR =  '#F1226A'
const ENEMY_VELOCITY = { x: 0, y: 0 }
const ENEMY_SPEED = 2

// States
const bullets = []
const enemies = []

// Utility Functions
function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

// Player Class
class Player {
    constructor(x, y, radius, color, velocity, speed){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
    }
    update() {
        this.draw()
        this.x += this.velocity.x
        this.y += this.velocity.y
        detectWalls(this)
    }
}
// Projectile Class
class Bullet {
    constructor(x, y, radius, color, velocity, speed){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
    }
    update() {
        this.draw()
        this.x += this.velocity.x
        this.y += -2
    }
}
// Enemy Class
class Enemy {
    constructor(x, y, radius, color, velocity, speed){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
    }
    update() {
        this.draw()
        this.x += this.velocity.x
        this.y += this.velocity.y
    }
}


// Initialize Player
const player = new Player(PLAYER_X, PLAYER_Y, PLAYER_RADIUS, PLAYER_COLOR, PLAYER_VELOCITY, PLAYER_SPEED)

// Generate Enemies
function generateEnemies() {
    for(let i = 1; i < 8; i++){
        const color = COLORS[
            Math.floor(Math.random() * COLORS.length - 1)
        ]
        const enemy = new Enemy((ENEMY_X + ENEMY_RADIUS * 2) * i, ENEMY_Y + ENEMY_RADIUS, ENEMY_RADIUS, color, ENEMY_VELOCITY, ENEMY_SPEED)
        enemies.push(enemy)
    }
}

let animationId = undefined
// Animate Canvas
function animate() {
    animationId = requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    player.update()


    
    bullets.forEach((bullet, i) => {
        bullet.update()
        if(bullet.y < 0) {
            setTimeout(() => {
                bullets.splice(i, 1)

            }, 0)
        }
    })

    enemies.forEach((enemy, i_enemy) => {
        enemy.draw()

        const enemy_player_distance = Math.hypot(
            player.x - enemy.x,
            player.y - enemy.y    
        )
        if(enemy_player_distance - enemy.radius - player.radius + (PLAYER_SPEED * 2) < 1) {
            cancelAnimationFrame(animationId)
            alert('Game Over')
            location.reload();
        }

         // Check collision between projectile and enemy
         bullets.forEach((bullet, i_bullet) => {
            const enemy_bullet_distance = Math.hypot(
                bullet.x - enemy.x,
                bullet.y - enemy.y    
            )
            // Object Collides
            if(enemy_bullet_distance - enemy.radius - bullet.radius < 1) {
                setTimeout(() => {
                    enemies.splice(i_enemy, 1)
                    bullets.splice(i_bullet, 1)     
                    if(enemies.length === 0) {
                        alert('You Won')
                        location.reload();
                    }               
                }, 0);
            }
        })
    })

   
}
function detectWalls(object) {
    // left wall
    if(object.x < 0) {
        object.x = 0
    }
    // Right wall
    if(object.x + object.radius >  canvas.width) {
        object.x = canvas.width - object.radius
    }
    // Top wall
    if(object.y < 0) {
        object.y = 0
    }
    // Bottom wall
    if(object.y + object.radius >  canvas.height) {
        object.y = canvas.height - object.radius
    }
}

function moveRight(){
    player.velocity.x = PLAYER_SPEED
}
function moveLeft(){
    player.velocity.x = -PLAYER_SPEED
}
function moveUp(){
    player.velocity.y = -PLAYER_SPEED
}
function moveDown(){
    player.velocity.y = PLAYER_SPEED
}
function keyDown(e) {
    if(e.key === 'ArrowRight' || e.key === 'Right') {
        moveRight()
    }else if(e.key === 'ArrowLeft' || e.key === 'Left') {
        moveLeft()
    }else if(e.key === 'ArrowUp' || e.key === 'Up') {
        moveUp()
    }else if(e.key === 'ArrowDown' || e.key === 'Down') {
        moveDown()
    }else if(e.keyCode === 32) {
        // Fire Bullets
        bullets.push(new Bullet(player.x, player.y - PLAYER_RADIUS, BULLET_RADIUS, BULLET_COLOR, BULLET_VELOCITY, BULLET_SPEED))
    }
}
function keyUp(e) {
    if(
        e.key === 'ArrowRight' ||
        e.key === 'Right' ||
        e.key === 'ArrowLeft' ||
        e.key === 'Left' ||
        e.key === 'ArrowUp' ||
        e.key === 'Up' ||
        e.key === 'ArrowDown' ||
        e.key === 'Down'
    ){
        player.velocity.x = 0
        player.velocity.y = 0
    }
}

document.addEventListener('keydown', keyDown)
document.addEventListener('keyup', keyUp)

generateEnemies()
animate()
