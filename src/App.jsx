import { useState, useEffect, useCallback } from "react";
import "./App.css";

const ADMIN_PASSWORD = "IndianStudies";
const REFRESH_PASSWORD = "refresh123";
const TOTAL_QUESTIONS = 10;

const foods = [
  { name: "Idli", clues: ["Soft, white steamed cakes made from rice batter", "Healthy South Indian breakfast served with sambar", "Round, spongy, and always eaten with chutney"] },
  { name: "Dosa", clues: ["Thin, crispy golden crepe made from rice batter", "Famous South Indian dish shaped like a roll or cone", "Usually filled with potato masala inside"] },
  { name: "Samosa", clues: ["Crispy triangular fried pastry with potato filling", "Most common snack found at every Indian tea stall", "Best enjoyed hot with green or sweet chutney"] },
  { name: "Biryani", clues: ["Famous spicy rice dish cooked with meat or veg", "Known for its long grains and aromatic smell", "World-famous specialty of Hyderabad"] },
  { name: "Puri", clues: ["Deep-fried wheat bread that puffs up like a ball", "Golden, round, and soft breakfast favorite", "Always served with potato curry or bhaji"] },
  { name: "Vada", clues: ["Savory fried snack that looks like a donut", "Made from lentils and served with sambar", "Crispy on the outside, soft on the inside"] },
  { name: "Maggi", clues: ["Quick 2-minute noodles loved by students", "The ultimate late-night snack for everyone", "Yellow noodles cooked with a special Masala"] },
  { name: "Gulab Jamun", clues: ["Sweet brown balls soaked in sugar syrup", "Soft, juicy dessert served at every wedding", "Often eaten warm with vanilla ice cream"] },
  { name: "Pani Puri", clues: ["Small crispy balls filled with spicy herb water", "You eat it in one bite at a street stall", "Also called Golgappa or Puchka"] },
  { name: "Chapati", clues: ["Flat, round bread made from wheat flour", "Daily staple food eaten with curry or dal", "Also known as Roti or Phulka"] },
  { name: "Dal", clues: ["Yellow lentil soup tempered with spices", "Simple comfort food eaten with rice or roti", "Commonly called Pappu in Telugu"] },
  { name: "Curd Rice", clues: ["Soft rice mixed with yogurt and salt", "Cooling meal that ends every South Indian lunch", "Best eaten with mango or lemon pickle"] },
  { name: "Omelette", clues: ["Beaten eggs fried in a pan with onions", "Quick protein-rich breakfast or side dish", "Often eaten with bread or as a street snack"] },
  { name: "Upma", clues: ["Savory porridge made from roasted semolina", "Quick breakfast dish with peanuts and veggies", "Commonly called Uppittu in some regions"] },
  { name: "Pakoda", clues: ["Deep-fried onion or vegetable fritters", "Best snack to eat when it is raining outside", "Crispy, salty, and perfect with tea"] },
  { name: "Jalebi", clues: ["Orange-colored sweet spirals soaked in syrup", "Crispy, juicy, and shaped like a coil", "Traditional sweet sold at every local mela"] },
  { name: "Tea", clues: ["Most popular hot drink in India made with milk", "Brewed with sugar, tea leaves, and ginger", "Commonly called Chai by everyone"] },
  { name: "Pav Bhaji", clues: ["Mashed spicy veg curry served with buttered bread", "Famous Mumbai street food with lots of butter", "Served with chopped onions and a lemon slice"] },
  { name: "Laddu", clues: ["Round sweet ball made during festivals", "Yellow or orange color, usually made of besan", "The most famous prasad from Tirupati"] },
  { name: "Ice Cream", clues: ["Frozen sweet treat loved by kids and adults", "Comes in flavors like Vanilla, Chocolate, and Pista", "The best way to beat the Indian summer heat"] },
  { name: "Lemon Rice", clues: ["Yellow rice with a tangy, sour flavor", "Tempered with peanuts, curry leaves, and turmeric", "Quick lunch dish often called Chitranna"] },
  { name: "Bread Jam", clues: ["Simple snack made of two slices and a fruit spread", "Quickest tiffin option for school kids", "Sweet, red fruit spread on toasted or plain bread"] },
  { name: "Papad", clues: ["Thin, crunchy disc that is roasted or fried", "Side dish that adds crunch to your meal", "Known as Appadam in Telugu"] },
  { name: "Kheer", clues: ["Rice pudding made with milk and sugar", "Traditional dessert served at festivals", "Often garnished with almonds and raisins"] },
  { name: "Bajji", clues: ["Stuffed green chili or potato fried in batter", "Hot and spicy street snack served with onions", "A must-have snack at the beach or park"] },
  { name: "Poha", clues: ["Light breakfast made from flattened rice", "Cooked with turmeric, onions, and peanuts", "Very popular healthy snack in North India"] },
  { name: "Lassi", clues: ["Sweet, thick yogurt drink served chilled", "Famous Punjabi refreshment often topped with cream", "Served in a tall glass, especially in summer"] },
  { name: "Chicken 65", clues: ["Spicy, deep-fried red chicken cubes", "Popular appetizer served in restaurants", "Crispy starter with curry leaves and chilies"] },
  { name: "Khichdi", clues: ["Simple one-pot meal of rice and lentils", "Light food often given when someone is sick", "Healthy, mushy, and very easy to digest"] },
  { name: "Butter Chicken", clues: ["Creamy tomato chicken curry with lots of butter", "The most famous Indian curry worldwide", "Sweet and spicy gravy that goes best with Naan"] },
  { name: "Halwa", clues: ["Sweet, dense dessert made from carrot or moong dal", "Slow-cooked with ghee and sugar until soft", "Gajar version is very popular in winter"] },
];

const SCREEN = {
  ROLE_SELECT: "role_select",
  LOGIN: "login",
  USERNAME: "username",
  GAME: "game",
  GAME_OVER: "game_over",
  LEADERBOARD: "leaderboard",
};

function getRankLabel(rank) {
  if (rank === 1) return "🥇 1st";
  if (rank === 2) return "🥈 2nd";
  if (rank === 3) return "🥉 3rd";
  return `#${rank}`;
}

function getScoreMessage(score) {
  const max = TOTAL_QUESTIONS * 25;
  const pct = score / max;
  if (pct >= 0.9) return { emoji: "🌟", text: "Outstanding! You're a true food expert!" };
  if (pct >= 0.7) return { emoji: "🎉", text: "Great job! You really know your Indian food!" };
  if (pct >= 0.5) return { emoji: "👍", text: "Good effort! Keep practicing!" };
  return { emoji: "🍽️", text: "Better luck next time. Try again!" };
}

function useGame() {
  const [usedIndices, setUsedIndices] = useState([]);
  const [currentFood, setCurrentFood] = useState(null);

  const getNextFood = useCallback(() => {
    setUsedIndices((prev) => {
      const pool = prev.length >= foods.length ? [] : prev;
      const available = foods.map((_, i) => i).filter((i) => !pool.includes(i));
      const idx = available[Math.floor(Math.random() * available.length)];
      setCurrentFood(foods[idx]);
      return pool.length === 0 ? [idx] : [...prev, idx];
    });
  }, []);

  const resetGame = useCallback(() => {
    setUsedIndices([]);
    setCurrentFood(null);
  }, []);

  return { currentFood, getNextFood, resetGame };
}

export default function App() {
  const [screen, setScreen] = useState(SCREEN.ROLE_SELECT);
  const [prevScreen, setPrevScreen] = useState(SCREEN.GAME);
  const [adminPass, setAdminPass] = useState("");
  const [username, setUsername] = useState("");
  const [score, setScore] = useState(0);
  const [questionNum, setQuestionNum] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [wasSkipped, setWasSkipped] = useState(false);
  const [cluesShown, setCluesShown] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  
  // PWA Install States
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  
  const { currentFood, getNextFood, resetGame } = useGame();

  useEffect(() => {
    const saved = localStorage.getItem("masalaLeaderboard");
    if (saved) setLeaderboard(JSON.parse(saved));
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration.scope);
        })
        .catch((error) => {
          console.log('SW registration failed:', error);
        });
    }
    
    // Capture the install prompt
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallBtn(false);
    }
    
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Handle install button click
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallBtn(false);
    }
    setDeferredPrompt(null);
  };

  const startQuestion = useCallback(() => {
    getNextFood();
    setUserAnswer("");
    setShowResult(false);
    setWasSkipped(false);
    setCluesShown(0);
  }, [getNextFood]);

  const handleAdminLogin = () => {
    if (adminPass === ADMIN_PASSWORD) {
      setScreen(SCREEN.USERNAME);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleRefreshLeaderboard = () => {
    const password = prompt("🔄 Enter Refresh Password to CLEAR Leaderboard:");
    if (password === REFRESH_PASSWORD) {
      localStorage.removeItem("masalaLeaderboard");
      setLeaderboard([]);
      alert("✅ Leaderboard REFRESHED! All scores cleared. Fresh start! 🎉");
    } else if (password !== null) {
      alert("❌ Wrong Refresh Password! Leaderboard unchanged.");
    }
  };

  const beginGame = () => {
    setScore(0);
    setQuestionNum(1);
    setCorrectCount(0);
    setSkippedCount(0);
    setStreak(0);
    setBestStreak(0);
    resetGame();
    setScreen(SCREEN.GAME);
    setPrevScreen(SCREEN.GAME);
    setTimeout(startQuestion, 50);
  };

  const handleUsernameSubmit = () => {
    if (!username.trim()) return;
    beginGame();
  };

  const persistLeaderboard = (finalScore, finalCorrect) => {
    const entry = {
      name: username,
      score: finalScore,
      correct: finalCorrect,
      date: new Date().toLocaleDateString("en-IN"),
    };
    const updated = [entry, ...leaderboard.filter((e) => e.name !== username)]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    localStorage.setItem("masalaLeaderboard", JSON.stringify(updated));
    setLeaderboard(updated);
  };

  const pts = currentFood ? 25 - cluesShown * 5 : 25;

  const handleSubmit = () => {
    if (showResult) return;
    const correct = userAnswer.trim().toLowerCase() === currentFood.name.toLowerCase();
    setShowResult(true);
    setWasSkipped(false);

    let newScore = score;
    let newCorrect = correctCount;
    let newStreak = streak;

    if (correct) {
      newScore = score + pts;
      newCorrect = correctCount + 1;
      newStreak = streak + 1;
      setScore(newScore);
      setCorrectCount(newCorrect);
      setStreak(newStreak);
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
      }
      setFlash("correct");
    } else {
      setStreak(0);
      setFlash("wrong");
    }
    persistLeaderboard(newScore, newCorrect);
    setTimeout(() => setFlash(null), 700);
  };

  const handleSkip = () => {
    if (showResult) return;
    setShowResult(true);
    setWasSkipped(true);
    setSkippedCount((prev) => prev + 1);
    setStreak(0);
    setFlash("skip");
    persistLeaderboard(score, correctCount);
    setTimeout(() => setFlash(null), 700);
  };

  const handleNextQuestion = () => {
    if (questionNum >= TOTAL_QUESTIONS) {
      setPrevScreen(SCREEN.GAME_OVER);
      setScreen(SCREEN.GAME_OVER);
    } else {
      setQuestionNum((q) => q + 1);
      startQuestion();
    }
  };

  const handlePlayAgain = () => {
    beginGame();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const showClue = (n) => {
    if (cluesShown < n) setCluesShown(n);
  };

  const isCorrect =
    showResult &&
    currentFood &&
    userAnswer.trim().toLowerCase() === currentFood.name.toLowerCase();

  const isSkipped = showResult && wasSkipped;

  const myRank = leaderboard.findIndex((p) => p.name === username) + 1;
  const scoreMsg = getScoreMessage(score);

  return (
    <div className={`app${flash ? ` flash-${flash}` : ""}`}>

      {/* ── ROLE SELECTION ── */}
      {screen === SCREEN.ROLE_SELECT && (
        <div className="role-screen">
          <div className="role-header">
            <div className="role-diya">🍛</div>
            <div className="role-brand">Masala Mahal</div>
            <div className="role-tagline">Indian Food Quiz</div>
            <div className="role-divider">
              <span className="role-divider-line"></span>
              <span className="role-divider-icon">✦</span>
              <span className="role-divider-line"></span>
            </div>
            <p className="role-prompt">Who are you?</p>
          </div>

          <div className="role-cards">
            <button
              className="role-card role-card--player"
              onClick={() => setScreen(SCREEN.USERNAME)}
            >
              <div className="role-card-glow"></div>
              <div className="role-card-icon">🎮</div>
              <div className="role-card-title">Player</div>
              <div className="role-card-desc">
                Guess the dish, earn points &amp; climb the leaderboard
              </div>
              <div className="role-card-arrow">Play Now →</div>
            </button>

            <button
              className="role-card role-card--admin"
              onClick={() => setScreen(SCREEN.LOGIN)}
            >
              <div className="role-card-glow"></div>
              <div className="role-card-icon">🛡️</div>
              <div className="role-card-title">Admin</div>
              <div className="role-card-desc">
                Manage the game, reset scores &amp; control the leaderboard
              </div>
              <div className="role-card-arrow">Login →</div>
            </button>
          </div>

          {/* Install App Button */}
          {showInstallBtn && (
            <button className="install-btn" onClick={handleInstallClick}>
              📲 Install App
            </button>
          )}

          <div className="role-footer">Indian Studies</div>
        </div>
      )}

      {/* ── ADMIN LOGIN ── */}
      {screen === SCREEN.LOGIN && (
        <div className="card">
          <div className="login-header">
            <button
              className="back-btn"
              onClick={() => { setAdminPass(""); setScreen(SCREEN.ROLE_SELECT); }}
              aria-label="Go back"
            >
              ← Back
            </button>
            <div className="login-emoji">🛡️</div>
            <div className="login-title">Admin Login</div>
            <div className="login-subtitle">Enter password to manage the game</div>
          </div>
          <div className="login-body">
            <label className="login-label">Password</label>
            <input
              className={`login-input${shake ? " shake" : ""}`}
              type="password"
              placeholder="Enter admin password"
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
            />
            <button className="btn-primary" onClick={handleAdminLogin}>
              Enter Game ✦
            </button>
            <div className="login-subtitle indian-studies">Indian Studies</div>
          </div>
        </div>
      )}

      {/* ── USERNAME ── */}
      {screen === SCREEN.USERNAME && (
        <div className="card">
          <div className="login-header">
            <button
              className="back-btn"
              onClick={() => { setUsername(""); setScreen(SCREEN.ROLE_SELECT); }}
              aria-label="Go back"
            >
              ← Back
            </button>
            <div className="login-emoji">👤</div>
            <div className="login-title">Who&apos;s Playing?</div>
            <div className="login-subtitle">Your name appears on the leaderboard</div>
          </div>
          <div className="login-body">
            <label className="login-label">Your Name</label>
            <input
              className="login-input"
              type="text"
              placeholder="e.g. Mohith, Jayanth, Azu..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUsernameSubmit()}
              maxLength={20}
            />
            <button
              className="btn-primary"
              onClick={handleUsernameSubmit}
              disabled={!username.trim()}
            >
              Start Playing 🎮
            </button>
          </div>
        </div>
      )}

      {/* ── GAME ── */}
      {screen === SCREEN.GAME && currentFood && (
        <div className="game-wrap">
          <div className="topbar">
            <div className="brand">🍲 Masala Mahal</div>
            <div className="user-chip">
              <span>👤 {username}</span>
              <button
                className="lb-btn"
                onClick={() => { setPrevScreen(SCREEN.GAME); setScreen(SCREEN.LEADERBOARD); }}
              >
                🏆 Leaderboard
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-wrap">
            <div className="progress-label">
              <span>Question {questionNum} of {TOTAL_QUESTIONS}</span>
              <span>{correctCount} correct so far</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${((questionNum - 1) / TOTAL_QUESTIONS) * 100}%` }}
              />
            </div>
            <div className="progress-dots">
              {Array.from({ length: TOTAL_QUESTIONS }, (_, i) => (
                <div
                  key={i}
                  className={`progress-dot${
                    i < questionNum - 1 ? " done" : i === questionNum - 1 ? " active" : ""
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="stats">
            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-val">{score}</div>
              <div className="stat-lbl">Score</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-val">{questionNum}/{TOTAL_QUESTIONS}</div>
              <div className="stat-lbl">Question</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-val">{streak}</div>
              <div className="stat-lbl">Streak</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💡</div>
              <div className="stat-val">{cluesShown}/2</div>
              <div className="stat-lbl">Clues</div>
            </div>
          </div>

          <div className="q-card">
            <div className="q-card-top">
              <span className="q-tag">Which dish is this?</span>
              <span className="pts-tag">+{pts} pts</span>
            </div>
            <div className="clue-text">&quot;{currentFood.clues[0]}&quot;</div>
            {cluesShown >= 1 && (
              <div className="clue-extra">
                <strong>Clue 1:</strong> {currentFood.clues[1]}
              </div>
            )}
            {cluesShown >= 2 && (
              <div className="clue-extra">
                <strong>Clue 2:</strong> {currentFood.clues[2]}
              </div>
            )}
          </div>

          <div className="input-row">
            <input
              className="answer-input"
              type="text"
              placeholder="Type the dish name..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={showResult}
            />
            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={!userAnswer.trim() || showResult}
            >
              Submit ✓
            </button>
          </div>

          {!showResult && (
            <div className="clue-btns">
              <button
                className={`clue-btn ${cluesShown >= 1 ? "used" : "available"}`}
                onClick={() => showClue(1)}
                disabled={cluesShown >= 1}
              >
                💡 Clue 1 (−5 pts)
              </button>
              <button
                className={`clue-btn ${
                  cluesShown >= 2 ? "used" : cluesShown < 1 ? "locked" : "available"
                }`}
                onClick={() => showClue(2)}
                disabled={cluesShown >= 2 || cluesShown < 1}
                title={cluesShown < 1 ? "Reveal Clue 1 first" : ""}
              >
                💡 Clue 2 (−5 pts)
              </button>
              <button 
                className="skip-btn" 
                onClick={handleSkip}
              >
                ⏭️ Skip
              </button>
            </div>
          )}

          {showResult && (
            <>
              <div className={`result-block ${isCorrect ? "correct" : isSkipped ? "skip" : "wrong"}`}>
                <div className="result-verdict">
                  {isCorrect ? "✅ Correct!" : isSkipped ? "⏭️ Skipped!" : "❌ Incorrect!"}
                </div>
                <div className="result-answer">
                  The dish was: <strong>{currentFood.name}</strong>
                  {isSkipped ? (
                    <span style={{ fontSize: "0.9em", opacity: 0.8 }}>
                      <br />You chose to skip (0 points)
                    </span>
                  ) : !isCorrect && (
                    <>
                      <br />
                      You answered: <strong>&quot;{userAnswer}&quot;</strong>
                    </>
                  )}
                </div>
                {isCorrect && <div className="pts-earned">+{pts} points earned!</div>}
                {isSkipped && <div className="pts-earned skip-pts">0 points (skipped)</div>}
                {isCorrect && streak > 1 && (
                  <div className="streak-bonus">🔥 {streak} streak!</div>
                )}
              </div>
              <button className="next-btn" onClick={handleNextQuestion}>
                {questionNum >= TOTAL_QUESTIONS ? "See Results 🏁" : `Next Question ➡ (${questionNum}/${TOTAL_QUESTIONS})`}
              </button>
            </>
          )}
        </div>
      )}

      {/* ── GAME OVER ── */}
      {screen === SCREEN.GAME_OVER && (
        <div className="gameover-wrap">
          <div className="gameover-card">
            <div className="gameover-top">
              <div className="gameover-emoji">{scoreMsg.emoji}</div>
              <div className="gameover-title">Quiz Complete!</div>
              <div className="gameover-subtitle">{scoreMsg.text}</div>
            </div>

            <div className="gameover-body">
              <div className="gameover-player">Well played, <strong>{username}</strong>! 🎊</div>

              <div className="gameover-stats">
                <div className="go-stat">
                  <div className="go-stat-val">{score}</div>
                  <div className="go-stat-lbl">Final Score</div>
                </div>
                <div className="go-stat-divider" />
                <div className="go-stat">
                  <div className="go-stat-val">{correctCount}<span className="go-stat-of">/{TOTAL_QUESTIONS}</span></div>
                  <div className="go-stat-lbl">Correct</div>
                </div>
                <div className="go-stat-divider" />
                <div className="go-stat">
                  <div className="go-stat-val go-stat-rank">{myRank ? getRankLabel(myRank) : "—"}</div>
                  <div className="go-stat-lbl">Your Rank</div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="gameover-extras">
                <div className="extra-stat">
                  <span className="extra-stat-icon">🔥</span>
                  <span className="extra-stat-label">Best Streak</span>
                  <span className="extra-stat-val">{bestStreak}</span>
                </div>
                <div className="extra-stat">
                  <span className="extra-stat-icon">⏭️</span>
                  <span className="extra-stat-label">Skipped</span>
                  <span className="extra-stat-val">{skippedCount}</span>
                </div>
                <div className="extra-stat">
                  <span className="extra-stat-icon">📊</span>
                  <span className="extra-stat-label">Accuracy</span>
                  <span className="extra-stat-val">{Math.round((correctCount / TOTAL_QUESTIONS) * 100)}%</span>
                </div>
              </div>

              <div className="gameover-actions">
                <button className="btn-primary" onClick={handlePlayAgain}>
                  🔄 Play Again
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => { setPrevScreen(SCREEN.GAME_OVER); setScreen(SCREEN.LEADERBOARD); }}
                >
                  🏆 Leaderboard
                </button>
                <button
                  className="btn-ghost"
                  onClick={() => { setUsername(""); setScreen(SCREEN.ROLE_SELECT); }}
                >
                  🏠 Home
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── LEADERBOARD OVERLAY ── */}
      {screen === SCREEN.LEADERBOARD && (
        <div className="overlay" onClick={() => setScreen(prevScreen)}>
          <div className="lb-card" onClick={(e) => e.stopPropagation()}>
            <div className="lb-head">
              <div
                className="lb-title"
                onDoubleClick={() => {
                  const pass = prompt("Admin Reset Password:");
                  if (pass === "1234") {
                    localStorage.removeItem("masalaLeaderboard");
                    setLeaderboard([]);
                    alert("Admin Reset Complete! ✅");
                  }
                }}
                style={{ cursor: "pointer", userSelect: "none" }}
              >
                🏆 Top Players
              </div>
              <div className="lb-actions">
                <button
                  className="refresh-btn"
                  onClick={handleRefreshLeaderboard}
                  title="🔄 Click to CLEAR & Reset Leaderboard (Password Required)"
                >
                  🔄
                </button>
                <button
                  className="close-btn"
                  onClick={() => setScreen(prevScreen)}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="lb-list">
              {leaderboard.length === 0 ? (
                <div className="lb-empty">No scores yet — be the first! 🌟</div>
              ) : (
                leaderboard.map((p, i) => (
                  <div
                    key={i}
                    className={`lb-row${p.name === username ? " me" : ""}`}
                  >
                    <span className={`lb-rank${i < 3 ? " top" : ""}`}>
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                    </span>
                    <span className="lb-name">{p.name}</span>
                    <span className="lb-score">{p.score}</span>
                    <span className="lb-date">{p.date}</span>
                  </div>
                ))
              )}
            </div>

            <div className="lb-foot">
              Your rank : <strong>{myRank || "—"}</strong>
              &nbsp;||&nbsp; Score : <strong>{score}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
