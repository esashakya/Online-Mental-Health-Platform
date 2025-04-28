import { useEffect, useRef, useState, useContext } from "react";
import Typewriter from "typewriter-effect";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import AuthContext from '../../context/AuthContext';

export default function VideoCallLobby() {
  const { user, authTokens } = useContext(AuthContext);
  const nav = useNavigate();
  const videoRef = useRef(null);
  const [room, setRoom] = useState("");
  const [stream, setStream] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      console.log("Video/audio stopped");
    }
  };

  useEffect(() => {
    const startPreview = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error("Error in media stream:", error);
        Swal.fire({
          title: "Camera/Mic Access Required",
          text: "Please enable camera and microphone access to join the call",
          icon: "warning"
        });
      }
    };

    startPreview();

    return () => {
      stopStream();
    };
  }, []);

  const validateAppointmentCode = async (roomCode) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/appointments/validate_room_code/?channel=${roomCode}`,
        {
          headers: {
            'Authorization': `Bearer ${authTokens.access}` 
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to validate room code');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const roomCode = e.target.roomCode.value;

    try {
      // check the appointment code
      const validation = await validateAppointmentCode(roomCode);
      
      if (!validation.valid) {
        throw new Error(validation.error || 'Invalid appointment code');
      }

      // if there is valid code, it is redirected else it displays error message
      let response = await fetch(
        `http://127.0.0.1:8000/get/AppointmentToken/?channel=${roomCode}`,
        
      );
      
      if (!response.ok) {
        throw new Error('call token not found');
      }

      let data = await response.json();
      let uid = data.uid;
      let token = data.token;

      sessionStorage.setItem('uid', uid);
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('room', roomCode);
      sessionStorage.setItem('appointmentData', JSON.stringify(validation));
      console.log("Token:", token);
console.log("Channel:", roomCode);
console.log("UID:", uid);


      Swal.fire({
        title: `Joining the call as ${user.user_fullname}`,
      
        icon: "success",
        timer: 5000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#28a745",
        color: "#ffffff"
      });

      stopStream();
      nav('/Appointment/VideoCall', '_self');
    } catch (error) {
      console.error("Error joining call:", error);
      Swal.fire({
        title: "Cannot Join Call",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      stopStream();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      stopStream();
    };
  }, [stream]);

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

      <div className="card p-4 shadow-lg rounded-4 border-0" style={{ background: "#e8eef1", color: "#FFFFFF" }}>
        <h3 className="text-center mb-3 text-info fw-bold">Appointment Call Lobby</h3>

        <div className="d-flex flex-row">
          <div className="mb-3 text-center" style={{ borderColor: "#1e3d58" }}>
            <video ref={videoRef} className="rounded border shadow-sm" height="200" autoPlay muted style={{ objectFit: "cover" }}></video>
          </div>

          <form onSubmit={handleJoin} className="ms-3">
            <div className="mb-3">
              <label className="form-label text-dark fw-semibold">Enter Your Name</label>
              <input 
                type="text" 
                name="name" 
                className="form-control text-dark rounded-3" 
                value={user.user_fullname} 
                readOnly 
              />
            </div>
            <div className="mb-3">
              <label className="form-label text-dark fw-semibold">Appointment Code</label>
              <input 
                type="text" 
                name="roomCode" 
                className="form-control bg-white text-dark rounded-3" 
                value={room} 
                onChange={(e) => setRoom(e.target.value)} 
                required 
                placeholder="Enter your appointment code"
              />
            </div>
            <button 
              type="submit" 
              className="btn w-100 fw-bold text-white" 
              style={{ background: "linear-gradient(to right, #00c6ff, #0072ff)", transition: "0.3s" }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  validating
                </>
              ) : (
                "Join Call"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}