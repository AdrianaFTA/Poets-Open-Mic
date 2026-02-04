import { useEffect, useRef } from "react";

const SpeechToText = ({ onResult, listening, setListening, disabled }) => {
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      onResult(transcript);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, [onResult, setListening]);

  useEffect(() => {
    if (!recognitionRef.current) return;

    if (listening && !disabled) {
      recognitionRef.current.start();
    } else {
      recognitionRef.current.stop();
    }
  }, [listening, disabled]);

  return (
    <button
      onClick={() => setListening(!listening)}
      disabled={disabled}
      className={`p-2 rounded ${
        listening ? "bg-red-600" : "bg-green-600"
      }`}
    >
      {listening ? "🎙 Stop Dictation" : "🎤 Start Dictation"}
    </button>
  );
};

export default SpeechToText;
