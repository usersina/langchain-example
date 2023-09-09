import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Base from './layout/Base.tsx'
import './styles/index.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Base>
      <App />
    </Base>
  </React.StrictMode>
)
