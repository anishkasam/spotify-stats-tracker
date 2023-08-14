import React from 'react'
import { Link } from 'react-router-dom'

function navbar() {
  return (
    <div>
      <ul class="nav">
        <li class="nav-item">
          <Link class="nav-link" to="/">Home</Link>
        </li>
        <li class="nav-item">
          <Link class="nav-link" to="/Explore">Explore</Link>
        </li>
        <li class="nav-item">
          <Link class="nav-link" to="/Tracks">Tracks</Link>
        </li>
        <li class="nav-item">
          <Link class="nav-link " to="/Artists">Artists</Link>
        </li>
      </ul>
    </div>
  )
}

export default navbar