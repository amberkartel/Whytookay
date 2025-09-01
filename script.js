// ------------------- Paystack -------------------
const payButton = document.getElementById('payButton');

payButton.addEventListener('click', () => {
  let handler = PaystackPop.setup({
    key: 'pk_live_b74b2d92842a32feda36c2d4cd98dc50d2944c12',
    email: 'customer@email.com',
    amount: 1000000, // ₦10,000
    currency: 'NGN',
    ref: '' + Math.floor((Math.random() * 1000000000) + 1),
    callback: function(response){
      alert('Payment successful! Ref: ' + response.reference);
    },
    onClose: function(){
      alert('Transaction not completed.');
    }
  });
  handler.openIframe();
});

// ------------------- Floating + 3D -------------------
const floats = document.querySelectorAll('.float');
const floatOffsets = [];
floats.forEach(el => {
  floatOffsets.push({x: Math.random()*window.innerWidth, y: Math.random()*window.innerHeight});
  el.style.left = floatOffsets[floatOffsets.length-1].x + "px";
  el.style.top = floatOffsets[floatOffsets.length-1].y + "px";
  el.style.width = (30 + Math.random()*50) + "px"; // random sizes 30-80
});

let floatStep = 0;

function animateFloats() {
  floatStep += 0.02;
  floats.forEach((el, i) => {
    const floatY = Math.sin(floatStep + i) * 10;
    const mouseX = 0; // can add subtle mouse effect later
    const mouseY = 0;
    el.style.transform = `translateY(${floatY}px) translateX(${mouseX}px) rotateY(${floatStep*5}deg) rotateX(${floatStep*3}deg)`;
  });
  requestAnimationFrame(animateFloats);
}
animateFloats();

// ------------------- Dino Mini Game -------------------
const canvas = document.getElementById('dinoGame');
const ctx = canvas.getContext('2d');

let dino = { x:50, y:150, width:20, height:20, dy:0, gravity:0.6, jump: -12 };
let obstacles = [];
let gameSpeed = 4;
let score = 0;
let gameOver = false;

// Jump on space
document.addEventListener('keydown', (e) => {
  if(e.code === 'Space' && dino.y === 150) {
    dino.dy = dino.jump;
  }
});

// Create obstacles
function createObstacle(){
  const obsHeight = 20 + Math.random()*30;
  obstacles.push({x: canvas.width, y: 170-obsHeight, width: 20, height: obsHeight});
}
setInterval(createObstacle, 1500);

function gameLoop(){
  if(gameOver){ ctx.fillText("Game Over!", 350,100); return; }
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Dino
  dino.dy += dino.gravity;
  dino.y += dino.dy;
  if(dino.y > 150) { dino.y = 150; dino.dy=0; }
  ctx.fillStyle = "#111";
  ctx.fillRect(dino.x,dino.y,dino.width,dino.height);

  // Obstacles
  ctx.fillStyle = "red";
  for(let i=obstacles.length-1;i>=0;i--){
    obstacles[i].x -= gameSpeed;
    ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);

    // Collision
    if(dino.x < obstacles[i].x + obstacles[i].width &&
       dino.x + dino.width > obstacles[i].x &&
       dino.y < obstacles[i].y + obstacles[i].height &&
       dino.y + dino.height > obstacles[i].y){
      gameOver = true;
    }

    if(obstacles[i].x + obstacles[i].width < 0){
      obstacles.splice(i,1);
      score++;
    }
  }

  // Score
  ctx.fillStyle = "#111";
  ctx.font = "16px Orbitron";
  ctx.fillText("Score: "+score, 700,20);

  requestAnimationFrame(gameLoop);
}
gameLoop();