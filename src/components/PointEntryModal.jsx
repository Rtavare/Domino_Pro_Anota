import { useState, useRef, useEffect } from 'react'

export default function PointEntryModal({ team, teamIdx, onSubmit, onClose }) {
  const [points, setPoints] = useState('')
  const [capicua, setCapicua] = useState(false)
  const inputRef = useRef()

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [])

  const num = parseInt(points) || 0
  const total = num + (capicua ? 25 : 0)
  const canSubmit = num > 0

  const handleSubmit = () => {
    if (!canSubmit) return
    onSubmit(teamIdx, num, capicua)
  }

  const handleKey = e => {
    if (e.key === 'Enter' && canSubmit) handleSubmit()
    if (e.key === 'Escape') onClose()
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="sheet-handle" />

        <h2 className={`sheet-title sheet-title-${teamIdx}`}>
          + {team.name}
        </h2>

        <div className="points-input-wrap">
          <input
            ref={inputRef}
            className="points-input"
            type="number"
            min="0"
            max="200"
            value={points}
            onChange={e => setPoints(e.target.value)}
            onKeyDown={handleKey}
            placeholder="0"
          />
        </div>

        {capicua && num > 0 && (
          <div className="capicua-preview">
            {num} + 25 = <strong>{total}</strong> pts
          </div>
        )}

        <button
          className={`btn-capicua ${capicua ? 'active' : ''}`}
          onClick={() => setCapicua(c => !c)}
        >
          ⭐ CAPICÚA
          <div className="capicua-detail">
            {capicua ? '+25 bonus activated!' : 'Last tile fits both sides'}
          </div>
        </button>

        <div className="sheet-buttons">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`btn-submit btn-submit-${teamIdx}`}
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            ADD {canSubmit ? total : ''} PTS
          </button>
        </div>
      </div>
    </div>
  )
}
