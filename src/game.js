export const SCORE_LIMIT = 200

export const defaultState = {
  teams: [
    { name: 'Nosotros', score: 0 },
    { name: 'Ellos', score: 0 },
  ],
  rounds: [],
  gamesWon: [0, 0],
  gameOver: false,
  winnerIdx: null,
}

export function gameReducer(state, action) {
  switch (action.type) {
    case 'ADD_POINTS': {
      const { teamIdx, points, capicua } = action
      if (state.gameOver || !Number.isFinite(points) || points <= 0) return state

      const bonus = capicua ? 25 : 0
      const total = points + bonus
      const newTeams = state.teams.map((team, index) =>
        index === teamIdx ? { ...team, score: team.score + total } : team
      )
      const round = { id: Date.now(), teamIdx, points, capicua, bonus, total }
      const won = newTeams[teamIdx].score >= SCORE_LIMIT
      const newGamesWon = won
        ? state.gamesWon.map((wins, index) => (index === teamIdx ? wins + 1 : wins))
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
      const newTeams = state.teams.map((team, index) =>
        index === last.teamIdx
          ? { ...team, score: Math.max(0, team.score - last.total) }
          : team
      )
      const newGamesWon =
        state.gameOver && state.winnerIdx !== null
          ? state.gamesWon.map((wins, index) => (index === state.winnerIdx ? wins - 1 : wins))
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
        teams: state.teams.map((team, index) => (index === teamIdx ? { ...team, name } : team)),
      }
    }
    case 'NEW_GAME':
      return {
        ...state,
        teams: state.teams.map(team => ({ ...team, score: 0 })),
        rounds: [],
        gameOver: false,
        winnerIdx: null,
      }
    case 'RESET_MATCH':
      return {
        ...defaultState,
        teams: state.teams.map(team => ({ ...team, score: 0 })),
      }
    default:
      return state
  }
}
