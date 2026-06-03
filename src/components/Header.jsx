export default function Header({ onHistory, onReset }) {
  return (
    <header className="header">
      <div className="brand">
        <img className="brand-logo" src="/icons/icon-192.png" alt="" aria-hidden="true" />
        <div className="header-title">
          <div>
            <span className="title-domino">DOMINO</span>
            <span className="title-pro"> PRO</span>
          </div>
          <span className="title-anota">ANOTA</span>
        </div>
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
