import React, { useState } from "react";
import axios from "axios";

function NutritionForm() {
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [foodInput, setFoodInput] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      "https://heath-monitor-backend.vercel.app/api/analyze",
      {
        weight,
        age,
        foodInput,
      }
    );
    setResult(res.data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <input
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <input
          placeholder="What did you eat?"
          value={foodInput}
          onChange={(e) => setFoodInput(e.target.value)}
        />
        <button type="submit">Analyze</button>
      </form>
      {result && (
        <div>
          <h3>AI Nutrition Analysis</h3>
          <pre>{JSON.stringify(result.ai, null, 2)}</pre>
          <h4>YouTube Suggestions</h4>
          <ul>
            {result.youtube.map((vid, i) => (
              <li key={i}>
                <a href={vid.url} target="_blank" rel="noopener noreferrer">
                  {vid.title}
                </a>
              </li>
            ))}
          </ul>
          <h4>Workout Suggestions</h4>
          <ul>
            {result.workout.map((vid, i) => (
              <li key={i}>
                <a href={vid.url} target="_blank" rel="noopener noreferrer">
                  {vid.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default NutritionForm;
