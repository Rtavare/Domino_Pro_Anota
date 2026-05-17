import { useReducer, useCallback, useState, useEffect } from 'react'
import Header from './components/Header'
import TeamCard from './components/TeamCard'
import PointEntryModal from './components/PointEntryModal'
import RoundHistory from './components/RoundHistory'
import MatchHistory from './components/MatchHistory'
import WinOverlay from './components/WinOverlay'

const SCORE_LIMIT = 200

const defaultState = {
  teams: [
    { name: 'Nosotros', score: 0 },
    { name: 'Ellos', score: 0 },
  ],
  rounds: [],
  gamesWon: [0, 0],
  gameOver: false,
  winnerIdx: null,
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'ADD_POINTS': {
      const { teamIdx, points, capicua } = action
      const bonus = capicua ? 25 : 0
      const total = points + bonus
      const newTeams = state.teams.map((t, i) =>
        i === teamIdx ? { ...t, score: t.score + total } : t
      )
      const round = { id: Date.now(), teamIdx, points, capicua, bonus, total }
      const won = newTeams[teamIdx].score >= SCORE_LIMIT
      const newGamesWon = won
        ? state.gamesWon.map((w, i) => (i === teamIdx ? w + 1 : w))
        : state.gamesWon
      return {
        ...state,
        teams: newTeams,
        rounds: [...state.rounds, round],
        gamesWon: newGamesWon,
        gameOver: won,
        winnerIdx: won ? teamIdx : null,
      }
    }
    case 'UNDO': {
      if (state.rounds.length === 0) return state
      const last = state.rounds[state.rounds.length - 1]
      const newTeams = state.teams.map((t, i) =>
        i === last.teamIdx ? { ...t, score: Math.max(0, t.score - last.total) } : t
      )
      const newGamesWon =
        state.gameOver && state.winnerIdx !== null
          ? state.gamesWon.map((w, i) => (i === state.winnerIdx ? w - 1 : w))
          : state.gamesWon
      return {
        ...state,
        teams: newTeams,
        rounds: state.rounds.slice(0, -1),
        gamesWon: newGamesWon,
        gameOver: false,
        winnerIdx: null,
      }
    }
    case 'SET_TEAM_NAME': {
      const { teamIdx, name } = action
      return {
        ...state,
        teams: state.teams.map((t, i) => (i === teamIdx ? { ...t, name } : t)),
      }
    }
    case 'NEW_GAME':
      return {
        ...state,
        teams: state.teams.map(t => ({ ...t, score: 0 })),
        rounds: [],
        gameOver: false,
        winnerIdx: null,
      }
    case 'RESET_MATCH':
      return {
        ...defaultState,
        teams: state.teams.map(t => ({ ...t, score: 0 })),
      }
    default:
      return state
  }
}

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
