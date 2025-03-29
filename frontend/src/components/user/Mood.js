import React, { useState, useContext, useEffect} from 'react';
import Typewriter from 'typewriter-effect';
import AuthContext from "../../context/AuthContext";
import { Link } from "react-router-dom";
const msg = require("sweetalert2");


export default function Mood() {
  const [currentMood, setCurrentMood] = useState(null);
  const { authTokens,user } = useContext(AuthContext);
  const [mood, setMood] = useState(null);
  

  const accessToken = authTokens?.access;
  const userId = user?.user_id;
  
  const saveCurrentMood = async (mood) => {
    setCurrentMood(mood);
    console.log("Selected mood:", mood);
  
    if (!accessToken) {
      console.error("Access token is missing");
      return;
    }else{
      console.log(accessToken);
    }
    // if(mood.user_id === userId && mood.mood_date != currentDate){}
    try {
      const response = await fetch("http://127.0.0.1:8000/api/mood/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          
        },
        body: JSON.stringify({
          type_mood: currentMood, 
          mood_date: new Date().toISOString().split('T')[0],
          user_id: userId,

        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to save mood: ${errorData.message || 'Unknown error'}`);
      }
      msg.fire({
                title: 'Tracked your mood successfully.!',
                text: 'Please be patient with yourself. I am proud of you.',
                icon: 'success',
                confirmButtonText: 'Okay',
                background: '#fff  ',
                color: '#000000',
              });
              
      const data = await response.json();
      console.log("Mood saved:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
      const accessToken = authTokens?.access;
      const fetchMusic = async () => {
        try {
          const accessToken = authTokens?.access;
  
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
          console.log("mood Data:", data);
  
          if (Array.isArray(data)) {
            setMood(data);
          } else {
            console.error("error", data);
            setMood([]);
          }
        } catch (error) {
          console.error("Error:", error);
          setMood([]);
        }
      };
      
      fetchMusic();
    }, []);
  
  if (!user || !accessToken) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="text-center p-5 shadow-lg rounded bg-success-subtle text-success-emphasis ">
          <i className="bi bi-lock-fill fs-1 mb-4"></i>
          <h2 className="fs-3 mb-3">Please log in to select your mood</h2>
          <p className="fs-5 mb-4">Please log in to interact with this feature.Thank you!</p>
          <Link
            to="/login"  
            className=" fw-bold fs-5"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='container d-flex justify-content-center align-items-center'>
       
        <div className='mood-box p-3 m-4 text-center bg-primary-subtle text-primary-emphasis rounded w-75'>
          <div className='fw-light fs-2'>
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
          <div className='mood-icons d-flex flex-wrap flex-row mt-3 fs-1'>
            <div className='sad col-4 col-sm-2' onClick={() => saveCurrentMood("Sad")}>
              <i className="bi bi-emoji-frown-fill"></i>
              <p className='fs-6 fw-lighter'>Sad</p>
            </div>
            <div className='happy col-4 col-sm-2' onClick={() => saveCurrentMood("Happy")}>
              <i className="bi bi-emoji-laughing-fill"></i>
              <p className='fs-6 fw-lighter'>Happy</p>
            </div>
            <div className='anxious col-4 col-sm-2' onClick={() => saveCurrentMood("Anxious")}>
              <i className="bi bi-emoji-smile-upside-down-fill"></i>
              <p className='fs-6 fw-lighter'>Anxious</p>
            </div>
            <div className='cry col-4 col-sm-2' onClick={() => saveCurrentMood("Cry")}>
              <i className="bi bi-emoji-tear-fill"></i>
              <p className='fs-6 fw-lighter'>Cry</p>
            </div>
            <div className='chill col-4 col-sm-2' onClick={() => saveCurrentMood("Chill")}>
              <i className="bi bi-emoji-sunglasses-fill"></i>
              <p className='fs-6 fw-lighter'>Chill</p>
            </div>
            <div className='neutral col-4 col-sm-2' onClick={() => saveCurrentMood("Neutral")}>
              <i className="bi bi-emoji-neutral-fill"></i>
              <p className='fs-6 fw-lighter'>Neutral</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
