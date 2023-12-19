import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './login.tsx'
import Timer from './Timer.tsx'
import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <App /> */}
    <Login /> 
    {/* <Timer /> */}
  </React.StrictMode>,
)
