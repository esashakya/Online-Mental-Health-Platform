import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import msg from "sweetalert2";

/* global AgoraRTC */

export default function VideoCall() {
  const { user } = useContext(AuthContext);
  const nav = useNavigate();
  const hasJoinedRef = useRef(false);
  const appId = "1d7a7b82261a4bfeb81b4fc429cb98af";
  const channel = sessionStorage.getItem("room");
  const token = sessionStorage.getItem("token");
  let uid = Number(sessionStorage.getItem("uid"));
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  const [isJoined, setIsJoined] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState({});
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraMuted, setIsCameraMuted] = useState(false);
  const [isAloneInCall, setIsAloneInCall] = useState(true);

  const videoRef = useRef(null);
  const remoteVideoRefs = useRef({});
  const localTracks = useRef([]);

  //numbeer of user
  const remoteUsersCount = Object.keys(remoteUsers).length;

  // Stop stream function
  console.log("Joining with:");
  console.log("UID:", uid);
  console.log("Token:", token);
  console.log("Channel:", channel);

  const stopStream = () => {
    if (localTracks.current.length > 0) {
      localTracks.current.forEach((track) => {
        track?.stop();
        track?.close();
      });
      localTracks.current = [];
    }
  };
  useEffect(() => {
    const isAlone = remoteUsersCount === 0;
    setIsAloneInCall(isAlone);
  
    const cameraTrack = localTracks.current[1];
  
    if (isAlone && cameraTrack) {
      cameraTrack.setEnabled(true).then(() => {
        setIsCameraMuted(false);
  
        const waitForRefAndPlay = () => {
          if (videoRef.current) {
            cameraTrack.play(videoRef.current);
          } else {
            
            setTimeout(waitForRefAndPlay, 100);
          }
        };
  
        waitForRefAndPlay(); 
      });
    }
  }, [remoteUsersCount]);
  
  
  const joinAndDisplayLocalStream = async () => {
    if (isJoined) return;
    if (
      client.connectionState === "CONNECTED" ||
      client.connectionState === "CONNECTING"
    ) {
      console.warn("Already connected or connecting to Agora");
      return;
    }

    try {
      console.log("User entering the call");

      // event listeners
      client.on("user-published", handleUserPublished);
      client.on("user-unpublished", handleUserUnpublished);
      client.on("user-left", handleUserLeft);
      if (hasJoinedRef.current) {
        console.log("Already joined.");
        return;
      }

      hasJoinedRef.current = true;

      await client.join(appId, channel, token, uid);

      // video and mic
      const [microphoneTrack, cameraTrack] = await Promise.all([
        AgoraRTC.createMicrophoneAudioTrack().catch((e) => {
          console.warn("Microphone access error:", e);
          return null;
        }),
        AgoraRTC.createCameraVideoTrack().catch((e) => {
          console.warn("Camera access error:", e);
          return null;
        }),
      ]);

      const tracks = [microphoneTrack, cameraTrack].filter(Boolean);
      localTracks.current = tracks;

     
      if (cameraTrack && videoRef.current) {
        cameraTrack.play(videoRef.current);
      }

  
      if (tracks.length > 0) {
        await client.publish(tracks);
      }

 
      if (microphoneTrack) {
        microphoneTrack.play();
      }

      setIsJoined(true);
    } catch (error) {
      console.error("Error:", error);
      showError("Failed to join the call");
    }
  };

  useEffect(() => {
    const isAlone = remoteUsersCount === 0;
    setIsAloneInCall(isAlone);
  
    const cameraTrack = localTracks.current[1];
    if (isAlone && cameraTrack) {
      cameraTrack.setEnabled(true).then(() => {
        setIsCameraMuted(false);
       
        setTimeout(() => {
          if (videoRef.current) {
            cameraTrack.play(videoRef.current);
          }
        }, 100); 
      });
    }
  }, [remoteUsersCount]);
  
  

  const showError = (message) => {
    msg.fire({
      title: message,
      icon: "error",
      toast: true,
      timer: 4000,
      position: "top-right",
      timerProgressBar: true,
      showConfirmButton: false,
      background: "#dc3545",
      color: "#ffffff",
    });
  };

  const handleUserPublished = async (user, mediaType) => {
    console.log(`User ${user.uid} published ${mediaType}`);
    try {
      await client.subscribe(user, mediaType);

      setRemoteUsers((prev) => ({
        ...prev,
        [user.uid]: {
          ...prev[user.uid],
          ...user,
          hasVideo:
            mediaType === "video" ? true : prev[user.uid]?.hasVideo || false,
          hasAudio:
            mediaType === "audio" ? true : prev[user.uid]?.hasAudio || false,
        },
      }));

      if (mediaType === "video") {
        setupRemoteVideo(user);
      } else if (mediaType === "audio" && user.audioTrack) {
        user.audioTrack.play();
      }
    } catch (error) {
      console.error("Subscribe error:", error);
    }
  };

  const handleUserUnpublished = (user, mediaType) => {
    console.log(`User ${user.uid} unpublished ${mediaType}`);
    setRemoteUsers((prev) => {
      const updated = { ...prev };
      if (updated[user.uid]) {
        updated[user.uid] = {
          ...updated[user.uid],
          hasVideo: mediaType === "video" ? false : updated[user.uid].hasVideo,
          hasAudio: mediaType === "audio" ? false : updated[user.uid].hasAudio,
        };
      }
      return updated;
    });
  };

  const handleUserLeft = (user) => {
    console.log(`User ${user.uid} left`);
    setRemoteUsers((prev) => {
      const updated = { ...prev };
      delete updated[user.uid];
      return updated;
    });
  };

  const setupRemoteVideo = (user) => {
    if (!remoteVideoRefs.current[user.uid]) {
      remoteVideoRefs.current[user.uid] = React.createRef();
    }

    setTimeout(() => {
      const videoElement = remoteVideoRefs.current[user.uid]?.current;
      if (videoElement && user.videoTrack) {
        user.videoTrack.play(videoElement);
      }
    }, 300);
  };

  const leaveCall = async () => {
    try {
      stopStream();

      if (client.connectionState === "CONNECTED") {
        await client.leave();
      }

      setIsJoined(false);
      setRemoteUsers({});

      msg.fire({
        title: "Call Ended",
        text: "The video call has ended",
        icon: "success",
      });

      nav("/");
    } catch (error) {
      console.error("Error leaving call:", error);
    }
  };

  const toggleCamera = async () => {
    const cameraTrack = localTracks.current[1];
  
    if (!cameraTrack) {
      console.log("Camera track not available");
      return;
    }
  
    const newState = !isCameraMuted;
  
    try {
      if (isAloneInCall && newState) {
        await cameraTrack.setEnabled(true);
        setIsCameraMuted(false);
        showError("Video must remain on when alone in call");
        return;
      }
  
      if (newState) {
      
        await cameraTrack.setEnabled(false);
        cameraTrack.stop(); 
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      } else {
      
        await cameraTrack.setEnabled(true);
        setTimeout(() => {
          if (videoRef.current) {
            cameraTrack.play(videoRef.current);
          }
        }, 100); 
      }
  
      setIsCameraMuted(newState);
    } catch (error) {
      console.error("Toggle camera error:", error);
      setIsCameraMuted(!newState);
      showError("Failed to toggle camera");
    }
  };
  

  const toggleMic = async () => {
    const micTrack = localTracks.current[0];
    if (!micTrack) {
      console.log("No microphone track available");
      return;
    }

    try {
      const newState = !isMicMuted;
      await micTrack.setMuted(newState);
      setIsMicMuted(newState);
    } catch (error) {
      console.error("Toggle mic error:", error);
      showError("Failed to toggle microphone");
    }
  };

  useEffect(() => {
    joinAndDisplayLocalStream();

    return () => {
      stopStream();
      if (client.connectionState === "CONNECTED") {
        client.leave();
      }
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      stopStream();
      if (client.connectionState === "CONNECTED") {
        client.leave();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return (
    <div className="min-vh-100" style={{ 
      background: "linear-gradient(135deg, #f5fbff 0%, #ebf5ff 100%)",
   
    }}>
      
      <div className="py-3 text-center" style={{
        backgroundColor: "#1976d2",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        color: "white"
      }}>
        <h2 className="mb-1" style={{ fontWeight: 500 }}>
          
          Doctor Appointment
        </h2>
        <div className="d-flex justify-content-center align-items-center">
          <div className="badge bg-white text-primary fs-6 fw-normal py-2 px-3 rounded-pill">
            
            Room: {channel}
          </div>
          {isAloneInCall && (
            <div className="ms-3 badge bg-white text-primary py-2 px-3 rounded-pill fs-6 fw-normal">
              
              Waiting for participant
            </div>
          )}
        </div>
      </div>
    
      {/* Video Grid Container */}
      <div className="container-fluid py-4 px-4">
        <div className="row g-4" style={{ minHeight: "70vh" }}>
        
          <div className="col-lg-6">
            <div className="card h-100 border-0" style={{
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(25, 118, 210, 0.15)",
              overflow: "hidden"
            }}>
              <div className="bg-dark h-100 position-relative">
                {!isCameraMuted ? (
                  <video
                    ref={videoRef}
                    className="w-100 h-100 object-cover"
                    autoPlay
                    playsInline
                  />
                ) : (
                  <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center" 
                       style={{ backgroundColor: "#0d47a1" }}>
                    <div className="bg-white rounded-circle p-3 mb-3">
                      <i className="bi bi-person text-primary fs-2"></i>
                    </div>
                    <p className="text-white fs-5 mb-0">Your camera is disabled</p>
                  </div>
                )}
                
              </div>
            </div>
          </div>
    
          {/* Remote User Card */}
          {Object.keys(remoteUsers).map((uid) => (
            <div key={uid} className="col-lg-6">
              <div className="card h-100 border-0" style={{
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(25, 118, 210, 0.15)",
                overflow: "hidden"
              }}>
                <div className="bg-dark h-100 position-relative">
                  <video
                    ref={(el) => (remoteVideoRefs.current[uid] = { current: el })}
                    className={`w-100 h-100 object-cover ${
                      !remoteUsers[uid]?.hasVideo ? "d-none" : ""
                    }`}
                    autoPlay
                    playsInline
                  />
                  {!remoteUsers[uid]?.hasVideo && (
                    <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center" 
                         style={{ backgroundColor: "#0d47a1" }}>
                      <div className="bg-white rounded-circle p-3 mb-3">
                        <i className="bi bi-person text-primary fs-2"></i>
                      </div>
                      <p className="text-white fs-5 mb-0">Participant camera off</p>
                    </div>
                  )}
                  
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    
  
      <div className="position-fixed bottom-0 start-0 w-100 py-2" style={{
        backgroundColor: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(4px)"
      }}>
        <div className="container">
          <div className="d-flex justify-content-center gap-4">
            <button
              className={`btn btn-icon rounded-circle p-3 ${isMicMuted ? "btn-danger" : "btn-primary"}`}
              onClick={toggleMic}
              style={{ width: "56px", height: "56px" }}
            >
              <i className={`bi fs-6 ${isMicMuted ? "bi-mic-mute" : "bi-mic"}`}></i>
            </button>
    
            <button
              className={`btn btn-icon rounded-circle p-3 ${isCameraMuted ? "btn-danger" : "btn-primary"}`}
              onClick={toggleCamera}
              disabled={isAloneInCall}
              style={{ width: "56px", height: "56px" }}
            >
              <i className={`bi fs-6 ${
                isCameraMuted ? "bi-camera-video-off" : "bi-camera-video"
              }`}></i>
            </button>
    
            <button
              className="btn btn-icon rounded-circle p-3 btn-danger text-center"
              onClick={leaveCall}
              style={{ width: "56px", height: "56px" }}
            >
              <i className="bi bi-door-open fs-6"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
