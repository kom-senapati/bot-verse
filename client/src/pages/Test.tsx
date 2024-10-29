import { SERVER_URL } from "@/lib/utils";
import axios from "axios";
import { useState } from "react";

const TextToSpeechDownload = () => {
  const [text, setText] = useState("");
  function downloadAudio() {
    axios
      .post(`${SERVER_URL}/api/tts`, { text }, { responseType: "blob" })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "speech.mp3");
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.error("Error generating audio", error);
      });
  }

  return (
    <div>
      <textarea
        placeholder="Enter text to convert to speech"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        cols={50}
      />
      <button onClick={downloadAudio}>Convert & Download</button>
    </div>
  );
};

export default TextToSpeechDownload;
