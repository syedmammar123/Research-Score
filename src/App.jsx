import { useState } from 'react'
import './App.css'
import SignUp from './pages/signup/signup'
import { Outlet } from 'react-router-dom'

function App() {

  return (
   <>
   <Outlet/>
   </>
  )
}

export default App
