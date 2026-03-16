import React from 'react'
import Table from './components/Table'
import './index.css'
import Header from './components/Header'

export default function App() {

  const [mode, setMode] = React.useState(() => {
    return localStorage.getItem('mode') || 'light'
  })

  function toggleMode() {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light')
  }

  React.useEffect(() => {
      document.documentElement.className = mode
      localStorage.setItem('mode', mode)
  }, [mode])

  return (
    <>
      <Header mode={mode} onToggleMode={toggleMode}/>
      <Table />
    </>
  )
}

