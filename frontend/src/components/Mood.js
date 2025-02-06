import React,{useState} from 'react'
import Typewriter from 'typewriter-effect';

export default function Mood() {
    const [currentMood,setCurrentMood] = useState(null);
    const saveCurrentMood = (mood) =>{
        setCurrentMood(mood);
        console.log(mood);
        // saving data code
    }
  return (
    <div>
      <div className='container d-flex justify-content-center align-items-center'>
        <div className='mood-box p-3 m-4 text-center bg-primary-subtle text-primary-emphasis rounded w-75 '>
            <div className='fw-light fs-2'><i className="bi bi-person-raised-hand"></i><Typewriter options={{
                    autoStart:true,
                    loop:true,
                    delay:100, 
                    deleteSpeed:100,
                    strings:["Hey! How are you feeling today?"]
                }}/>
             </div>
            <div className='mood-icons d-flex flex-wrap flex-row mt-3 fs-1'>
                <div className='sad col-4 col-sm-2' onClick={()=>saveCurrentMood("sad")}>
                    <i className="bi bi-emoji-frown-fill"></i>
                    <p className='fs-6 fw-lighter'>Sad</p>
                </div>
                <div className='happy col-4 col-sm-2 ' onClick={()=>saveCurrentMood("Happy")}>
                    <i className="bi bi-emoji-laughing-fill"></i>
                    <p className='fs-6 fw-lighter'>Happy</p>
                </div>
                <div className='anxious col-4 col-sm-2' onClick={()=>saveCurrentMood("Anxious")}>
                    <i className="bi bi-emoji-smile-upside-down-fill"></i>
                    <p className='fs-6 fw-lighter'>Anxious</p>
                </div>
                <div className='cry col-4 col-sm-2' onClick={()=>saveCurrentMood("Cry")}>
                    <i className="bi bi-emoji-tear-fill"></i>
                    <p className='fs-6 fw-lighter'>Cry</p>
                </div>
                <div className='chill col-4 col-sm-2' onClick={()=>saveCurrentMood("Chill")}>
                <i className="bi bi-emoji-sunglasses-fill"></i>
                <p className='fs-6 fw-lighter'>Chill</p>
                </div>
                <div className='neutral col-4 col-sm-2' onClick={()=>saveCurrentMood("Neutral")}>
                <i className="bi bi-emoji-neutral-fill"></i>
                <p className='fs-6 fw-lighter'>Neutral</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
