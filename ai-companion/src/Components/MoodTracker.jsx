import React, { useState } from "react";

export default function MoodTracker() {
  const [moodHistory, setMoodHistory] = useState([]);
  const [currentMood, setCurrentMood] = useState("");
  const [textInput, setTextInput] = useState("");
  const [sentimentResult, setSentimentResult] = useState("");

  const moods = [
    { emoji: "😊", label: "Happy", color: "bg-green-400" },
    { emoji: "😔", label: "Sad", color: "bg-blue-400" },
    { emoji: "😡", label: "Angry", color: "bg-red-400" },
    { emoji: "😴", label: "Tired", color: "bg-purple-400" },
    { emoji: "😌", label: "Relaxed", color: "bg-teal-400" },
  ];

  const saveMood = (mood) => {
    const today = new Date().toLocaleDateString();
    const newEntry = { mood, date: today };

    setMoodHistory([newEntry, ...moodHistory]);
    setCurrentMood(mood.label);
  };

  const analyzeMood = () => {
    if (textInput.trim() === "") return;

    if (textInput.includes("happy") || textInput.includes("good")) {
      setSentimentResult("😊 Positive Mood");
    } else if (textInput.includes("sad") || textInput.includes("bad")) {
      setSentimentResult("😔 Negative Mood");
    } else {
      setSentimentResult("😐 Neutral Mood");
    }
  };

  return (
    <div className="min-h-screen bg--100 p-6 flex justify-center items-center">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Mood Tracker
        </h1>

        <p className="text-center text-gray-500 mb-6">
          How are you feeling today?
        </p>

        {/* Mood Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {moods.map((mood, index) => (
            <button
              key={index}
              onClick={() => saveMood(mood)}
              className={`${mood.color} text-white p-4 rounded-xl hover:scale-105 transition`}
            >
              <div className="text-2xl">{mood.emoji}</div>
              <div className="text-sm">{mood.label}</div>
            </button>
          ))}
        </div>

        {/* Current Mood */}
        {currentMood && (
          <div className="text-center bg-gray-100 p-3 rounded-xl mb-4">
            <p className="text-gray-700">
              Current Mood: <span className="font-bold">{currentMood}</span>
            </p>
          </div>
        )}

        {/* NLP Sentiment Analysis Section */}
        <div className="mb-6">
          <div className="flex w-full justify-evenly">
            <h2 className="font-semibold text-lg mb-1">
              Mood Analysis (NLP)
            </h2>
            <h2 className="float-right mb-2">
              <button className=" bg-white border-1 p-1 rounded-xl hover:bg-gray-200
              "> LSTM Model </button>
            </h2>
          </div>
          <textarea
            rows="3"
            placeholder="Write how you feel today..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>

          <button
            onClick={analyzeMood}
            className="w-full mt-3 bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition"
          >
            Analyze Mood
          </button>

          {sentimentResult && (
            <div className="mt-3 bg-gray-100 p-3 rounded-xl text-center font-medium text-gray-700">
              {sentimentResult}
            </div>
          )}
        </div>

        {/* Mood History */}
        <div>
          <h2 className="font-semibold text-lg mb-2">Mood History</h2>

          {moodHistory.length === 0 ? (
            <p className="text-gray-400 text-sm">No mood entries yet.</p>
          ) : (
            <ul className="space-y-2 max-h-52 overflow-y-auto">
              {moodHistory.map((entry, index) => (
                <li
                  key={index}
                  className="bg-gray-50 p-3 rounded-lg flex justify-between"
                >
                  <span>
                    {entry.mood.emoji} {entry.mood.label}
                  </span>
                  <span className="text-sm text-gray-500">
                    {entry.date}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}