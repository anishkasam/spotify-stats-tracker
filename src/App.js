import './App.css';
import {useEffect, useState} from "react";
import Navbar from './components/navbar';

function App() {
  const CLIENT_ID = "6514e113203a4d26b2a0762922f95b98"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const SCOPE = "user-top-read%20user-read-recently-played"
  const RESPONSE_TYPE = "token" 
  const SHOW_DIALOG = "true"

  const [token, setToken] = useState("")

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

      window.location.hash = ""
      window.localStorage.setItem("token", token)
    }
    setToken(token)
  }, [])

  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }

  return (
    <div className="App">
      <Navbar></Navbar>
      <div className="container">
        <h1 className="header display-1">Spotify Stats Tracker</h1>
        <h2 className="fw-light">View your top artists & tracks and find new music!</h2>
        {!token ?
          <div>
            <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&show_dialog=${SHOW_DIALOG}`}><button className="btn btn-success btn-lg home-button">Login to Spotify</button></a>
          </div>
          :<button className="btn btn-success btn-lg home-button" onClick={logout}>Logout</button>
        }
      </div>
    </div>
  );
}

export default App;