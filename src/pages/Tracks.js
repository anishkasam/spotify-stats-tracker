import React from 'react';
import '../App.css';
import Navbar from '../components/navbar';
import {useEffect, useState} from "react";
import axios from 'axios';
import {
  Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Title, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  Title, BarElement, CategoryScale, LinearScale, Tooltip, Legend
)
ChartJS.defaults.color = 'white';


function Tracks() {
  const token = localStorage.getItem("token")
  const [tracks, setTracks] = useState([])
  const [graphLabels, setLabels] = useState([])
  const [graphData, setDataset] = useState([])
  const [range, setRange] = useState()

  useEffect(() => {
    setShort();
    document.getElementsByClassName("page-button")[0].classList.add("focused");
    document.getElementsByClassName("page-button")[1].classList.add("not-focused");
    document.getElementsByClassName("page-button")[2].classList.add("not-focused");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) 

  const setShort = async (e) => {
    document.getElementsByClassName("page-button")[0].classList.remove("not-focused");
    document.getElementsByClassName("page-button")[0].classList.add("focused");
    document.getElementsByClassName("page-button")[1].classList.remove("focused");
    document.getElementsByClassName("page-button")[1].classList.add("not-focused");
    document.getElementsByClassName("page-button")[2].classList.add("not-focused");
    document.getElementsByClassName("page-button")[2].classList.remove("focused");
    const {data} = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        time_range: "short_term",
        limit: 50,
        offset: 0
      }
    })

    setTracks(data.items)
    setRange("(last 4 weeks)")
    console.log(data.items)

    const dict = {};
    for (let i = 0; i < data.items.length; i++) {
      var artist_name = data.items[i].artists[0].name;
      if (artist_name in dict) {
        dict[artist_name]++;
      }
      else {
        dict[artist_name] = 1;
      }
    }
    
    var freq = Object.keys(dict).map(function(key) {
      return [key, dict[key]];
    });
    console.log(freq);

    freq.sort(function(first, second) {
      return second[1] - first[1];
    });

    try {
        setLabels([freq[1][0], freq[0][0], freq[2][0], freq[3][0], freq[4][0]])
        setDataset([freq[1][1], freq[0][1], freq[2][1], freq[3][1], freq[4][1]])
    }
    catch {
        setLabels([freq[1][0], freq[0][0], freq[2][0], freq[3][0]])
        setDataset([freq[1][1], freq[0][1], freq[2][1], freq[3][1]])
    }
  }

  const setMed = async (e) => {
    document.getElementsByClassName("page-button")[0].classList.remove("focused");
    document.getElementsByClassName("page-button")[0].classList.add("not-focused");
    document.getElementsByClassName("page-button")[1].classList.add("focused");
    document.getElementsByClassName("page-button")[1].classList.remove("not-focused");
    document.getElementsByClassName("page-button")[2].classList.add("not-focused");
    document.getElementsByClassName("page-button")[2].classList.remove("focused");
    const {data} = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        time_range: "medium_term",
        limit: 50,
        offset: 0
      }
    })

    setTracks(data.items)
    setRange("(last 6 months)")

    const dict = {};
    for (let i = 0; i < data.items.length; i++) {
      var artist_name = data.items[i].artists[0].name;
      if (artist_name in dict) {
        dict[artist_name]++;
      }
      else {
        dict[artist_name] = 1;
      }
    }
    
    var freq = Object.keys(dict).map(function(key) {
      return [key, dict[key]];
    });

    freq.sort(function(first, second) {
      return second[1] - first[1];
    });

    setLabels([freq[1][0], freq[0][0], freq[2][0], freq[3][0], freq[4][0]])
    setDataset([freq[1][1], freq[0][1], freq[2][1], freq[3][1], freq[4][1]])
  }

  const setLong = async (e) => {
    document.getElementsByClassName("page-button")[0].classList.remove("focused");
    document.getElementsByClassName("page-button")[0].classList.add("not-focused");
    document.getElementsByClassName("page-button")[1].classList.remove("focused");
    document.getElementsByClassName("page-button")[1].classList.add("not-focused");
    document.getElementsByClassName("page-button")[2].classList.remove("not-focused");
    document.getElementsByClassName("page-button")[2].classList.add("focused");
    const {data} = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        time_range: "long_term",
        limit: 50,
        offset: 0
      }
    })

    setTracks(data.items)
    setRange("(all time)")

    const dict = {};
    for (let i = 0; i < data.items.length; i++) {
      var artist_name = data.items[i].artists[0].name;
      if (artist_name in dict) {
        dict[artist_name]++;
      }
      else {
        dict[artist_name] = 1;
      }
    }
    
    var freq = Object.keys(dict).map(function(key) {
      return [key, dict[key]];
    });

    freq.sort(function(first, second) {
      return second[1] - first[1];
    });

    setLabels([freq[1][0], freq[0][0], freq[2][0], freq[3][0], freq[4][0]])
    setDataset([freq[1][1], freq[0][1], freq[2][1], freq[3][1], freq[4][1]])
  }

  const displayTracks = () => {
    return tracks?.map((track, index) => (
      <div key={track.id} className="component">
        <a href={track.external_urls.spotify} target="_blank" rel="noreferrer" className="link-opacity-100"><h6 className="fw-light">{index + 1}. <img src={track.album.images[2].url} alt="" className="album-cover"></img>{track.name} - {track.artists[0].name}</h6></a>
      </div>
    ))
  }

  return (
    <div className='App'>
      <Navbar></Navbar>     
      <div className="container">
        <div className="text-center">
          <h1 className="fw-light page-heading">Top Tracks {range}</h1>
          <button onClick={setShort} className="btn page-button shadow-none">last 4 weeks</button>
          <button onClick={setMed} className="btn page-button shadow-none">last 6 months</button>
          <button onClick={setLong} className="btn page-button shadow-none">all time</button>
          {displayTracks()}
          <div className="graph">
            <Bar data={{
            labels: graphLabels,
            datasets: [{
              label: ' Frequency',
              data: graphData,
              backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              ],
              borderColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 206, 86)',
              'rgb(75, 192, 192)',
              'rgb(153, 102, 255)'
              ],
              borderWidth: 2.5
            }]
            }} options={{
            responsive: true,
            indexAxis: 'y',
            maintainAspectRatio: true,
            plugins: {
              title: {
                display: true,
                text: "Artist Frequencies Across Top Tracks",
                font: {
                  size: 20,
                  weight: 350,
                  family: "Helvetica Neue"
                }
              },
              legend: {
                display: false,
                labels: {
                  color: "white"
                }
              }
            },
            scales: {
              y: {
                ticks: {
                  color: "white",
                  font: {
                    size: 15
                  }
                }
              }
            }
            }}></Bar>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default Tracks