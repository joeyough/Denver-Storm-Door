import React from 'react'
import ReactDOM from 'react-dom/client'
import DoorBuilder from './DoorBuilder'
import StormDoorMeasure from './StormDoorMeasure.jsx'

const path = window.location.pathname
const App = path.includes('measure') ? StormDoorMeasure : DoorBuilder

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
