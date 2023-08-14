import React from 'react'
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

function Artists() {
  const token = localStorage.getItem("token")
  const [artists, setArtists] = useState([])
  const [graphLabels, setLabels] = useState([])
  const [graphData, setDataset] = useState([])
  const [range, setRange] = useState()

  useEffect(() => {
    setShort()
    document.getElementsByClassName("page-button")[0].classList.add("focused");
    document.getElementsByClassName("page-button")[1].classList.add("not-focused");
    document.getElementsByClassName("page-button")[2].classList.add("not-focused");
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const setShort = async (e) => {
    document.getElementsByClassName("page-button")[0].classList.remove("not-focused");
    document.getElementsByClassName("page-button")[0].classList.add("focused");
    document.getElementsByClassName("page-button")[1].classList.remove("focused");
    document.getElementsByClassName("page-button")[1].classList.add("not-focused");
    document.getElementsByClassName("page-button")[2].classList.add("not-focused");
    document.getElementsByClassName("page-button")[2].classList.remove("focused");
    const {data} = await axios.get("https://api.spotify.com/v1/me/top/artists", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        time_range: "short_term",
        limit: 50,
        offset: 0
      }
    })

    setArtists(data.items)
    console.log(data.items)
    setRange("(last 4 weeks)")

    const dict = {};
    for (let i = 0; i < data.items.length; i++) {
      var genre = data.items[i].genres[0];
      if (genre in dict && genre !== undefined) {
        dict[genre]++;
      }
      else {
        dict[genre] = 1;
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

  const setMed = async (e) => {
    document.getElementsByClassName("page-button")[0].classList.remove("focused");
    document.getElementsByClassName("page-button")[0].classList.add("not-focused");
    document.getElementsByClassName("page-button")[1].classList.add("focused");
    document.getElementsByClassName("page-button")[1].classList.remove("not-focused");
    document.getElementsByClassName("page-button")[2].classList.add("not-focused");
    document.getElementsByClassName("page-button")[2].classList.remove("focused");
    const {data} = await axios.get("https://api.spotify.com/v1/me/top/artists", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        time_range: "medium_term",
        limit: 50,
        offset: 0
      }
    })

    setArtists(data.items)
    setRange("(last 6 months)")

    const dict = {};
    for (let i = 0; i < data.items.length; i++) {
      var genre = data.items[i].genres[0];
      if (genre in dict && genre !== undefined) {
        dict[genre]++;
      }
      else {
        dict[genre] = 1;
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
    const {data} = await axios.get("https://api.spotify.com/v1/me/top/artists", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        time_range: "long_term",
        limit: 50,
        offset: 0
      }
    })

    setArtists(data.items)
    setRange("(all time)")

    const dict = {};
    for (let i = 0; i < data.items.length; i++) {
      var genre = data.items[i].genres[0];
      if (genre in dict && genre !== undefined) {
        dict[genre]++;
      }
      else {
        dict[genre] = 1;
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

  const displayArtists = () => {
    return artists.map((artist, index) => (
      <div id={artist.id} className="component">
        <a href={artist.external_urls.spotify} target="_blank" rel="noreferrer" className="link-opacity-100"><h6 className="fw-light">{index + 1}. <img src={artist.images[2].url} alt="" className="album-cover"></img>{artist.name}</h6></a>
      </div>
    ))
  }

  return (
    <div className="App">
      <Navbar></Navbar>     
      <div className="container">
        <div className="text-center">
          <h1 className="fw-light page-heading">Top Artists {range}</h1>
          <button onClick={setShort} className="btn page-button shadow-none">last 4 weeks</button>
          <button onClick={setMed} className="btn page-button shadow-none">last 6 months</button>
          <button onClick={setLong} className="btn page-button shadow-none">all time</button>
        {displayArtists()}
        </div>
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
                text: "Genre Frequencies Across Top Artists",
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
  )
}

export default Artists