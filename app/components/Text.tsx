"use client";
import { FC, useState } from "react";
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

  const [emrChart, setEmrChart] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser does not support speech recognition.</span>;
  }

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: "ko-KR" });
  };

  const stopListening = async () => {
    SpeechRecognition.stopListening();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-chart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcript }),
      });

      const data = await response.json();
      if (response.ok) {
        setEmrChart(data.emrChart.message.content);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
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
          <button className="btn btn-secondary btn-sm" onClick={stopListening}>
            Stop
          </button>
          <button className="btn btn-accent btn-sm" onClick={resetTranscript}>
            Reset
          </button>
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {emrChart && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Generated EMR Chart</h2>
          <pre className="bg-gray-200 p-4 rounded">{emrChart}</pre>
        </div>
      )}
    </div>
  );
};

export default Text;
