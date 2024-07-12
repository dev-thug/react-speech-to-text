//@ts-nocheck
"use client";
import { FC } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

interface TextProps {}

const Text: FC<TextProps> = ({}) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser does not support speech recognition.</span>;
  }

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true });
  };

  return (
    <div>
      <h1 className="lg:text-5xl font-bold underline decoration-wavy text-2xl">
        Bird
      </h1>
      <p className="mt-6 pb-32 mb-4 rounded-md bg-base-100 lg:w-96 lg:h-48 w-64 h-64">
        <span className="ml-2 font-bold text-xl bg-base-100">
          generated text:
        </span>
        {transcript}
      </p>
      <p className="mb-2 text-xl font-bold">
        Microphone: {listening ? "Listening to your voice..." : "off"}
      </p>
      <div className="flex gap-3">
        <button className="btn btn-primary btn-sm" onClick={startListening}>
          Start
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={SpeechRecognition.stopListening}
        >
          Stop
        </button>
        <button className="btn btn-accent btn-sm" onClick={resetTranscript}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default Text;
