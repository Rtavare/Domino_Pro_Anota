import { useReducer, useCallback, useState, useEffect } from 'react'
import Header from './components/Header'
import TeamCard from './components/TeamCard'
import PointEntryModal from './components/PointEntryModal'
import RoundHistory from './components/RoundHistory'
import MatchHistory from './components/MatchHistory'
import WinOverlay from './components/WinOverlay'
import { SCORE_LIMIT, defaultState, gameReducer } from './game'

const GAME_KEY = 'dpa_game_v2'
const HISTORY_KEY = 'dpa_history_v2'

function fromStorage(key, fallback) {
  try {
    const s = localStorage.getItem(key)
    return s ? JSON.parse(s) : fallback
  } catch {
    return fallback
  }
}

export default function App() {
  const [game, dispatch] = useReducer(
    gameReducer,
    defaultState,
    init => fromStorage(GAME_KEY, init)
  )
  const [matchHistory, setMatchHistory] = useState(() => fromStorage(HISTORY_KEY, []))
  const [entryFor, setEntryFor] = useState(null)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    localStorage.setItem(GAME_KEY, JSON.stringify(game))
  }, [game])

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(matchHistory))
  }, [matchHistory])

  const archiveGame = useCallback((currentGame) => {
    if (currentGame.rounds.length === 0) return
    setMatchHistory(prev =>
      [
        {
          id: Date.now(),
          date: Date.now(),
          teams: currentGame.teams.map(t => t.name),
          scores: currentGame.teams.map(t => t.score),
          winnerIdx: currentGame.winnerIdx,
          rounds: currentGame.rounds.length,
          gamesWon: currentGame.gamesWon,
        },
        ...prev,
      ].slice(0, 100)
    )
  }, [])

  const handleAddPoints = useCallback((teamIdx, points, capicua) => {
    dispatch({ type: 'ADD_POINTS', teamIdx, points, capicua })
    setEntryFor(null)
  }, [])

  const handleNewGame = useCallback(() => {
    archiveGame(game)
    dispatch({ type: 'NEW_GAME' })
  }, [game, archiveGame])

  const handleResetMatch = useCallback(() => {
    archiveGame(game)
    dispatch({ type: 'RESET_MATCH' })
  }, [game, archiveGame])

  return (
    <div className="app">
      <Header onHistory={() => setShowHistory(true)} onReset={handleResetMatch} />

      <main className="main">
        <div className="teams-row">
          {game.teams.map((team, idx) => (
            <TeamCard
              key={idx}
              team={team}
              teamIdx={idx}
              gamesWon={game.gamesWon[idx]}
              limit={SCORE_LIMIT}
              disabled={game.gameOver}
              onAddPoints={() => setEntryFor(idx)}
              onNameChange={name => dispatch({ type: 'SET_TEAM_NAME', teamIdx: idx, name })}
            />
          ))}
        </div>

        <div className="actions-row">
          <button
            className="btn-undo"
            onClick={() => dispatch({ type: 'UNDO' })}
            disabled={game.rounds.length === 0}
          >
            ↩ Undo
          </button>
        </div>

        <RoundHistory rounds={game.rounds} teams={game.teams} />
      </main>

      {entryFor !== null && (
        <PointEntryModal
          team={game.teams[entryFor]}
          teamIdx={entryFor}
          onSubmit={handleAddPoints}
          onClose={() => setEntryFor(null)}
        />
      )}

      {game.gameOver && (
        <WinOverlay
          teams={game.teams}
          winnerIdx={game.winnerIdx}
          gamesWon={game.gamesWon}
          onNewGame={handleNewGame}
          onResetMatch={handleResetMatch}
        />
      )}

      {showHistory && (
        <MatchHistory
          history={matchHistory}
          onClose={() => setShowHistory(false)}
          onClear={() => setMatchHistory([])}
        />
      )}
    </div>
  )
}
