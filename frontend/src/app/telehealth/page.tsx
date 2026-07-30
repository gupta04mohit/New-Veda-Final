"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Video, Mic, MicOff, VideoOff, Phone, MessageSquare, FileText, Clock, User, Loader2, PhoneOutgoing } from "lucide-react";
import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSocket } from "@/components/SocketProvider";

function TelehealthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");
  const callerNameUrl = searchParams.get("callerName");
  
  const { socket } = useSocket();
  const [user, setUser] = useState<any>(null);

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [aiNotes, setAiNotes] = useState<string[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ senderName: string; text: string; isSelf?: boolean }[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeRoomId, setActiveRoomId] = useState<string | null>(roomId);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (chatOpen) scrollToBottom();
  }, [messages, chatOpen]);

  useEffect(() => {
    const storedUser = localStorage.getItem("veda_user");
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch(e) {}
    }
  }, []);

  // Keep activeRoomId in sync with URL on mount for the Doctor
  useEffect(() => {
    if (roomId && !activeRoomId) setActiveRoomId(roomId);
  }, [roomId, activeRoomId]);

  // Set connected status based on activeRoomId
  useEffect(() => {
    if (activeRoomId && socket && mediaReady) {
      // Join room instantly
      setConnected(true);
      socket.emit("join-room", { roomId: activeRoomId });
      
      // If socket drops and reconnects, it loses rooms. Re-join!
      const onConnect = () => {
        socket.emit("join-room", { roomId: activeRoomId });
      };
      socket.on("connect", onConnect);
      
      // Simulate AI notes populating
      setTimeout(() => setAiNotes(prev => [...prev, "Patient reports persistent digestive discomfort after meals."]), 2000);
      setTimeout(() => setAiNotes(prev => [...prev, "SpO2 readings from wearable: <span class='text-green-400 font-semibold'>98% — normal</span>."]), 5000);
      setTimeout(() => setAiNotes(prev => [...prev, "Dosha Profile: <span class='text-orange-400 font-semibold'>Vata-Pitta</span>. Possible Sama Agni issue."]), 8000);

      return () => {
        socket.off("connect", onConnect);
      };
    }
  }, [activeRoomId, socket, mediaReady]);

  useEffect(() => {
    if (socket) {
      socket.on("call-accepted", (data) => {
        setIsCalling(false);
        setConnected(true);
        setActiveRoomId(data.roomId);
        router.push(`/telehealth?roomId=${data.roomId}`);
      });

      socket.on("call-failed", (data) => {
        setIsCalling(false);
        alert(data.message);
      });

      socket.on("call-rejected", () => {
        setIsCalling(false);
        alert("The doctor declined the call.");
      });

      socket.on("receive-message", (data: { senderName: string; text: string }) => {
        setMessages(prev => [...prev, { senderName: data.senderName, text: data.text, isSelf: false }]);
      });
    }
    return () => {
      if (socket) {
        socket.off("call-accepted");
        socket.off("call-failed");
        socket.off("call-rejected");
        socket.off("receive-message");
      }
    };
  }, [socket, router]);

  const initiateCall = () => {
    if (!user) {
      alert("Please log in to make a call.");
      return;
    }
    if (socket) {
      setIsCalling(true);
      // Calls any other active user for testing
      socket.emit("initiate-call-test", { callerId: user._id, callerName: user.name });
    } else {
      alert("Socket not connected.");
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || !socket || !activeRoomId) return;
    
    // Guarantee room membership right before sending
    socket.emit("join-room", { roomId: activeRoomId });
    
    const text = newMessage.trim();
    socket.emit("send-message", { roomId: activeRoomId, text, senderName: user?.name || "User" });
    setMessages(prev => [...prev, { senderName: "You", text, isSelf: true }]);
    setNewMessage("");
  };

  // Initialize camera and mic
  useEffect(() => {
    async function setupMedia() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(mediaStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.warn("Could not access media devices (Permission Denied). Running in fallback mode.", err);
        setError("Could not access camera or microphone. Please check permissions.");
      } finally {
        setMediaReady(true);
      }
    }
    setupMedia();

    return () => {
      // Cleanup stream on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Toggle tracks when state changes
  useEffect(() => {
    if (stream) {
      stream.getAudioTracks().forEach(track => { track.enabled = micOn; });
      stream.getVideoTracks().forEach(track => { track.enabled = camOn; });
    }
  }, [micOn, camOn, stream]);

  // WebRTC Signaling
  useEffect(() => {
    if (!socket || !activeRoomId || !mediaReady) return;

    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

    const createPeerConnection = () => {
      if (peerConnectionRef.current) return peerConnectionRef.current;
      const pc = new RTCPeerConnection(configuration);
      
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('webrtc-ice-candidate', { roomId: activeRoomId, candidate: event.candidate });
        }
      };
      
      pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      if (stream) {
        stream.getTracks().forEach(track => pc.addTrack(track, stream));
      }
      
      peerConnectionRef.current = pc;
      return pc;
    };

    let isNegotiating = false;

    socket.on('user-joined-room', async () => {
      const pc = createPeerConnection();
      if (pc.currentLocalDescription || pc.signalingState !== "stable" || isNegotiating) return;
      
      isNegotiating = true;
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('webrtc-offer', { roomId: activeRoomId, offer });
      } catch (e) {
        console.error("Error creating offer", e);
      } finally {
        isNegotiating = false;
      }
    });

    socket.on('webrtc-offer', async ({ offer }) => {
      const pc = createPeerConnection();
      if (pc.currentRemoteDescription || pc.signalingState !== "stable" || isNegotiating) return;

      isNegotiating = true;
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('webrtc-answer', { roomId: activeRoomId, answer });
      } catch (e) {
        console.error("Error handling offer", e);
      } finally {
        isNegotiating = false;
      }
    });

    socket.on('webrtc-answer', async ({ answer }) => {
      const pc = peerConnectionRef.current;
      if (!pc || pc.currentRemoteDescription) return;
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (e) {
        console.error("Error handling answer", e);
      }
    });

    socket.on('webrtc-ice-candidate', async ({ candidate }) => {
      const pc = peerConnectionRef.current;
      if (pc) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error("Error adding ice candidate", e);
        }
      }
    });

    return () => {
      socket.off('user-joined-room');
      socket.off('webrtc-offer');
      socket.off('webrtc-answer');
      socket.off('webrtc-ice-candidate');
    };
  }, [socket, activeRoomId, stream, mediaReady]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-950 flex flex-col font-sans">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gray-900/50 backdrop-blur-md">
        <div>
          <h2 className="text-white text-xl font-bold tracking-tight">
            Consultation {callerNameUrl ? `with ${callerNameUrl}` : ""}
          </h2>
          {connected && <p className="text-white/50 text-sm flex items-center gap-1.5 mt-0.5"><Clock className="w-3.5 h-3.5" /> Session active</p>}
        </div>
        {connected && (
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.1)]">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-green-400 text-sm font-semibold tracking-wide">Live</span>
          </div>
        )}
      </div>

      {/* Main Video Area */}
      <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        
        {/* Doctor Video Feed (Main) */}
        <div className="lg:col-span-2 relative bg-gray-900 rounded-3xl overflow-hidden border border-white/5 shadow-2xl min-h-[450px] flex items-center justify-center group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50"></div>
          
          {!connected ? (
            <div className="text-center z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 relative">
                {isCalling && <div className="absolute inset-0 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>}
                <User className="w-10 h-10 text-white/40" />
              </div>
              
              {user?.role === 'DOCTOR' ? (
                <>
                  <p className="text-xl text-white font-medium mb-4">You are online</p>
                  <p className="text-white/60 mb-6">Waiting for incoming patient consultations...</p>
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="text-sm text-primary font-medium tracking-wide">Listening for calls</span>
                  </div>
                </>
              ) : (
                <>
                  {!isCalling ? (
                    <>
                      <p className="text-xl text-white font-medium mb-4">Ready to start the consultation?</p>
                      <button 
                        onClick={initiateCall}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-bold shadow-lg transition-all hover:scale-105"
                      >
                        <PhoneOutgoing className="w-5 h-5" /> Call a Doctor Now
                      </button>
                      <p className="mt-4 text-xs text-white/40">This will ring available doctors in the network.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-xl text-white font-medium mb-2">Calling Doctor...</p>
                      <p className="text-white/40 text-sm flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Waiting for them to accept
                      </p>
                    </>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gray-900 z-10 overflow-hidden">
              <video 
                ref={remoteVideoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover" 
              />
            </div>
          )}
          
          {connected && (
            <div className="absolute bottom-6 left-6 z-20 bg-black/40 backdrop-blur-md border border-white/10 px-5 py-3 rounded-2xl transition-transform group-hover:scale-105">
              <p className="text-white font-bold text-lg">{callerNameUrl || "Doctor"}</p>
              <p className="text-primary text-sm font-medium">Connected Session</p>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Self Video */}
          <div className="bg-gray-900 rounded-3xl border border-white/5 overflow-hidden relative h-56 flex items-center justify-center shadow-xl">
            {error ? (
              <div className="text-center px-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            ) : (
              <>
                <video 
                  ref={localVideoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className={`w-full h-full object-cover transition-opacity duration-300 ${!camOn ? 'opacity-0' : 'opacity-100'}`} 
                />
                {!camOn && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white/30">
                    <VideoOff className="w-12 h-12 mb-2" />
                    <p className="text-sm">Camera is off</p>
                  </div>
                )}
              </>
            )}
            
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <p className="text-white text-xs font-semibold">You</p>
              {!micOn && <MicOff className="w-3 h-3 text-red-400" />}
            </div>
          </div>

          {/* AI Notes & Chat Toggle */}
          <div className="bg-gray-900/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 flex-1 flex flex-col shadow-xl overflow-hidden">
            <h4 className="text-white/90 font-bold uppercase tracking-widest text-xs mb-4 flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                {chatOpen ? <MessageSquare className="w-4 h-4 text-primary" /> : <FileText className="w-4 h-4 text-primary" />}
                {chatOpen ? "Live Chat" : "Live AI Session Notes"}
              </div>
              <button 
                onClick={() => setChatOpen(!chatOpen)}
                className="text-white/40 hover:text-white transition-colors"
              >
                {chatOpen ? "View Notes" : "View Chat"}
              </button>
            </h4>
            
            {chatOpen ? (
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 pb-2">
                  {!connected ? (
                     <p className="text-white/40 italic text-center mt-10">Chat will be available once connected.</p>
                  ) : messages.length === 0 ? (
                     <p className="text-white/40 italic text-center mt-10">No messages yet. Say hello!</p>
                  ) : (
                    messages.map((msg, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}
                      >
                        <span className="text-[10px] text-white/40 mb-1 px-1">{msg.senderName}</span>
                        <div className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm ${msg.isSelf ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-white/10 text-white rounded-tl-sm'}`}>
                          {msg.text}
                        </div>
                      </motion.div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
                {connected && (
                  <form onSubmit={handleSendMessage} className="mt-4 pt-4 border-t border-white/10 flex gap-2">
                    <input 
                      type="text" 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    <button type="submit" disabled={!newMessage.trim()} className="bg-primary text-white p-2.5 rounded-full disabled:opacity-50 transition-all hover:scale-105">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <>
                <div className="space-y-3 text-sm flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  {!connected ? (
                     <p className="text-white/40 italic text-center mt-10">AI will start taking notes once the consultation begins.</p>
                  ) : (
                    <AnimatePresence>
                      {aiNotes.map((note, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white/5 p-3 rounded-xl border border-white/5"
                        >
                          <p className="text-white/80 leading-relaxed" dangerouslySetInnerHTML={{__html: note}} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
                
                <AnimatePresence>
                  {connected && aiNotes.length >= 3 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 pt-4 border-t border-white/10 bg-primary/10 -mx-6 -mb-6 p-6 rounded-b-3xl border-t-primary/20"
                    >
                      <p className="text-xs text-primary font-bold tracking-widest mb-3">AI SUGGESTED PRESCRIPTIONS</p>
                      <ul className="space-y-2">
                        <motion.li initial={{opacity:0, x:-10}} animate={{opacity:1, x:0}} transition={{delay: 0.2}} className="text-white/90 text-sm flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span> Triphala Churna — 1 tsp with warm water before bed.
                        </motion.li>
                        <motion.li initial={{opacity:0, x:-10}} animate={{opacity:1, x:0}} transition={{delay: 0.5}} className="text-white/90 text-sm flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span> Avoid raw, cold salads for 2 weeks to balance Agni.
                        </motion.li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-gray-950 border-t border-white/5 px-6 py-6 flex items-center justify-center gap-6 relative z-20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMicOn(!micOn)}
          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-all shadow-lg ${micOn ? 'bg-white/10 hover:bg-white/20 border border-white/10' : 'bg-red-500 hover:bg-red-600 shadow-red-500/20'}`}
          title={micOn ? "Mute Microphone" : "Unmute Microphone"}
        >
          {micOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCamOn(!camOn)}
          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-all shadow-lg ${camOn ? 'bg-white/10 hover:bg-white/20 border border-white/10' : 'bg-red-500 hover:bg-red-600 shadow-red-500/20'}`}
          title={camOn ? "Turn off Camera" : "Turn on Camera"}
        >
          {camOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
        </motion.button>

        <motion.button
          onClick={() => setChatOpen(!chatOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-all shadow-lg ${chatOpen ? 'bg-primary text-primary-foreground border border-primary/50' : 'bg-white/10 hover:bg-white/20 border border-white/10'}`}
          title="Chat"
        >
          <MessageSquare className="w-6 h-6" />
        </motion.button>

        <motion.button
          onClick={() => {
             if (socket && isCalling) socket.emit("reject-call", { callerId: user?._id });
             router.push("/dashboard");
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-24 h-16 rounded-2xl flex items-center justify-center text-white bg-red-600 hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 px-6 ml-4"
          title="End Call"
        >
          <Phone className="w-6 h-6 rotate-[135deg]" />
        </motion.button>
      </div>
    </div>
  );
}

export default function TelehealthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 flex items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>}>
      <TelehealthContent />
    </Suspense>
  );
}
