function fmtDate(ts) {
  const d = new Date(ts)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function MatchHistory({ history, onClose, onClear }) {
  return (
    <div className="history-panel-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="history-panel">
        <div className="sheet-handle" />

        <div className="history-panel-header">
          <h2 className="history-panel-title">Match History</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            {history.length > 0 && (
              <button className="btn-text btn-clear" onClick={onClear}>
                Clear
              </button>
            )}
            <button className="btn-text btn-close" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        <div className="history-panel-list">
          {history.length === 0 ? (
            <div className="history-empty">No completed games yet</div>
          ) : (
            history.map(m => (
              <div key={m.id} className="history-match-item">
                <div className="history-match-top">
                  <span
                    className={`history-match-winner history-match-winner-${m.winnerIdx ?? 0}`}
                  >
                    🏆 {m.winnerIdx !== null ? m.teams[m.winnerIdx] : '—'}
                  </span>
                  <span className="history-match-date">{fmtDate(m.date)}</span>
                </div>
                <div className="history-match-scores">
                  {m.teams.map((name, i) => (
                    <span key={i}>
                      <span className={`history-score-name-${i}`}>{name}</span>: {m.scores[i]}
                    </span>
                  ))}
                  <span className="history-match-rounds">{m.rounds}R</span>
                </div>
                <div className="history-match-wins">
                  {m.teams.map((name, i) => (
                    <span key={i} className={`history-games-won-${i}`}>
                      {name} {m.gamesWon[i]}W
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
