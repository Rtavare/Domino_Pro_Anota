import test from 'node:test'
import assert from 'node:assert/strict'
import { defaultState, gameReducer } from '../src/game.js'

function freshState() {
  return structuredClone(defaultState)
}

test('adds points and the Capicua bonus', () => {
  const state = gameReducer(freshState(), {
    type: 'ADD_POINTS',
    teamIdx: 0,
    points: 40,
    capicua: true,
  })

  assert.equal(state.teams[0].score, 65)
  assert.equal(state.rounds[0].bonus, 25)
  assert.equal(state.rounds[0].total, 65)
})

test('marks a winner and increments the match win count', () => {
  const state = gameReducer(freshState(), {
    type: 'ADD_POINTS',
    teamIdx: 1,
    points: 200,
    capicua: false,
  })

  assert.equal(state.gameOver, true)
  assert.equal(state.winnerIdx, 1)
  assert.deepEqual(state.gamesWon, [0, 1])
})

test('undo reverses the winning round and win count', () => {
  const won = gameReducer(freshState(), {
    type: 'ADD_POINTS',
    teamIdx: 0,
    points: 175,
    capicua: true,
  })
  const state = gameReducer(won, { type: 'UNDO' })

  assert.equal(state.teams[0].score, 0)
  assert.deepEqual(state.gamesWon, [0, 0])
  assert.equal(state.gameOver, false)
  assert.equal(state.rounds.length, 0)
})

test('starts the next game without clearing match wins or team names', () => {
  const won = gameReducer(freshState(), {
    type: 'ADD_POINTS',
    teamIdx: 0,
    points: 200,
    capicua: false,
  })
  const named = gameReducer(won, { type: 'SET_TEAM_NAME', teamIdx: 0, name: 'Casa' })
  const state = gameReducer(named, { type: 'NEW_GAME' })

  assert.equal(state.teams[0].name, 'Casa')
  assert.deepEqual(state.gamesWon, [1, 0])
  assert.equal(state.teams[0].score, 0)
})

test('resets the match while preserving team names', () => {
  const scored = gameReducer(freshState(), {
    type: 'ADD_POINTS',
    teamIdx: 1,
    points: 200,
    capicua: false,
  })
  const named = gameReducer(scored, { type: 'SET_TEAM_NAME', teamIdx: 1, name: 'Visitantes' })
  const state = gameReducer(named, { type: 'RESET_MATCH' })

  assert.equal(state.teams[1].name, 'Visitantes')
  assert.deepEqual(state.gamesWon, [0, 0])
  assert.equal(state.rounds.length, 0)
})

test('ignores invalid points and entries after the game is over', () => {
  const start = freshState()
  const invalid = gameReducer(start, { type: 'ADD_POINTS', teamIdx: 0, points: 0 })
  const won = gameReducer(start, { type: 'ADD_POINTS', teamIdx: 0, points: 200 })
  const afterWin = gameReducer(won, { type: 'ADD_POINTS', teamIdx: 1, points: 10 })

  assert.equal(invalid, start)
  assert.equal(afterWin, won)
})
