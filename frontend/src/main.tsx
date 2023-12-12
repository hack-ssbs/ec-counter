import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import login from './login.tsx'
import Timer from './Timer.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <App />
     */}
     <Timer />
  </React.StrictMode>,
)
