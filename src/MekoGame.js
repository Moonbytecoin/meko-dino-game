// A basic Mario-style Meko Dino Game (clean, secret-free version)
import React, { useEffect, useRef, useState } from "react";

const MekoGame = () => {
  const jumpSound = new Audio("https://www.myinstants.com/media/sounds/jump-sound.mp3");
  const music = new Audio("https://assets.mixkit.co/music/preview/mixkit-arcade-game-loop-251.mp3");
  music.loop = true;
  const canvasRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const keys = useRef({});

  useEffect(() => {
    if (!started || gameOver) return;

    music.play();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const mekoImg = new Image();
    mekoImg.src = process.env.PUBLIC_URL + "/meko.png";
    const eggImg = new Image();
    eggImg.src = process.env.PUBLIC_URL + "/egg.png";
    const bgImg = new Image();
    bgImg.src = process.env.PUBLIC_URL + "/background.png";

    const meko = {
      x: canvas.width * 0.1,
      y: canvas.height - 140,
      width: 100,
      height: 100,
      velocityY: 0,
      jumpForce: 14,
      speed: 5,
      grounded: true,
    };

    const gravity = 0.6;
    let score = 0;
    let egg = {
      x: canvas.width * 0.7,
      y: canvas.height - 120,
      width: 50,
      height: 60,
      collected: false,
    };
    let frameCount = 0;
    let obstacles = [];
    let obstacleInterval;

    const spawnObstacle = () => {
      const size = 30 + Math.random() * 40;
      const speed = 3 + Math.random() * 2;
      const moveDir = Math.random() > 0.5 ? 1 : -1;
      obstacles.push({
        x: canvas.width + size,
        y: canvas.height - size - 50,
        width: size,
        height: size,
        speed,
        dirY: Math.random() > 0.5 ? moveDir : 0,
        baseY: canvas.height - size - 50,
      });
    };

    const resetGame = () => {
      setGameOver(true);
      setFinalScore(score);
      music.pause();
      music.currentTime = 0;
    };

    const update = () => {
      if (gameOver) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      // Gravity
      if (!meko.grounded) meko.velocityY += gravity;
      meko.y += meko.velocityY;

      // Floor
      if (meko.y >= canvas.height - meko.height - 50) {
        meko.y = canvas.height - meko.height - 50;
        meko.velocityY = 0;
        meko.grounded = true;
      }

      if (keys.current["ArrowRight"]) meko.x += meko.speed;
      if (keys.current["ArrowLeft"]) meko.x -= meko.speed;
      if (meko.x < 0) meko.x = 0;
      if (meko.x + meko.width > canvas.width) meko.x = canvas.width - meko.width;

      ctx.drawImage(mekoImg, meko.x, meko.y, meko.width, meko.height);

      for (let ob of obstacles) {
        ob.x -= ob.speed;
        if (ob.dirY !== 0) {
          ob.y += ob.dirY;
          if (ob.y > ob.baseY + 40 || ob.y < ob.baseY - 40) ob.dirY *= -1;
        }
        ctx.fillStyle = "#e00";
        ctx.fillRect(ob.x, ob.y, ob.width, ob.height);

        if (
          meko.x < ob.x + ob.width &&
          meko.x + meko.width > ob.x &&
          meko.y < ob.y + ob.height &&
          meko.y + meko.height > ob.y
        ) {
          resetGame();
          return;
        }
      }

      // Egg power-up
      if (!egg.collected) {
        ctx.drawImage(eggImg, egg.x, egg.y, egg.width, egg.height);
        if (
          meko.x < egg.x + egg.width &&
          meko.x + meko.width > egg.x &&
          meko.y < egg.y + egg.height &&
          meko.y + meko.height > egg.y
        ) {
          egg.collected = true;
          score += 10;
          meko.width *= 1.2;
          meko.height *= 1.2;
        }
      }

      // Score
      frameCount++;
      if (frameCount % 60 === 0) score++;
      ctx.fillStyle = "black";
      ctx.font = "20px Arial";
      ctx.fillText("Score: " + score, 20, 30);

      requestAnimationFrame(update);
    };

    const handleKeyDown = (e) => {
      keys.current[e.code] = true;
      if (e.code === "Space" && meko.grounded) {
        jumpSound.play();
        meko.velocityY = -meko.jumpForce;
        meko.grounded = false;
      }
    };

    const handleKeyUp = (e) => {
      keys.current[e.code] = false;
    };

    let imagesLoaded = 0;
    const tryStart = () => {
      imagesLoaded++;
      if (imagesLoaded === 3) {
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);
        obstacleInterval = setInterval(spawnObstacle, 2000);
        update();
      }
    };

    mekoImg.onload = tryStart;
    eggImg.onload = tryStart;
    bgImg.onload = tryStart;

    return () => {
      clearInterval(obstacleInterval);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      music.pause();
      music.currentTime = 0;
    };
  }, [started, gameOver]);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      {!started ? (
        <div style={{ position: "absolute", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", background: "#fff", zIndex: 10 }}>
          <img src={process.env.PUBLIC_URL + "/meko.png"} alt="Start Meko" style={{ width: 100, height: 100, marginBottom: 20 }} />
          <button onClick={() => setStarted(true)} style={{ padding: "12px 24px", fontSize: "1.2rem" }}>Start Game</button>
        </div>
      ) : gameOver ? (
        <div style={{ position: "absolute", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", background: "#fff", zIndex: 10 }}>
          <h2>Game Over</h2>
          <p>Final Score: {finalScore}</p>
          <button onClick={() => { setGameOver(false); setStarted(false); }}>Restart</button>
        </div>
      ) : (
        <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%", backgroundColor: "#eef" }} />
      )}
    </div>
  );
};

export default MekoGame;

