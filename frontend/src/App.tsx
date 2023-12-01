import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-500 underline">
        Hi there
      </h1>
      <button onClick={() => setCount(count+1)}>
        Click me: {count}
      </button>
    </div>
  )
}

export default App
