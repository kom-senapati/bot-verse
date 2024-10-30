// src/hooks/useSpeech.tsx
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const useSpeech = (onTranscript: (transcript: string) => void) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any | null>(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("Your browser does not support speech recognition.");
      return;
    }

    recognitionRef.current = new (window as any).webkitSpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
    };

    return () => {
      recognitionRef.current?.stop();
    };
  }, [onTranscript]);

  const toggleMicrophone = () => {
    if (isRecording) {
      setIsRecording(false);
      recognitionRef.current?.stop();
    } else {
      setIsRecording(true);
      recognitionRef.current?.start();
    }
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  return {
    isRecording,
    toggleMicrophone,
    speak,
  };
};

export default useSpeech;
