"use client";

import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { Video, Mic, MicOff, VideoOff, PhoneOff, User, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function TelehealthPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isInCall, setIsInCall] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Connect to backend socket
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    const userId = "user_" + Math.floor(Math.random() * 10000);
    newSocket.emit("register", { userId, role: "USER" });

    // Signaling events
    newSocket.on("incoming-call", async ({ callerId, callerName }) => {
      newSocket.emit("accept-call", { callerId, roomId: "room_" + callerId });
    });

    newSocket.on("call-accepted", async ({ roomId }) => {
      newSocket.emit("join-room", { roomId });
      setIsInCall(true);
      setIsCalling(false);
      await setupWebRTC(roomId, newSocket, true);
    });

    newSocket.on("webrtc-offer", async ({ offer }) => {
      if (!peerConnectionRef.current) return;
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      newSocket.emit("webrtc-answer", { roomId: "simulated_room", answer });
    });

    newSocket.on("webrtc-answer", async ({ answer }) => {
      if (!peerConnectionRef.current) return;
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    newSocket.on("webrtc-ice-candidate", async ({ candidate }) => {
      if (!peerConnectionRef.current) return;
      await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    });

    return () => {
      newSocket.disconnect();
      endCall();
    };
  }, []);

  const setupWebRTC = async (roomId: string, socketInstance: Socket, isInitiator: boolean) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const configuration = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
      const pc = new RTCPeerConnection(configuration);
      peerConnectionRef.current = pc;

      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketInstance.emit("webrtc-ice-candidate", { roomId, candidate: event.candidate });
        }
      };

      pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      if (isInitiator) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socketInstance.emit("webrtc-offer", { roomId, offer });
      }

    } catch (err) {
      console.error("Failed to access media devices", err);
      alert("Could not access camera/microphone. Please grant permissions.");
      setIsInCall(false);
      setIsCalling(false);
    }
  };

  const startCall = () => {
    if (!socket) return;
    setIsCalling(true);
    socket.emit("initiate-call-test", { callerId: socket.id, callerName: "Patient" });
    
    // Fallback simulation if no doctor is online
    setTimeout(() => {
      if (isCalling && !isInCall) {
        const dummyRoom = "demo_room_" + Date.now();
        socket.emit("join-room", { roomId: dummyRoom });
        setIsInCall(true);
        setIsCalling(false);
        setupWebRTC(dummyRoom, socket, true);
      }
    }, 2000);
  };

  const endCall = () => {
    setIsInCall(false);
    setIsCalling(false);
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !micOn;
        setMicOn(!micOn);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoOn;
        setVideoOn(!videoOn);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
            <Video className="w-8 h-8 text-primary" /> Live Ayurvedic Consultation
          </h1>
          <p className="text-muted-foreground mt-2">Connect instantly with certified practitioners.</p>
        </div>

        {!isInCall ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-lg max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Doctor is Available</h2>
            <p className="text-muted-foreground mb-8">
              Dr. Sharma (Ayurvedic Specialist) is online and ready for your consultation.
            </p>
            <button 
              onClick={startCall}
              disabled={isCalling}
              className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-md flex items-center gap-3 mx-auto disabled:opacity-50"
            >
              {isCalling ? (
                <><Activity className="w-6 h-6 animate-pulse" /> Connecting...</>
              ) : (
                <><Video className="w-6 h-6" /> Start Video Call</>
              )}
            </button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl relative"
          >
            <div className="relative aspect-video bg-black/90">
              <video 
                ref={remoteVideoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              {!remoteVideoRef.current?.srcObject && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50">
                  <User className="w-20 h-20 mb-4 opacity-50" />
                  <p>Waiting for doctor's video...</p>
                </div>
              )}

              <div className="absolute bottom-6 right-6 w-48 aspect-video bg-gray-800 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg z-10">
                <video 
                  ref={localVideoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover transform scale-x-[-1]"
                />
              </div>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full z-10">
                <button 
                  onClick={toggleMic}
                  className={`p-3 rounded-full transition-colors ${micOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500 text-white hover:bg-red-600'}`}
                >
                  {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
                <button 
                  onClick={toggleVideo}
                  className={`p-3 rounded-full transition-colors ${videoOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500 text-white hover:bg-red-600'}`}
                >
                  {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>
                <button 
                  onClick={endCall}
                  className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors ml-4"
                >
                  <PhoneOff className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
