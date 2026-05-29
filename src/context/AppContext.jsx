import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { ITEMS } from '../data/items'

const STORAGE_KEY = 'bs-inventory-session'

const defaultOrder = ITEMS.map(item => item.id)

const initialSession = {
  screen: 'start',
  currentIndex: 0,
  counts: {},           // { [itemId]: number | null }  null = skipped
  notes: {},            // { [itemId]: string }
  itemOrder: defaultOrder,
  startedAt: null,
  submittedAt: null,
  direction: 'forward',
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

function moveItem(order, index, direction) {
  const next = [...order]
  const swapWith = index + direction
  if (swapWith < 0 || swapWith >= next.length) return order
  ;[next[index], next[swapWith]] = [next[swapWith], next[index]]
  return next
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
      if (next >= state.itemOrder.length) {
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

    case 'REORDER_UP':
      return { ...state, itemOrder: moveItem(state.itemOrder, action.index, -1) }

    case 'REORDER_DOWN':
      return { ...state, itemOrder: moveItem(state.itemOrder, action.index, 1) }

    case 'REORDER_RESET':
      return { ...state, itemOrder: defaultOrder }

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

  // Always persist — itemOrder should survive across sessions
  useEffect(() => { save(state) }, [state])

  // Derive items sorted by current order
  const itemMap = Object.fromEntries(ITEMS.map(item => [item.id, item]))
  const items = state.itemOrder.map(id => itemMap[id]).filter(Boolean)

  return (
    <AppContext.Provider value={{ state, dispatch, items }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
