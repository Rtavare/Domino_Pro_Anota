export default function Header({ onHistory, onReset }) {
  return (
    <header className="header">
      <div className="header-title">
        <span className="title-domino">DOMINO</span>
        <span className="title-pro"> PRO</span>
      </div>
      <div className="header-actions">
        <button className="btn-icon" onClick={onHistory} title="Match history">
          📜
        </button>
        <button className="btn-icon" onClick={onReset} title="Reset match">
          ↺
        </button>
      </div>
    </header>
  )
}
