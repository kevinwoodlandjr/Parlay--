import { createContext, useContext, useReducer, useCallback } from 'react'
import { calculateParlayOdds, calculatePayout } from '../utils/odds'

const ParlayContext = createContext(null)

const initialState = {
  legs: [],       // Array of { id, gameId, type, pick, odds, game, description }
  wager: 10,      // Default wager amount
}

function parlayReducer(state, action) {
  switch (action.type) {
    case 'ADD_LEG': {
      // Don't add duplicate legs
      const exists = state.legs.find(
        l => l.gameId === action.payload.gameId && l.type === action.payload.type && l.pick === action.payload.pick
      )
      if (exists) return state

      // Remove any existing leg for same game + same bet type
      const filtered = state.legs.filter(
        l => !(l.gameId === action.payload.gameId && l.type === action.payload.type)
      )

      return {
        ...state,
        legs: [...filtered, { ...action.payload, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }],
      }
    }
    case 'TOGGLE_LEG': {
      // If exact leg exists, remove it (toggle off)
      const existing = state.legs.find(
        l => l.gameId === action.payload.gameId && l.type === action.payload.type && l.pick === action.payload.pick
      )
      if (existing) {
        return { ...state, legs: state.legs.filter(l => l.id !== existing.id) }
      }

      // Otherwise, replace same game+type and add (same as ADD_LEG)
      const filtered = state.legs.filter(
        l => !(l.gameId === action.payload.gameId && l.type === action.payload.type)
      )
      return {
        ...state,
        legs: [...filtered, { ...action.payload, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }],
      }
    }
    case 'REMOVE_LEG':
      return {
        ...state,
        legs: state.legs.filter(l => l.id !== action.payload),
      }
    case 'UPDATE_LEG_ODDS':
      return {
        ...state,
        legs: state.legs.map(l =>
          l.id === action.payload.id ? { ...l, odds: action.payload.odds } : l
        ),
      }
    case 'CLEAR_LEGS':
      return { ...state, legs: [] }
    case 'SET_WAGER':
      return { ...state, wager: Math.max(0, action.payload) }
    case 'LOAD_PARLAY':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export function ParlayProvider({ children }) {
  const [state, dispatch] = useReducer(parlayReducer, initialState)

  const addLeg = useCallback((leg) => {
    dispatch({ type: 'ADD_LEG', payload: leg })
  }, [])

  const removeLeg = useCallback((legId) => {
    dispatch({ type: 'REMOVE_LEG', payload: legId })
  }, [])

  const updateLegOdds = useCallback((id, odds) => {
    dispatch({ type: 'UPDATE_LEG_ODDS', payload: { id, odds } })
  }, [])

  const clearLegs = useCallback(() => {
    dispatch({ type: 'CLEAR_LEGS' })
  }, [])

  const setWager = useCallback((amount) => {
    dispatch({ type: 'SET_WAGER', payload: amount })
  }, [])

  const toggleLeg = useCallback((leg) => {
    dispatch({ type: 'TOGGLE_LEG', payload: leg })
  }, [])

  const loadParlay = useCallback((data) => {
    dispatch({ type: 'LOAD_PARLAY', payload: data })
  }, [])

  const parlayOdds = calculateParlayOdds(state.legs)
  const potentialPayout = calculatePayout(state.legs, state.wager)

  const value = {
    legs: state.legs,
    wager: state.wager,
    parlayOdds,
    potentialPayout,
    addLeg,
    toggleLeg,
    removeLeg,
    updateLegOdds,
    clearLegs,
    setWager,
    loadParlay,
  }

  return (
    <ParlayContext.Provider value={value}>
      {children}
    </ParlayContext.Provider>
  )
}

export function useParlay() {
  const ctx = useContext(ParlayContext)
  if (!ctx) throw new Error('useParlay must be used within ParlayProvider')
  return ctx
}
