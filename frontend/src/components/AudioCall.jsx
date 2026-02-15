import { useState, useEffect } from 'react';
import { X, Mic, MicOff, PhoneOff, Volume2, AlertCircle } from 'lucide-react';

export default function AudioCall({ isOpen, onClose, userName }) {
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    if (isOpen) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(mediaStream => {
          setStream(mediaStream);
          setError(null);
        })
        .catch(err => {
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setError('Microphone access denied. Please allow permissions in your browser settings.');
          } else if (err.name === 'NotFoundError') {
            setError('No microphone found on your device.');
          } else {
            setError('Unable to access microphone. Please check your device.');
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
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 to-purple-900 z-50 flex items-center justify-center">
      {error ? (
        <div className="text-center p-8">
          <AlertCircle size={64} className="text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Unable to Start Audio Call</h3>
          <p className="text-white/80 mb-6 max-w-md">{error}</p>
          <button onClick={handleClose} className="px-6 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600">
            Close
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-6xl text-white font-bold">{userName?.charAt(0)}</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">{userName}</h2>
          <p className="text-white/70 mb-8">Calling...</p>
          <div className="flex justify-center gap-6">
            <button onClick={() => setIsMuted(!isMuted)} className={`w-16 h-16 rounded-full flex items-center justify-center ${isMuted ? 'bg-red-500' : 'bg-white/20'}`}>
              {isMuted ? <MicOff className="text-white" size={24} /> : <Mic className="text-white" size={24} />}
            </button>
            <button className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Volume2 className="text-white" size={24} />
            </button>
            <button onClick={handleClose} className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
              <PhoneOff className="text-white" size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
