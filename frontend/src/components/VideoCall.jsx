import { useState, useRef, useEffect } from 'react';
import { X, Mic, MicOff, Video, VideoOff, PhoneOff, AlertCircle } from 'lucide-react';

export default function VideoCall({ isOpen, onClose, userName }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);
  const localVideoRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(mediaStream => {
          setStream(mediaStream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = mediaStream;
          }
          setError(null);
        })
        .catch(err => {
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setError('Camera/Microphone access denied. Please allow permissions in your browser settings.');
          } else if (err.name === 'NotFoundError') {
            setError('No camera or microphone found on your device.');
          } else {
            setError('Unable to access camera/microphone. Please check your device.');
          }
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen]);

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex-1 relative">
        {error ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <div className="text-center p-8">
              <AlertCircle size={64} className="text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Unable to Start Video Call</h3>
              <p className="text-gray-300 mb-6 max-w-md">{error}</p>
              <button onClick={handleClose} className="px-6 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600">
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            <video ref={localVideoRef} autoPlay muted className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4 w-32 h-40 bg-gray-800 rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                <span className="text-white text-4xl font-bold">{userName?.charAt(0)}</span>
              </div>
            </div>
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
              <p className="text-white font-bold">{userName}</p>
            </div>
          </>
        )}
      </div>
      <div className="bg-gray-900 p-6 flex justify-center gap-4">
        <button onClick={() => setIsMuted(!isMuted)} className={`w-14 h-14 rounded-full flex items-center justify-center ${isMuted ? 'bg-red-500' : 'bg-gray-700'}`}>
          {isMuted ? <MicOff className="text-white" /> : <Mic className="text-white" />}
        </button>
        <button onClick={() => setIsVideoOff(!isVideoOff)} className={`w-14 h-14 rounded-full flex items-center justify-center ${isVideoOff ? 'bg-red-500' : 'bg-gray-700'}`}>
          {isVideoOff ? <VideoOff className="text-white" /> : <Video className="text-white" />}
        </button>
        <button onClick={handleClose} className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center">
          <PhoneOff className="text-white" />
        </button>
      </div>
    </div>
  );
}
