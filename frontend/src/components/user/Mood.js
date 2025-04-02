import React, { useState, useContext, useEffect } from 'react';
import Typewriter from 'typewriter-effect';
import AuthContext from "../../context/AuthContext";

import { Link } from "react-router-dom";
import { Bar } from 'react-chartjs-2'; 
import { Chart as ChartJS, CategoryScale, BarElement, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

const msg = require("sweetalert2");
ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend);

export default function Mood() {
  const [currentMood, setCurrentMood] = useState(null);
  const[userMoodData, setUserMoodData] = useState([]);
  const { authTokens, user } = useContext(AuthContext);
  const [mood, setMood] = useState([]);

  const accessToken = authTokens?.access;
  const userId = user?.user_id;

  const saveCurrentMood = async (moodType) => {
    setCurrentMood(moodType);
    console.log("Selected mood:", moodType);

    if (!accessToken) {
      console.error("Access token is missing");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/mood/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, 
        },
        body: JSON.stringify({
          type_mood: moodType, 
          mood_date: new Date().toISOString().split('T')[0],
          user_id: userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        msg.fire({
          title: 'You have already tracked your mood for today :)',
          text: 'You are doing great. We are here for you if you required any help',
          icon: 'error',
          confirmButtonText: 'Okay',
          background: '#fff',
          color: '#000',
        });
        throw new Error(`Failed to save mood: ${errorData.message || 'Unknown error'}`);
        
      }

      msg.fire({
        title: 'Mood tracked successfully!',
        text: 'Please be patient with yourself. I am proud of you.',
        icon: 'success',
        confirmButtonText: 'Okay',
        background: '#fff',
        color: '#000',
      });

      const data = await response.json();
      console.log("Mood saved:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchMoodHistory = async () => {
      if (!accessToken) return;
      
      try {
        const response = await fetch("http://127.0.0.1:8000/api/mood/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Mood Data:", data);

        if (Array.isArray(data)) {
          setMood(data);
          const userMood = data.filter((item) => item.user_id === userId);
          setUserMoodData(userMood);
        } else {
          console.error("Unexpected response format", data);
          setMood([]);
          setUserMoodData([]);
        }
      } catch (error) {
        console.error("Error fetching mood history:", error);
        setMood([]);
        setUserMoodData([]);
      }
    };

    fetchMoodHistory();
  }, [accessToken, userId]);
  

  const moodData = userMoodData.reduce((acc, curr) => {
    const date = curr.mood_date;
    if (!acc[date]) {
      acc[date] = { Happy: 0, Sad: 0, Anxious: 0, Cry: 0, Chill: 0, Neutral: 0 };
    }
    acc[date][curr.type_mood]++;
    return acc;
  }, {});
 
  const chartLabels = Object.keys(moodData)
  .sort((a, b) => new Date(b) - new Date(a))   //in descending order
  .slice(0, 7); //only to display first 7 
  const chartData = {
    labels: chartLabels,
    datasets: Object.keys(moodData[chartLabels[0]] || {}).map(moodType => ({
      label: moodType,
      data: chartLabels.map(date => moodData[date][moodType] || 0),
      backgroundColor: moodType === 'Happy' ? '#4CAF50' : 
                       moodType === 'Sad' ? '#F44336' :
                       moodType === 'Anxious' ? '#FFEB3B' : 
                       moodType === 'Cry' ? '#2196F3' : 
                       moodType === 'Chill' ? '#00BCD4' : '#9E9E9E',  
      borderColor: moodType === 'Happy' ? '#388E3C' : 
                   moodType === 'Sad' ? '#D32F2F' :
                   moodType === 'Anxious' ? '#FBC02D' : 
                   moodType === 'Cry' ? '#1976D2' : 
                   moodType === 'Chill' ? '#00897B' : '#616161',  
      borderWidth: 1,
    })),
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;  
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Mood Count',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        beginAtZero: true,
      },
    },
  };

  if (!user || !accessToken) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="text-center p-5 shadow-lg rounded bg-success-subtle text-success-emphasis ">
          <i className="bi bi-lock-fill fs-1 mb-4"></i>
          <h2 className="fs-3 mb-3">Please log in to select your mood</h2>
          <p className="fs-5 mb-4">Log in to interact with this feature. Thank you!</p>
          <Link to="/login" className="fw-bold fs-5">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="container d-flex justify-content-center align-items-center">
        <div className="mood-box p-3 m-4 text-center bg-primary-subtle text-primary-emphasis rounded w-75">
          <div className="fw-light fs-2">
            <i className="bi bi-person-raised-hand"></i>
            <Typewriter
              options={{
                autoStart: true,
                loop: true,
                delay: 100,
                deleteSpeed: 100,
                strings: ["Hey! How are you feeling today?"],
              }}
            />
          </div>
          <div className="mood-icons d-flex flex-wrap flex-row mt-3 fs-1">
            <div className="sad col-4 col-sm-2" onClick={() => saveCurrentMood("Sad")}>
              <i className="bi bi-emoji-frown-fill"></i>
              <p className="fs-6 fw-lighter">Sad</p>
            </div>
            <div className="happy col-4 col-sm-2" onClick={() => saveCurrentMood("Happy")}>
              <i className="bi bi-emoji-laughing-fill"></i>
              <p className="fs-6 fw-lighter">Happy</p>
            </div>
            <div className="anxious col-4 col-sm-2" onClick={() => saveCurrentMood("Anxious")}>
              <i className="bi bi-emoji-smile-upside-down-fill"></i>
              <p className="fs-6 fw-lighter">Anxious</p>
            </div>
            <div className="cry col-4 col-sm-2" onClick={() => saveCurrentMood("Cry")}>
              <i className="bi bi-emoji-tear-fill"></i>
              <p className="fs-6 fw-lighter">Cry</p>
            </div>
            <div className="chill col-4 col-sm-2" onClick={() => saveCurrentMood("Chill")}>
              <i className="bi bi-emoji-sunglasses-fill"></i>
              <p className="fs-6 fw-lighter">Chill</p>
            </div>
            <div className="neutral col-4 col-sm-2" onClick={() => saveCurrentMood("Neutral")}>
              <i className="bi bi-emoji-neutral-fill"></i>
              <p className="fs-6 fw-lighter">Neutral</p>
            </div>
          </div>
          <div className="chart-container mt-5">
          <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
        
      </div>
    </div>
  );
}
