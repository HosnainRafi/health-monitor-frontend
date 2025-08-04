import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell, // <-- IMPORT PieChart, Pie, Cell
} from "recharts";

// --- HELPER COMPONENTS ---

// Helper function for BMI badge color
const getBmiBadgeClass = (category) => {
  // ... (no change)
  if (!category) return "bg-secondary";
  const cat = category.toLowerCase();
  if (cat.includes("underweight")) return "bg-warning text-dark";
  if (cat.includes("normal")) return "bg-success";
  if (cat.includes("overweight")) return "bg-warning text-dark";
  if (cat.includes("obese")) return "bg-danger";
  return "bg-secondary";
};

// A chart to compare meal calories against daily goal
const DailyGoalComparisonChart = ({ mealAnalysis, userStatus }) => {
  // ... (no change)
  if (!mealAnalysis || !userStatus) return null;
  const data = [
    {
      name: "Calories",
      "Your Meal": mealAnalysis.calories,
      "Your Daily Goal": userStatus.dailyCalorieGoal,
    },
  ];
  return (
    <div className="card mb-4">
      <div className="card-header">
        <h4 className="mb-0">Your Meal vs. Daily Goal</h4>
      </div>
      <div className="card-body" style={{ height: "250px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={80} />
            <Tooltip formatter={(value) => `${Math.round(value)} kcal`} />
            <Legend />
            <Bar dataKey="Your Meal" fill="#ffc107" />
            <Bar dataKey="Your Daily Goal" fill="#0d6efd" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Component for User Status Card
const UserStatusCard = ({ status }) => {
  // ... (no change)
  if (!status) return null;
  return (
    <div className="card mb-4">
      <div className="card-header">
        <h4 className="mb-0">Your Health Status</h4>
      </div>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5>
            Your BMI: {status.bmi.toFixed(1)}
            <span
              className={`badge ms-2 ${getBmiBadgeClass(status.bmiCategory)}`}
            >
              {status.bmiCategory}
            </span>
          </h5>
        </div>
        <p className="text-muted">{status.bmiStatusMessage}</p>
        <div className="row text-center">
          <div className="col-6 col-md-6">
            <div className="stat-box p-2 border rounded">
              <div className="fs-4 fw-bold">{Math.round(status.bmr)}</div>
              <div className="text-muted">BMR (Resting Calories)</div>
            </div>
          </div>
          <div className="col-6 col-md-6">
            <div className="stat-box p-2 border rounded">
              <div className="fs-4 fw-bold">
                {Math.round(status.dailyCalorieGoal)}
              </div>
              <div className="text-muted">Daily Calorie Goal</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MODIFIED MealAnalysisCard to include the NutritionChart ---
const MealAnalysisCard = ({ analysis }) => {
  if (!analysis) return null;

  const COLORS = ["#0d6efd", "#198754", "#dc3545"]; // Blue (Calories), Green (Protein), Red (Sugar)
  const chartData = [
    { name: "Protein", value: analysis.protein || 0 },
    { name: "Sugar", value: analysis.sugar || 0 },
    // We add other macronutrients (carbs, fat) here if the AI provides them
  ];

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h4 className="mb-0">Logged Meal Analysis</h4>
      </div>
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-md-7">
            <p>
              <strong>Summary:</strong> {analysis.summary}
            </p>
            <div className="d-flex justify-content-around text-center mt-4">
              <div>
                <div className="fs-4 fw-bold">
                  {Math.round(analysis.calories)}
                </div>
                <div className="text-muted">Calories</div>
              </div>
              <div>
                <div className="fs-4 fw-bold">
                  {Math.round(analysis.protein)}g
                </div>
                <div className="text-muted">Protein</div>
              </div>
              <div>
                <div className="fs-4 fw-bold">
                  {Math.round(analysis.sugar)}g
                </div>
                <div className="text-muted">Sugar</div>
              </div>
            </div>
          </div>
          <div className="col-md-5">
            <h6 className="text-center text-muted">
              Nutrient Breakdown (by grams)
            </h6>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}g`, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// YouTube Card List Component
const YouTubeCardList = ({ title, videos }) => {
  // ... (no change)
  if (!videos || videos.length === 0) return null;
  return (
    <div className="mb-4">
      <h4 className="mb-3">{title}</h4>
      <div className="row g-4">
        {videos.map((vid, i) => (
          <div key={i} className="col-md-4">
            <div className="card h-100 shadow-sm">
              <a href={vid.url} target="_blank" rel="noopener noreferrer">
                <img
                  src={vid.thumbnail}
                  className="card-img-top"
                  alt={vid.title}
                />
              </a>
              <div className="card-body">
                <h6 className="card-title" style={{ fontSize: "0.9rem" }}>
                  <a
                    href={vid.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none text-dark"
                  >
                    {vid.title}
                  </a>
                </h6>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MAIN RESULT PAGE COMPONENT ---
function ResultPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // ... (no change to useEffect)
    const fetchAnalysis = async () => {
      const userInput = JSON.parse(localStorage.getItem("userInput"));
      if (!userInput) {
        setError(
          "No user data found. Please go back and fill in your details."
        );
        setLoading(false);
        return;
      }
      try {
        const res = await axios.post(
          "https://heath-monitor-backend.vercel.app/api/analyze",
          userInput
        );
        setResult(res.data);
      } catch (err) {
        setError(
          "Failed to get analysis. The AI service might be down or the request failed. Please try again."
        );
        console.error("Analysis Error:", err);
      }
      setLoading(false);
    };
    fetchAnalysis();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-5">
        <h3>Generating Your Personalized Plan...</h3>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  if (error)
    return <div className="alert alert-danger container mt-5">{error}</div>;
  if (!result || !result.ai)
    return (
      <div className="alert alert-warning container mt-5">
        Could not retrieve AI data.
      </div>
    );

  const { ai, youtube, workoutVideos } = result;

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Your Personalized Health Report</h2>

      <UserStatusCard status={ai.userStatus} />
      <DailyGoalComparisonChart
        mealAnalysis={ai.mealAnalysis}
        userStatus={ai.userStatus}
      />

      {/* The MealAnalysisCard now includes the nutrition chart */}
      <MealAnalysisCard analysis={ai.mealAnalysis} />

      {/* Action Plan Card */}
      <div className="card mb-4">
        {/* ... (no change to this card) ... */}
        <div className="card-header">
          <h4 className="mb-0">Your Action Plan</h4>
        </div>
        <div className="card-body">
          <h5 className="text-success">What to Do</h5>
          <ul className="list-group list-group-flush mb-3">
            {ai.actionPlan.whatToDo.map((item, i) => (
              <li key={i} className="list-group-item">
                {item}
              </li>
            ))}
          </ul>
          <h5 className="text-danger">What to Avoid</h5>
          <ul className="list-group list-group-flush mb-3">
            {ai.actionPlan.whatToAvoid.map((item, i) => (
              <li key={i} className="list-group-item">
                {item}
              </li>
            ))}
          </ul>
          <h5>What to Eat (with portions)</h5>
          <ul className="list-group list-group-flush">
            {ai.actionPlan.whatToEat.map((item, i) => (
              <li key={i} className="list-group-item">
                <strong>{item.food}:</strong> {item.portion}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sample Meal Plan Card */}
      <div className="card mb-4">
        {/* ... (no change to this card) ... */}
        <div className="card-header">
          <h4 className="mb-0">Sample Daily Meal Plan</h4>
        </div>
        <div className="card-body">
          <p>
            This is a sample plan based on your calorie goal of{" "}
            <strong>{Math.round(ai.userStatus.dailyCalorieGoal)} kcal</strong>.
          </p>
          <dl className="row">
            <dt className="col-sm-3">Breakfast</dt>
            <dd className="col-sm-9">{ai.sampleMealPlan.breakfast}</dd>
            <dt className="col-sm-3">Lunch</dt>
            <dd className="col-sm-9">{ai.sampleMealPlan.lunch}</dd>
            <dt className="col-sm-3">Dinner</dt>
            <dd className="col-sm-9">{ai.sampleMealPlan.dinner}</dd>
          </dl>
        </div>
      </div>

      {/* Workout Card */}
      <div className="card text-white bg-primary mb-4">
        {/* ... (no change to this card) ... */}
        <div className="card-body">
          <h4 className="card-title">Recommended Workout</h4>
          <p className="card-text fs-5">{ai.workoutSuggestion}</p>
        </div>
      </div>

      {/* YouTube Video Section */}
      <div className="card mb-4">
        {/* ... (no change to this card) ... */}
        <div className="card-header">
          <h4 className="mb-0">Helpful Videos</h4>
        </div>
        <div className="card-body">
          <YouTubeCardList title="Recipe Ideas" videos={youtube} />
          <hr className="my-4" />
          <YouTubeCardList title="Suggested Workouts" videos={workoutVideos} />
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
