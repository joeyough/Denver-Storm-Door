import React from 'react'
import ReactDOM from 'react-dom/client'
import DoorBuilder from './DoorBuilder'
import StormDoorMeasure from './StormDoorMeasure.jsx'

function Router() {
  const path = window.location.hash
  if (path === '#measure') return <StormDoorMeasure />
  return <DoorBuilder />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
)
