import { useEffect, useRef, useState, useContext } from "react";
import Typewriter from "typewriter-effect";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import AuthContext from '../../context/AuthContext'

export default function VideoCallLobby() {
  const {user} = useContext(AuthContext)

  const nav = useNavigate();
  const videoRef = useRef(null);
  
  const [room, setRoom] = useState("");

  useEffect(() => {
    const startPreview = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    startPreview();
  }, []);

  const handleJoin = async(e) => {
    e.preventDefault();
    let room = e.target.roomCode.value.toUpperCase()
    let response = await fetch(`http://127.0.0.1:8000/get/AppointmentToken/?channel=${room}`)
    let data = await response.json()
    console.log("room",room)
    console.log("data",data)

    let uid = data.uid
    let token = data.token
  
    
    sessionStorage.setItem('uid',uid)
    sessionStorage.setItem('token',token)
    sessionStorage.setItem('room',room)


    Swal.fire({
      title: `Joining the call as ${user.user_fullname} in room ${room}`,
      icon: "success",
      toast: true,
      timer: 5000,
      position: "top-right",
      timerProgressBar: true,
      showConfirmButton: false,
      background: "#28a745",
      color: "#ffffff",
      text: "Hope you have a great day!",
    });
    nav('/Appointment/VideoCall','_self')
  };

  return (
    <div className="d-flex flex-column align-items-center min-vh-100 p-4" style={{ background: "linear-gradient(to right, #1e3c72, #2a5298)", color: "#fff" }}>
     
      <h3 className="fs-5 text-center m-5 text-light">
        <Typewriter
          options={{
            autoStart: true,
            loop: true,
            delay: 50,
            deleteSpeed: 150,
            strings: [
              "Take a deep breath—you're in good hands. Just speak at your own pace, and we'll figure this out together.",
            ],
          }}
        />
      </h3>

      
      <div className="card p-4 shadow-lg rounded-4 border-0" style={{ background: "#e8eef1", color:"#FFFFFF" }}>
        <h3 className="text-center mb-3 text-info fw-bold">Appointment Call Lobby</h3>

        <div className="d-flex flex-row">
          <div className="mb-3 text-center" style={{borderColor: "#1e3d58"}}>
            <video ref={videoRef} className="rounded border shadow-sm"  height="200" autoPlay muted style={{ objectFit: "cover" }}></video>
          </div>

          {/* entering the username and room code */}
          <form onSubmit={handleJoin} className="ms-3">
            <div className="mb-3">
              <label className="form-label text-dark fw-semibold">Enter Your Name</label>
              <input type="text" name="name" className="form-control  text-dark rounded-3" value={user.user_fullname} readOnly />
            </div>
            <div className="mb-3">
              <label className="form-label text-dark fw-semibold">Room Code</label>
              <input type="text" name="roomCode" className="form-control bg-white text-dark rounded-3" value={room} onChange={(e) => setRoom(e.target.value)} required  />
            </div>
            <button type="submit" className="btn w-100 fw-bold text-white" style={{ background: "linear-gradient(to right, #00c6ff, #0072ff)", transition: "0.3s" }}>
              Join Call
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
