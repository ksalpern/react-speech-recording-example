import { CircleStop, Mic, Save, Volume2 } from "lucide-react";
import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import React, { useEffect, useState } from "react";
import { cn } from "./utils/cn";

export const App: React.FC = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [language, setLanguage] = useState("en-US");
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const chars = transcript.replace(/\s+/g, "");
    setCharCount(chars.length);
  }, [transcript]);

  const handleStartRecording = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true, language });
    }
  };

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLanguage(event.target.value);
  };

  const handleSaveTranscript = () => {
    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transcript.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSpeakTranscript = () => {
    const utterance = new SpeechSynthesisUtterance(transcript);
    utterance.lang = language;
    window.speechSynthesis.speak(utterance);
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Your Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className='w-full h-full grid place-items-center'>
      <div className='xl:w-[25vw] lg:w-[40vw] md:w-[60vw] w-[90%] flex flex-col shadow-lg bg-neutral-900 p-5 rounded-lg relative'>
        <div className='w-full h-[200px] relative pb-2 pt-8 font-medium text-white leading-7'>
          <Save
            onClick={() => transcript && handleSaveTranscript}
            className={cn(
              "absolute top-0 left-0",
              transcript
                ? "cursor-pointer opacity-100"
                : "cursor-default opacity-60",
              "text-white"
            )}
          />
          <Volume2
            onClick={handleSpeakTranscript}
            className={cn(
              "absolute bottom-0 left-0",
              transcript
                ? "cursor-pointer opacity-100"
                : "cursor-default opacity-60",
              "text-white"
            )}
          />
          <select
            className='w-fit px-1 bg-gray-500 text-white font-medium rounded-lg absolute top-0 right-0 outline-none'
            onChange={handleLanguageChange}
            value={language}
          >
            <option value='en-US'>English</option>
            <option value='uk-UA'>Ukrainian</option>
            <option value='pl-PL'>Polish</option>
          </select>
          <div className='h-[140px] pb-2 mt-2 pr-1 w-full overflow-y-auto'>
            {transcript ? (
              transcript
            ) : (
              <div className='absolute opacity-60 left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 font-bold text-[30px] text-center text-gray-500'>
                Click On Start Recording
              </div>
            )}
          </div>
        </div>
        <div
          className={cn(
            "mt-5 text-white font-medium",
            transcript ? "opacity-100" : "opacity-40"
          )}
        >
          <p>Character Count: {charCount}</p>
        </div>
        <div className='flex w-full items-center gap-3 mt-5'>
          <button
            className={cn(
              "w-[70%] flex gap-1 justify-center text-white font-medium rounded-md py-3",
              listening ? "bg-red-500" : "bg-violet-600"
            )}
            onClick={handleStartRecording}
          >
            {listening ? <CircleStop /> : <Mic />}
            {listening ? "Stop Recording" : "Start Recording"}
          </button>
          <button
            className='w-[30%] bg-gray-500 text-white font-medium rounded-md py-3'
            onClick={() => {
              SpeechRecognition.stopListening();
              resetTranscript();
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
