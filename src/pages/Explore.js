import React from 'react'
import Navbar from '../components/navbar';
import {useState} from "react";
import axios from 'axios';

function Explore() {
  const token = localStorage.getItem("token");
  const [searchKey, setSearchKey] = useState("")
  const [tracks, setTracks] = useState([])
  const [query, setQuery] = useState([])
  
  const search = async(e) => {
    e.preventDefault()
    setTracks([])
    const {data} = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: searchKey,
        type: "track",
        limit: 1
      }
    })

    setQuery(data.tracks)
    console.log(data.tracks)
    console.log(data.tracks)
    const song_id = data.tracks.items[0].id;
    const features = await getFeatures(song_id)
    const playlists = await getPlaylists()
    const song_ids = []

    for (let i = 0; i < playlists.length; i++) {
      const songs = await getSongs(playlists[i])
      song_ids.push.apply(song_ids, songs)
    }

    const distances = {}
    for (let i = 1; i < Math.floor(song_ids.length / 50); i++) {
      const subset = song_ids.slice(50 * (i - 1), 50 * i)
      const song_string = subset.join(",")
      const songs_features = await getMultipleFeatures(song_string)
      console.log(songs_features)
      for (let j = 0; j < songs_features.length; j++) {
        try {
          const id = songs_features[j].id
          const acousticness = songs_features[j].acousticness
          const danceability = songs_features[j].danceability
          const energy = songs_features[j].energy
          const instrumentalness = songs_features[j].instrumentalness
          const liveness = songs_features[j].liveness
          const loudness = songs_features[j].loudness / -60
          const speechiness = songs_features[j].speechiness
          const tempo = songs_features[j].tempo / 200
          const valence = songs_features[j].valence
          const feature_array = [acousticness, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, valence]

          distances[id] = distance(features, feature_array)
        }
        catch (error) {
          console.log(error)
        }
      }
    }

    var sorted = Object.keys(distances).map(function(key) {
      return [key, distances[key]];
    });

    sorted.sort(function(first, second) {
      return first[1] - second[1];
    });

    const id_string = sorted[0][0] + "," + sorted[1][0] + "," + sorted[2][0]

    getTopSongs(id_string)
  }

  const getFeatures = async(song_id) => {
    try {
      const {data} = await axios.get(`https://api.spotify.com/v1/audio-features/${song_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const acousticness = data.acousticness
      const danceability = data.danceability
      const energy = data.energy
      const instrumentalness = data.instrumentalness
      const liveness = data.liveness
      const loudness = data.loudness / -60
      const speechiness = data.speechiness
      const tempo = data.tempo / 200
      const valence = data.valence
      
      return [acousticness, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, valence]
    }
    catch (error) {
      return [0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
  }

  const getMultipleFeatures = async(song_ids) => {
    try {
      const {data} = await axios.get("https://api.spotify.com/v1/audio-features", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          ids: song_ids
        }
      })
  
      return data.audio_features
    }
    catch (error) {
      console.log(error)
    }
  }

  const getPlaylists = async() => {
    const {data} = await axios.get("https://api.spotify.com/v1/browse/featured-playlists", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        limit: 50
      }
    })

    const playlist_ids = []
    for (let i = 0; i < data.playlists.items.length; i++) {
      playlist_ids.push(data.playlists.items[i].id)
    }

    return playlist_ids
  }

  const getSongs = async(playlist_id) => {
    try {
      const {data} = await axios.get(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      const song_ids = []
      for (let i = 0; i < data.items.length; i++) {
        song_ids.push(data.items[i].track.id)
      }

      return song_ids
    }
    catch (error) {
      console.log(error)
    }
  }

  function distance(song1, song2) {
    var sum = 0;

    for (let i = 0; i < song1.length; i++) {
      sum += ((song1[i] - song2[i]) ** 2)
    }

    return sum ** 0.5
  }

  const getTopSongs = async(song_ids) => {
    const {data} = await axios.get("https://api.spotify.com/v1/tracks", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        ids: song_ids
      }
    })

    setTracks(data.tracks)
  }

  const displayTracks = () => {
    return tracks?.map(track => (
      <div key={track.id} className="component">
        <a href={track.external_urls.spotify} target="_blank" rel="noreferrer" className="link-opacity-100"><h6 className="fw-light"><img src={track.album.images[2].url} alt="" className="album-cover"></img>{track.name} - {track.artists[0].name}</h6></a>
      </div>
    ))
  }

  const displayQuery = () => {
    if (tracks.length !== 0) {
      return (
        <div key={query.items.id} className="component">
          <p className="prompt">Displaying search results for:</p>
          <a href={query.items[0].external_urls.spotify} target="_blank" rel="noreferrer" className="link-opacity-100"><h6 className="fw-light"><img src={query.items[0].album.images[2].url} alt="" className="album-cover"></img>{query.items[0].name} - {query.items[0].artists[0].name}</h6></a>
          <p className="prompt">Search results:</p>
        </div>
      )
    }
    if (query.length !== 0) {
      return (
        <div key={query.items.id} className="component">
          <p className="prompt">Loading search results for:</p>
          <a href={query.items[0].external_urls.spotify} target="_blank" rel="noreferrer" className="link-opacity-100"><h6 className="fw-light"><img src={query.items[0].album.images[2].url} alt="" className="album-cover"></img>{query.items[0].name} - {query.items[0].artists[0].name}</h6></a>
        </div>
      )
    }
  }

  return (
    <div className="App">
      <Navbar></Navbar>
      <div className="container">
        <div className="text-center">
          <h1 className="fw-light page-heading">Explore</h1>
          <form class="input-group mb-3" onSubmit={search}>
            <input onChange={e => setSearchKey(e.target.value)} required type="text" class="form-control" placeholder="Song Title" aria-label="Song Title" aria-describedby="basic-addon2"/>
            <div class="input-group-append">
              <button class="btn btn-outline-secondary submit-button" type={"submit"}>Search</button>
            </div>
          </form>
          {displayQuery()}
          {displayTracks()}
        </div>
      </div>
    </div>
  )
}

export default Explore