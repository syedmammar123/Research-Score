import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import Login from './pages/login/login.jsx'
import Home from './pages/home/home.jsx'
import SignUp from './pages/signup/signup.jsx'
import Protected from './components/Protected.jsx'
import Register from './pages/register/Register.jsx'
import Test from './pages/test.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <Routes>
      <Route path='/test' element={<Test/>}>

      </Route>
        <Route path="/" element={<App />} >
          <Route path="/login" element={<Login />} /> 
          <Route path="/signup" element={<SignUp />} /> 
          
          <Route path="/" element={<Protected />} >
              <Route path="/" element={<Home />} />           
              <Route path="/register" element={<Register />} />           
          </Route> 

        </Route> 

    </Routes>
      
      
      
    </BrowserRouter>

)
