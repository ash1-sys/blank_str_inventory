import { useState, useEffect, useRef } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import StartScreen from './screens/StartScreen'
import CountScreen from './screens/CountScreen'
import ReviewScreen from './screens/ReviewScreen'
import SuccessScreen from './screens/SuccessScreen'

function Inner() {
  const { state } = useApp()
  const { screen, direction } = state

  const [animClass, setAnimClass] = useState('')
  const prevScreen = useRef(screen)

  useEffect(() => {
    if (screen !== prevScreen.current) {
      if (screen === 'success') {
        setAnimClass('screen-fade')
      } else {
        setAnimClass(direction === 'back' ? 'screen-enter-left' : 'screen-enter')
      }
      prevScreen.current = screen
      const t = setTimeout(() => setAnimClass(''), 300)
      return () => clearTimeout(t)
    }
  }, [screen, direction])

  const props = { animClass }

  return (
    <div
      className="max-w-[430px] mx-auto h-[100dvh] overflow-hidden relative"
      style={{ backgroundColor: '#F0EDE8' }}
    >
      {screen === 'start'   && <StartScreen   {...props} />}
      {screen === 'count'   && <CountScreen   {...props} />}
      {screen === 'review'  && <ReviewScreen  {...props} />}
      {screen === 'success' && <SuccessScreen {...props} />}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Inner />
    </AppProvider>
  )
}
