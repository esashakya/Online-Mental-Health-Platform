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

  // Track remote users count
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

      // Setup event listeners
      client.on("user-published", handleUserPublished);
      client.on("user-unpublished", handleUserUnpublished);
      client.on("user-left", handleUserLeft);
      if (hasJoinedRef.current) {
        console.log("Already joined.");
        return;
      }

      hasJoinedRef.current = true;

      await client.join(appId, channel, token, uid);

      // Create local tracks
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

      // Play local video if available
      if (cameraTrack && videoRef.current) {
        cameraTrack.play(videoRef.current);
      }

      // Publish tracks if any available
      if (tracks.length > 0) {
        await client.publish(tracks);
      }

      // Always play audio track locally
      if (microphoneTrack) {
        microphoneTrack.play();
      }

      setIsJoined(true);
    } catch (error) {
      console.error("Error:", error);
      showError("Failed to join the call");
    }
  };

  // Update alone status whenever remote users change
  useEffect(() => {
    setIsAloneInCall(remoteUsersCount === 0);

    // If alone in call, ensure video is on
    if (isAloneInCall && localTracks.current[1]) {
      localTracks.current[1].setEnabled(true);
      setIsCameraMuted(false);
    }
  }, [remoteUsersCount, isAloneInCall]);

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
          hasVideo: mediaType === "video" || prev[user.uid]?.hasVideo,
          hasAudio: mediaType === "audio" || prev[user.uid]?.hasAudio,
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
        if (mediaType === "video") updated[user.uid].hasVideo = false;
        if (mediaType === "audio") updated[user.uid].hasAudio = false;

        if (!updated[user.uid].hasVideo && !updated[user.uid].hasAudio) {
          delete updated[user.uid];
        }
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
    alert("Trying to turn cam");
  
    if (!cameraTrack) {
      console.log("Camera track not available");
      return;
    }
  
    try {
      if (isAloneInCall) {
        await cameraTrack.setEnabled(true);
        setIsCameraMuted(false);
        showError("Video must remain on when alone in call");
        alert("It cant");
        return;
      }
  
      await cameraTrack.setEnabled(!isCameraMuted);
      setIsCameraMuted(!isCameraMuted);
    } catch (error) {
      console.error("Toggle camera error:", error);
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
    <div
      style={{ background: "linear-gradient(to right, #B5EAEA, #EDF6E5)" }}
      className="vh-100"
    >
      <div className="container pt-2 rounded vh-100">
        <h2 className="text-center mt-4">Video Call Appointment</h2>
        <h5 className="text-center mt-2">
          Room Code: <span className="text-primary">{channel}</span>
          {isAloneInCall && (
            <span className="ms-2 badge bg-warning">
              Waiting for others to join...
            </span>
          )}
        </h5>

        <div className="row justify-content-evenly mt-3 appointment-call">
          {/* Local User */}
          <div className="col-md-6 col-sm-1 bg-dark align-items-center position-relative mb-5">
            <video
              ref={videoRef}
              className={`video-player w-100 h-100 rounded ${
                isCameraMuted ? "bg-secondary" : ""
              }`}
              autoPlay
              playsInline
            />
            {isCameraMuted && (
              <div className="position-absolute top-50 start-50 translate-middle text-white">
                Camera Off
              </div>
            )}
            <div className="position-absolute bottom-0 start-0 bg-light-subtle bg-opacity-25 text-dark p-2 rounded m-2 w-50 fw-bold">
              {user.user_fullname} (You)
            </div>
          </div>

          {/* Remote Users */}
          {Object.keys(remoteUsers).map((uid) => (
            <div
              key={uid}
              className="col-md-6 col-sm-1 bg-dark align-items-center position-relative mb-5"
            >
              <video
                ref={(el) => (remoteVideoRefs.current[uid] = { current: el })}
                className={`video-player w-100 h-100 rounded ${
                  !remoteUsers[uid]?.hasVideo ? "bg-secondary" : ""
                }`}
                autoPlay
                playsInline
              />
              {!remoteUsers[uid]?.hasVideo && (
                <div className="position-absolute top-50 start-50 translate-middle text-white">
                  Camera Off
                </div>
              )}
              <div className="position-absolute bottom-0 start-0 bg-light-subtle bg-opacity-25 text-dark p-2 rounded m-2 w-50 fw-bold">
                {user.user_fullname}
              </div>
            </div>
          ))}
        </div>

        {/* Control Buttons */}
        <div className="d-flex justify-content-center gap-3 mb-3">
          <button
            className={`btn btn-light rounded-circle p-3 ${
              isMicMuted ? "btn-danger" : ""
            }`}
            onClick={toggleMic}
            title={isMicMuted ? "Unmute microphone" : "Mute microphone"}
          >
            <i className={`bi ${isMicMuted ? "bi-mic-mute" : "bi-mic"}`}></i>
          </button>

          <button
            className={`btn btn-light rounded-circle p-3 ${
              isCameraMuted ? "btn-danger" : ""
            }`}
            onClick={toggleCamera}
            title={isCameraMuted ? "Turn camera on" : "Turn camera off"}
            disabled={isAloneInCall}
          >
            <i
              className={`bi ${
                isCameraMuted ? "bi-camera-video-off" : "bi-camera-video"
              }`}
            ></i>
          </button>

          <button
            className="btn btn-danger rounded-circle p-3"
            onClick={leaveCall}
            title="Leave call"
          >
            <i className="bi bi-telephone-x"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
