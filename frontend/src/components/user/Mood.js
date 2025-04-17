import React, { useState, useContext, useEffect } from 'react';
import Typewriter from 'typewriter-effect';
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, BarElement, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

const Swal = require("sweetalert2");
ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend);

export default function Mood() {
  const [currentMood, setCurrentMood] = useState(null);
  const [userMoodData, setUserMoodData] = useState([]);
  const { authTokens, user } = useContext(AuthContext);
  const [mood, setMood] = useState([]);
  const navigate = useNavigate();
  
  const accessToken = authTokens?.access;
  const userId = user?.user_id;

  const moodTypes = [
    { id: "Happy", icon: "bi-emoji-laughing-fill", color: "#4CAF50", hoverColor: "#2E7D32" },
    { id: "Sad", icon: "bi-emoji-frown-fill", color: "#F44336", hoverColor: "#C62828" },
    { id: "Anxious", icon: "bi-emoji-smile-upside-down-fill", color: "#FFEB3B", hoverColor: "#FBC02D" },
    { id: "Cry", icon: "bi-emoji-tear-fill", color: "#2196F3", hoverColor: "#1565C0" },
    { id: "Chill", icon: "bi-emoji-sunglasses-fill", color: "#00BCD4", hoverColor: "#00838F" },
    { id: "Neutral", icon: "bi-emoji-neutral-fill", color: "#9E9E9E", hoverColor: "#616161" }
  ];

  const saveCurrentMood = async (moodType) => {
    setCurrentMood(moodType);
    
    if (!accessToken) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'Please log in to track your mood',
        icon: 'info',
        confirmButtonText: 'Go to Login',
        confirmButtonColor: '#4361ee',
        background: '#fff',
        color: '#333',
        showClass: {
          popup: 'animate__animated animate__fadeIn'
        }
      }).then(() => {
        navigate("/login");
      });
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
        Swal.fire({
          title: 'You have already tracked your mood',
          text: 'Mood has already been tracked for today. ',
          icon: 'info',
          confirmButtonText: 'Got it',
          confirmButtonColor: '#4361ee',
          background: '#fff',
          color: '#333',
          showClass: {
            popup: 'animate__animated animate__fadeIn'
          }
        });
        
        return;
      }

      Swal.fire({
        title: 'Mood Tracked Successfully',
        text: 'Your mood has been saved successfully.We are proud of you for your progress. Small steps lead to great progress.',
        icon: 'success',
        confirmButtonText: 'Continue',
        confirmButtonColor: '#4361ee',
        background: '#fff',
        color: '#333',
        showClass: {
          popup: 'animate__animated animate__fadeIn'
        }
      });

      
      fetchMoodHistory();
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: 'Something Went Wrong',
        text: 'Unable to save your mood. Please try again later.',
        icon: 'error',
        confirmButtonText: 'Okay',
        confirmButtonColor: '#4361ee',
        background: '#fff',
        color: '#333'
      });
    }
  };

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

  useEffect(() => {
    fetchMoodHistory();
    
    if (!user || !accessToken) {
      Swal.fire({
               title: "You need to be logged in",
               text: "Please log in to use mood tracker feature",
               icon: "warning",
               confirmButtonText: "Go to Login",
             }).then(() => {
               navigate("/login"); 
             });
    }
  }, [accessToken, userId, user, navigate]);
  
  // Process mood data for the chart
  const moodData = userMoodData.reduce((acc, curr) => {
    const date = curr.mood_date;
    if (!acc[date]) {
      acc[date] = { Happy: 0, Sad: 0, Anxious: 0, Cry: 0, Chill: 0, Neutral: 0 };
    }
    acc[date][curr.type_mood]++;
    return acc;
  }, {});
 
  const chartLabels = Object.keys(moodData)
    .sort((a, b) => new Date(a) - new Date(b))  
    .slice(-7); // last 7 days
    
  const chartData = {
    labels: chartLabels.map(date => {
      const d = new Date(date);
      return `${d.getDate()}/${d.getMonth() + 1}`; 
    }),
    datasets: Object.keys(moodTypes.reduce((obj, item) => {
      obj[item.id] = true;
      return obj;
    }, {})).map(moodType => {
      const mood = moodTypes.find(m => m.id === moodType) || {};
      return {
        label: moodType,
        data: chartLabels.map(date => moodData[date]?.[moodType] || 0),
        backgroundColor: mood.color || '#9E9E9E',
        borderColor: mood.hoverColor || '#616161',
        borderWidth: 1,
        borderRadius: 6,
      };
    }),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          padding: 20,
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;  
          },
        },
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 13
        }
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          font: {
            family: "'Inter', sans-serif",
            size: 14,
            weight: 'bold',
          },
          padding: {top: 10, bottom: 0}
        },
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Frequency',
          font: {
            family: "'Inter', sans-serif",
            size: 14,
            weight: 'bold',
          },
          padding: {top: 0, bottom: 10}
        },
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          precision: 0,
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };

  return (
    <div className="mood-tracker-container py-5">
      <div className="container">
        <div className="mood-card shadow-lg rounded-4 overflow-hidden">
          <div className="row g-0">
            <div className="col-lg-4 bg-success d-flex align-items-center justify-content-center p-4">
              <div className="text-center text-white py-4">
                <h2 className="display-6 fw-bold mb-3">Mood Tracker</h2>
                <div className="mood-prompt mb-3">
                  <i className="bi bi-heart-pulse mb-3 fs-1"></i>
                  <div className="fs-5 fw-light">
                    <Typewriter
                      options={{
                        autoStart: true,
                        loop: true,
                        delay: 50,
                        deleteSpeed: 30,
                        strings: [
                          "How are you feeling today?", 
                          "Track your emotional journey...",
                          "Your wellness matters to us.",
                          "Self-awareness starts here."
                        ],
                      }}
                    />
                  </div>
                </div>
                
                <div className="d-none d-lg-block">
                  <div className="quote-box p-3 bg-white bg-opacity-10 rounded-3 mt-4">
                    <p className="fst-italic mb-1">"There is hope, even when your brain tells you there isn’t."</p>
                    <small className="d-block text-end">— John Green</small>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-8">
              <div className="p-4 p-lg-5">
                <h3 className="mb-4 fw-normal text-dark">Choose your mood for today</h3>
                
                <div className="mood-icons-container mb-5">
                  <div className="row g-3 justify-content-center">
                    {moodTypes.map((mood) => (
                      <div className="col-4 col-md-2" key={mood.id}>
                        <div 
                          className={`mood-icon-card p-3 rounded-4 text-center ${currentMood === mood.id ? 'selected' : ''}`} 
                          onClick={() => saveCurrentMood(mood.id)}
                          style={{
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            backgroundColor: currentMood === mood.id ? mood.color : 'rgba(0,0,0,0.03)',
                            color: currentMood === mood.id ? '#fff' : '#212529',
                          }}
                          onMouseEnter={(e) => {
                            if (currentMood !== mood.id) {
                              e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.06)';
                              e.currentTarget.style.transform = 'translateY(-3px)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentMood !== mood.id) {
                              e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }
                          }}
                        >
                          <i className={`bi ${mood.icon} fs-1 mb-2`} style={{ color: currentMood === mood.id ? '#fff' : mood.color }}></i>
                          <p className="mb-0 fw-medium">{mood.id}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mood-chart-container">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="fw-normal text-dark m-0">Mood history</h3>
                    <div className="badge bg-light text-secondary px-3 py-2">Last 7 days</div>
                  </div>
                  
                  <div className="chart-wrapper" style={{ height: '300px' }}>
                    {userMoodData.length > 0 ? (
                      <Bar data={chartData} options={chartOptions} />
                    ) : (
                      <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center p-4">
                        <i className="bi bi-graph-up text-secondary opacity-50 fs-1 mb-3"></i>
                        <h5 className="text-secondary">Track your first mood..</h5>
                        <p className="text-secondary opacity-75 mb-0">Your progress will be displayed here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      
    </div>
  );
}