export default function WinOverlay({ teams, winnerIdx, gamesWon, onNewGame, onResetMatch }) {
  const winner = teams[winnerIdx]
  const loserIdx = winnerIdx === 0 ? 1 : 0

  return (
    <div className="win-overlay">
      <div className="win-card">
        <div className="win-emoji">🏆</div>

        <div className={`win-title win-title-${winnerIdx}`}>
          {winner.name}
        </div>
        <div className="win-subtitle">wins this game!</div>

        <div className="win-scores">
          {teams.map((t, i) => (
            <div key={i} className="win-score-item">
              <div className={`win-score-val win-score-val-${i}`}>{t.score}</div>
              <div className="win-score-name">{t.name}</div>
            </div>
          ))}
        </div>

        <div className="win-games-row">
          {teams.map((t, i) => (
            <div key={i} className="win-games-item">
              <div className={`win-games-count win-games-count-${i}`}>{gamesWon[i]}</div>
              <div className="win-games-label">{t.name} wins</div>
            </div>
          ))}
        </div>

        <div className="win-buttons">
          <button className="btn-new-game" onClick={onNewGame}>
            ▶ Next Game
          </button>
          <button className="btn-reset-match" onClick={onResetMatch}>
            Reset Match
          </button>
        </div>
      </div>
    </div>
  )
}
