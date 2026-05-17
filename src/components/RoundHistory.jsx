export default function RoundHistory({ rounds, teams }) {
  if (rounds.length === 0) {
    return (
      <div className="history-empty-inline">
        No rounds yet — tap + ADD POINTS to start
      </div>
    )
  }

  return (
    <div className="history-section">
      <div className="history-label">Round History</div>
      <div className="history-list">
        {[...rounds].reverse().map((r, i) => (
          <div key={r.id} className="history-item">
            <span className="history-rnd">R{rounds.length - i}</span>
            <span className={`history-team history-team-${r.teamIdx}`}>
              {teams[r.teamIdx]?.name ?? `Team ${r.teamIdx + 1}`}
            </span>
            <span className="history-pts">+{r.total}</span>
            {r.capicua && <span className="history-cap">⭐ +25</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
