import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from './routes/routes';

function App() {

  return (
    <Router>
      <Routes>
        {/* Routes will be defined here */}
        {routes}
      </Routes>

    </Router>
  )
}

export default App
