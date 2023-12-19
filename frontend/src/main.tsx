import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './login.tsx'
import Timer from './Timer.tsx'
import Bar from './components/sidebar.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <div>
    <Bar />
  </div>,
)
