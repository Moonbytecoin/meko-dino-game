// A vertical jumping version of Meko Game with upward egg collecting
import React, { useEffect, useRef, useState } from "react";

const MekoGame = () => {
  const jumpSound = new Audio("https://www.myinstants.com/media/sounds/jump-sound.mp3");
  const canvasRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const keys = useRef({});

  useEffect(() => {
    if (!started || gameOver) return;

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

    const gravity = 0.6;
    let scrollOffset = 0;
    let score = 0;

    const meko = {
      x: canvas.width / 2 - 30,
      y: canvas.height - 150,
      width: 60,
      height: 60,
      velocityY: 0,
      jumpForce: 15,
      speed: 5,
    };

    const egg = {
      x: Math.random() * (canvas.width - 50),
      y: canvas.height - 800,
      width: 40,
      height: 50,
      collected: false,
    };

    let platforms = [];
    for (let i = 0; i < 10; i++) {
      platforms.push({
        x: Math.random() * (canvas.width - 80),
        y: canvas.height - i * 100,
        width: 80,
        height: 10,
      });
    }

    const resetGame = () => {
      setGameOver(true);
      setFinalScore(score);
    };

    const respawnEgg = () => {
      egg.x = Math.random() * (canvas.width - egg.width);
      egg.y -= 600;
      egg.collected = false;
    };

    const update = () => {
      if (gameOver) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      // Meko physics
      meko.velocityY += gravity;
      meko.y += meko.velocityY;

      if (meko.y < canvas.height / 2) {
        const diff = canvas.height / 2 - meko.y;
        scrollOffset += diff;
        meko.y = canvas.height / 2;
        platforms.forEach((p) => (p.y += diff));
        egg.y += diff;
      }

      if (keys.current["ArrowLeft"]) meko.x -= meko.speed;
      if (keys.current["ArrowRight"]) meko.x += meko.speed;
      meko.x = Math.max(0, Math.min(canvas.width - meko.width, meko.x));

      ctx.drawImage(mekoImg, meko.x, meko.y, meko.width, meko.height);

      platforms.forEach((p) => {
        ctx.fillStyle = "#444";
        ctx.fillRect(p.x, p.y, p.width, p.height);

        if (
          meko.y + meko.height >= p.y &&
          meko.y + meko.height <= p.y + 10 &&
          meko.x + meko.width > p.x &&
          meko.x < p.x + p.width &&
          meko.velocityY > 0
        ) {
          meko.velocityY = -meko.jumpForce;
          jumpSound.play();
        }
      });

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
          respawnEgg();
        }
      }

      ctx.fillStyle = "black";
      ctx.font = "20px Arial";
      ctx.fillText("Score: " + score, 20, 30);
      requestAnimationFrame(update);
    };

    const handleKeyDown = (e) => {
      keys.current[e.code] = true;
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
        update();
      }
    };

    mekoImg.onload = tryStart;
    eggImg.onload = tryStart;
    bgImg.onload = tryStart;

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [started, gameOver]);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      {!started ? (
        <div style={{ position: "absolute", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", background: "#fff", zIndex: 10 }}>
          <img src={process.env.PUBLIC_URL + "/meko.png"} alt="Start Meko" style={{ width: 120, height: 120, marginBottom: 20 }} />
          <button onClick={() => setStarted(true)} style={{ padding: "12px 24px", fontSize: "1.2rem", marginBottom: 10 }}>Start Game</button>
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

