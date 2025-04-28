import React, { useState, useEffect } from "react";
import Footer from "./Footer";

export default function Exercise() {
  const [instruction, setInstruction] = useState("Breathe In");
  

  const time = 7500; 
  const breatheTime = (time / 5) * 2; 
  const holdTime = time / 5; 
  

  useEffect(() => {
    function exerciseBreathing() {
      setInstruction("Breathe In");
      

      setTimeout(() => {
        setInstruction("Hold");
        

        setTimeout(() => {
          setInstruction("Breathe Out");
          

        }, holdTime);
      }, breatheTime);
    }

    exerciseBreathing();
    const interval = setInterval(exerciseBreathing, time);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
    <div className="exercise d-flex flex-column align-items-center px-5">
      <div className="fw-bold pt-3 text-center text-white">
        <h1>Breathing Exercise</h1>
      </div>
      <p className="fs-4 text-white mb-4">
      <span className="text-dark">"</span> There are times when we stop, we sit still. We listen, and breezes from a whole other world begin to whisper.<span className="text-dark">"</span><br/>
      <span className="float-end text-dark">—James Carroll</span>
      </p>

      <div
        className="container d-flex flex-column align-items-center justify-content-center pt-5"
        id="exercise-container"
      >
        <div className="circle d-flex justify-content-center align-items-center text-white">
          <p id="instructions" className="fs-4 fw-lighter">{instruction}</p>
        </div>

        <div className="pointer-circle">
          <span className="pointer" ></span>
        </div>

        <div className="outer-circle"></div>
      </div>
     
    </div>
    <div >
    <Footer/>
    </div>
     
     </>
  );
}
