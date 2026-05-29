import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { ITEMS } from '../data/items'

const STORAGE_KEY = 'bs-inventory-session'

const initialSession = {
  screen: 'start',      // 'start' | 'count' | 'review' | 'success'
  currentIndex: 0,
  counts: {},           // { [itemId]: number | null }  null = skipped
  notes: {},            // { [itemId]: string }
  startedAt: null,
  submittedAt: null,
  direction: 'forward', // for transition hint
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...initialSession, ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return initialSession
}

function save(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch { /* ignore */ }
}

function reducer(state, action) {
  switch (action.type) {
    case 'START':
      return { ...state, screen: 'count', currentIndex: 0, startedAt: Date.now(), direction: 'forward' }

    case 'SET_COUNT': {
      const counts = { ...state.counts, [action.itemId]: action.value }
      return { ...state, counts }
    }

    case 'SET_NOTE': {
      const notes = { ...state.notes, [action.itemId]: action.value }
      return { ...state, notes }
    }

    case 'SKIP': {
      const counts = { ...state.counts, [action.itemId]: null }
      return { ...state, counts }
    }

    case 'NEXT': {
      const next = state.currentIndex + 1
      if (next >= ITEMS.length) {
        return { ...state, screen: 'review', direction: 'forward' }
      }
      return { ...state, currentIndex: next, direction: 'forward' }
    }

    case 'BACK': {
      if (state.currentIndex === 0) {
        return { ...state, screen: 'start', direction: 'back' }
      }
      return { ...state, currentIndex: state.currentIndex - 1, direction: 'back' }
    }

    case 'BACK_TO_COUNT':
      return { ...state, screen: 'count', currentIndex: action.index, direction: 'back' }

    case 'SUBMIT':
      return { ...state, screen: 'success', submittedAt: Date.now(), direction: 'forward' }

    case 'RESET':
      localStorage.removeItem(STORAGE_KEY)
      return initialSession

    default:
      return state
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, load)

  useEffect(() => {
    if (state.screen !== 'start') {
      save(state)
    }
  }, [state])

  return (
    <AppContext.Provider value={{ state, dispatch, items: ITEMS }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
