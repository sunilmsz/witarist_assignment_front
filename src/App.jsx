import { useState } from 'react'
import {Register}  from './Components/Register/Register'
import {Login} from './Components/Login/Login'
import {Dashboard} from './Components/Dashboard/DashBoard'
import { Routes, Route, BrowserRouter } from "react-router-dom"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    


      <BrowserRouter>
       <Routes>
           <Route path="/" element={   <Login />} />
           <Route path="/signup" element={   <Register />} />
           <Route path="/dashboard" element={   <Dashboard />} />
       </Routes>
     </BrowserRouter>
   <ToastContainer/>

 
    </>
  )
}

export default App
