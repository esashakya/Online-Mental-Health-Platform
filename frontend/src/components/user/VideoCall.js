import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from '../../context/AuthContext'
import msg from "sweetalert2";

/* global AgoraRTC */

export default function VideoCall() {
  const { user } = useContext(AuthContext);
  const nav = useNavigate();

  const appId = '1d7a7b82261a4bfeb81b4fc429cb98af';
  const channel = sessionStorage.getItem('room');
  const token = sessionStorage.getItem('token');
  let uid = Number(sessionStorage.getItem('uid'));
  const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
  const [isJoined, setIsJoined] = useState(false); //call is initialized as empty
  const [remoteUsersState, setRemoteUsers] = useState({});
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraMuted, setIsCameraMuted] = useState(true);

  const videoRef = useRef(null);  
  const remoteVideoRefs = useRef({}); // to store
  
  const localTracks = useRef([]); // to store

  // Stop stream function
  const stopStream = () => {
    if (localTracks.current.length > 0) {
      console.log("Stopping ");
      localTracks.current[0]?.stop(); 
      localTracks.current[1]?.stop(); 
      localTracks.current[0]?.close(); 
      localTracks.current[1]?.close();
    }
  };

  
  const joinAndDisplayLocalStream = async () => {
    if (isJoined) return;

    try {
      console.log("Entering the call");
      client.on('user-published', handleUserJoined);
      client.on('user-left', handleUserLeft);

      uid = await client.join(appId, channel, token, uid); //get user id dynamically
      console.log(`UID: ${uid}`);

      localTracks.current = await AgoraRTC.createMicrophoneAndCameraTracks();
     
      if (videoRef.current && localTracks.current[1]) {   //video
        localTracks.current[1].play(videoRef.current);
      } else {
        console.log("Error found on video");
        msg.fire({
                title: "Error in loading your video!",
                icon: "error",
                toast: true,
                timer: 5000,
                position: "top-right",
                timerProgressBar: true,
                showConfirmButton: false,
                background: "#dc3545",
                color: "#ffffff",
                text: " Please try again.",
                didOpen: () => {
                  msg.showLoading();
                },
                willClose: () => {
                  msg.hideLoading();
                },
              });
      }

      if (localTracks.current[0]) {    //audio
        localTracks.current[0].play(); 
      }

      await client.publish([localTracks.current[0], localTracks.current[1]]);
      console.log("registered");

      setIsJoined(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // new user join function
  const handleUserJoined = async (user, mediaType) => {
    console.log(`User : ${user.uid}, MediaType: ${mediaType}`);
    await client.subscribe(user, mediaType);

    setRemoteUsers((prevUsers) => ({    // Add old user and new users
      ...prevUsers,
      [user.uid]: user
    }));

    if (mediaType === 'video') {
      if (!remoteVideoRefs.current[user.uid]) {
        remoteVideoRefs.current[user.uid] = React.createRef();
      }

      setTimeout(() => {
        if (remoteVideoRefs.current[user.uid]?.current && user.videoTrack) {
          console.log(`Playing for  ${user.uid}`);
          user.videoTrack.play(remoteVideoRefs.current[user.uid].current);
        } else {
          console.log(`Error  ${user.uid}`);
          msg.fire({
            title: "Error in loading your video",
            icon: "error",
            toast: true,
            timer: 5000,
            position: "top-right",
            timerProgressBar: true,
            showConfirmButton: false,
            background: "#dc3545",
            color: "#ffffff",
            text: " Please try again.",
            didOpen: () => {
              msg.showLoading();
            },
            willClose: () => {
              msg.hideLoading();
            },
          });
        }
      }, 500);
    }

    if (mediaType === 'audio') {
      user.audioTrack.play();
    }
  };

 
  const handleUserLeft = async () => {
    try {
      console.log("Leaving the call...");
      stopStream();  // stopping the video and audio using function

      console.log("Leaving");
      await client.leave();
      msg.fire({
              title: "Hope you feel better :)",
              icon: "success",
              toast: true,
              timer: 5000,
              position: "top-right",
              timerProgressBar: true,
              showConfirmButton: false,
              background: "#28a745",
              color: "#ffffff",
              text: "It was pleasant talking with you.",
              didOpen: () => {
                msg.showLoading();
              },
              willClose: () => {
                msg.hideLoading();
              },
            });

      setIsJoined(false);  //update the status
      setRemoteUsers({}); 
      nav("/");
    } catch (error) {
      console.error("Error found in the call:", error);
    }
  };

  
  const toggleCamera = async () => {
    if (!localTracks.current[1]) {
      console.log("Camera error");
      return;
    }

    // change button UI
    setIsCameraMuted((prev) => !prev);

    await localTracks.current[1].setEnabled(!isCameraMuted);
  };

  
  const toggleMic = async () => {
    if (!localTracks.current[0]) {
      console.log("Mic track not available.");
      return;
    }

    // change button UI
    setIsMicMuted((prev) => !prev);

    
    await localTracks.current[0].setMuted(!isMicMuted);
  };

  
  useEffect(() => {
    joinAndDisplayLocalStream();

    // cleanup 
    return () => {
      stopStream();  
    };
  }, []);

  // event listener
  useEffect(() => {
    const handleBeforeUnload = () => {
      stopStream();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      stopStream();
    };
  }, []);

  return (
    <div style={{ background: "linear-gradient(to right, #B5EAEA, #EDF6E5)" }} className="vh-100">
      <div className="container pt-2 rounded vh-100">
        <h2 className="text-center mt-4">Video Call Appointment </h2>
        <h5 className="text-center mt-2">
          Room Code: <span className="text-primary">{channel}</span>
        </h5>
        <div className="row justify-content-evenly mt-3 appointment-call">
          {/* User 1 */}
          <div className="col-md-6 col-sm-1 bg-dark align-items-center position-relative mb-5">
            <video
              ref={videoRef}
              className="video-player w-100 h-100 rounded"
              autoPlay
            />
            <div className="position-absolute bottom-0 start-0 bg-light-subtle bg-opacity-25 text-dark p-2 rounded m-2 w-50 fw-bold">
                {user.user_fullname}
              </div>
          </div>

          {/* Remote Users */}
          {Object.keys(remoteUsersState).map((uid) => (
            <div key={uid} className="col-md-6 col-sm-1 bg-dark align-items-center position-relative mb-5">
              <video
                ref={remoteVideoRefs.current[uid]}
                className="video-player w-100 h-100 rounded"
                autoPlay
              />
              <div className="position-absolute bottom-0 start-0 bg-light-subtle bg-opacity-25 text-dark p-2 rounded m-2 w-50 fw-bold">
                {user.user_fullname}
              </div>
            </div>
          ))}
        </div>

        {/* Control Buttons */}
        <div className="d-flex justify-content-center gap-3 mb-3">
          <button
            className="btn btn-light rounded-circle p-3"
            onClick={toggleMic}
            style={{ backgroundColor: isMicMuted ? "rgb(255, 80, 80, 1)" : "#fff" }}
          >
            <i className={`bi ${isMicMuted ? "bi-mic-mute" : "bi-mic"}`}></i>
          </button>

          <button
            className="btn btn-light rounded-circle p-3"
            onClick={toggleCamera}
            style={{ backgroundColor: isCameraMuted ? "rgb(255, 80, 80, 1)" : "#fff" }}
          >
            <i className={`bi ${isCameraMuted ? "bi-camera-video-off" : "bi-camera-video"}`}></i>
          </button>

          <button className="btn btn-danger rounded-circle p-3" onClick={handleUserLeft}>
            <i className="bi bi-door-closed"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
