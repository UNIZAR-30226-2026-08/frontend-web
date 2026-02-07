import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import Login from '@/pages/Login/Login'
import SignUp from '@/pages/SignUp/SignUp'
import Loading from '@/pages/Loading/Loading'
import { PageHeader } from '@/components/layout/PageHeader'
import { GameMode } from '@/pages/GameMode/GameMode'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <GameMode />
    </>
  )
}

export default App
