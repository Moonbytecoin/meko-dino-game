// A refined Meko Dino Game with better collisions, smoother blocks, and reliable music
import React, { useEffect, useRef, useState } from "react";

const MekoGame = () => {
  const jumpSound = new Audio("https://www.myinstants.com/media/sounds/jump-sound.mp3");
  const music = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_1f7e1a41b8.mp3");
  music.loop = true;

  const canvasRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const keys = useRef({});

  useEffect(() => {
    if (!started || gameOver) return;
    if (musicEnabled) music.play();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
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
      y: canvas.height - 120,
      width: 100,
      height: 100,
      velocityY: 0,
      jumpForce: 14,
      speed: 6,
      grounded: true,
    };

    const gravity = 0.6;
    let score = 0;
    let egg = {
      x: canvas.width * 0.8,
      y: canvas.height - 130,
      width: 50,
      height: 60,
      collected: false,
    };
    let frameCount = 0;
    let obstacles = [];
    let obstacleInterval;

    const spawnObstacle = () => {
      const size = 40;
      const speed = 6 + Math.random() * 2;
      const dirY = Math.random() > 0.5 ? 1 : -1;
      const baseY = canvas.height - size - 50;
      const vertical = Math.random() > 0.3;
      obstacles.push({
        x: canvas.width + size,
        y: baseY,
        width: size,
        height: size,
        speed,
        dirY: vertical ? dirY : 0,
        baseY,
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

      if (!meko.grounded) meko.velocityY += gravity;
      meko.y += meko.velocityY;
      if (meko.y >= canvas.height - meko.height - 50) {
        meko.y = canvas.height - meko.height - 50;
        meko.velocityY = 0;
        meko.grounded = true;
      }

      if (keys.current["ArrowRight"]) meko.x += meko.speed;
      if (keys.current["ArrowLeft"]) meko.x -= meko.speed;
      meko.x = Math.max(0, Math.min(canvas.width - meko.width, meko.x));

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
          meko.x < ob.x + ob.width - 10 &&
          meko.x + meko.width > ob.x + 10 &&
          meko.y < ob.y + ob.height - 10 &&
          meko.y + meko.height > ob.y + 10
        ) {
          resetGame();
          return;
        }
      }

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
          meko.width *= 1.3;
          meko.height *= 1.3;
        }
      }

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
  }, [started, gameOver, musicEnabled]);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      {!started ? (
        <div style={{ position: "absolute", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", background: "#fff", zIndex: 10 }}>
          <img src={process.env.PUBLIC_URL + "/meko.png"} alt="Start Meko" style={{ width: 120, height: 120, marginBottom: 20 }} />
          <button onClick={() => setStarted(true)} style={{ padding: "12px 24px", fontSize: "1.2rem", marginBottom: 10 }}>Start Game</button>
          <button onClick={() => setMusicEnabled(true)} style={{ padding: "10px 20px" }}>Play Music</button>
        </div>
      ) : gameOver ? (
        <div style={{ position: "absolute", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", background: "#fff", zIndex: 10 }}>
          <h2>Game Over</h2>
          <p>Final Score: {finalScore}</p>
          <button onClick={() => { setGameOver(false); setStarted(false); setMusicEnabled(false); }}>Restart</button>
        </div>
      ) : (
        <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%", backgroundColor: "#eef" }} />
      )}
    </div>
  );
};

export default MekoGame;

