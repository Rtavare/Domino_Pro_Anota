import { useRef } from 'react'

export default function TeamCard({ team, teamIdx, gamesWon, limit, disabled, onAddPoints, onNameChange }) {
  const pct = Math.min((team.score / limit) * 100, 100)
  const inputRef = useRef()

  return (
    <div className={`team-card team-card-${teamIdx}`}>
      <div className="win-dots">
        {Array.from({ length: Math.max(gamesWon, 5) }, (_, i) => (
          <div
            key={i}
            className={`win-dot ${i < gamesWon ? `won-${teamIdx}` : ''}`}
          />
        ))}
      </div>

      <div className={`score-number score-number-${teamIdx}`}>
        {team.score}
      </div>

      <div className="progress-bar">
        <div
          className={`progress-fill progress-fill-${teamIdx}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <input
        ref={inputRef}
        className="team-name"
        value={team.name}
        onChange={e => onNameChange(e.target.value)}
        maxLength={14}
        spellCheck={false}
      />

      <button
        className={`btn-add btn-add-${teamIdx}`}
        onClick={onAddPoints}
        disabled={disabled}
      >
        + ADD POINTS
      </button>
    </div>
  )
}
