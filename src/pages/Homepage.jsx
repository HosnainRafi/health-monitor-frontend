import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// A simple "database" of common Bangladeshi foods to power the search.
// This can be expanded or moved to a separate file (e.g., `src/data/foods.js`).
const BANGLADESHI_FOOD_DATABASE = [
  { name: "Bhaat (Plain Rice)", portion: "1 plate" },
  { name: "Ruti (Flatbread)", portion: "2 pcs" },
  { name: "Paratha", portion: "1 pc" },
  { name: "Dal (Lentil Soup)", portion: "1 bowl" },
  { name: "Dim Bhaji (Fried Egg)", portion: "1 pc" },
  { name: "Dim Bhuna (Egg Curry)", portion: "1 pc" },
  { name: "Alu Bhorta (Mashed Potato)", portion: "1/2 cup" },
  { name: "Begun Bhorta (Mashed Eggplant)", portion: "1/2 cup" },
  { name: "Shobji (Mixed Vegetables)", portion: "1 cup" },
  { name: "Murgir Mangsho (Chicken Curry)", portion: "1 piece" },
  { name: "Gorur Mangsho (Beef Curry)", portion: "1 piece" },
  { name: "Maach Bhaja (Fried Fish)", portion: "1 piece" },
  { name: "Chingri Malai Curry (Prawn Curry)", portion: "1/2 cup" },
  { name: "Singara", portion: "1 pc" },
  { name: "Samosa", portion: "1 pc" },
  { name: "Cha (Tea with milk & sugar)", portion: "1 cup" },
  { name: "Mishti Doi (Sweet Yogurt)", portion: "1 cup" },
];

function HomePage() {
  // State for personal user details
  const [personalDetails, setPersonalDetails] = useState({
    weight: "",
    age: "",
    height: "",
    gender: "male",
    activityLevel: "sedentary",
  });

  // State for the user's primary health goal or concern
  const [healthGoal, setHealthGoal] = useState("");

  // State for the categorized meals
  const [meals, setMeals] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  });

  const [activeMeal, setActiveMeal] = useState("breakfast");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  // Effect for handling the live search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }
    const results = BANGLADESHI_FOOD_DATABASE.filter((food) =>
      food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm]);

  // --- Handler Functions ---

  const handleDetailsChange = (e) => {
    setPersonalDetails({ ...personalDetails, [e.target.name]: e.target.value });
  };

  const handleAddFood = (food) => {
    setMeals((prevMeals) => ({
      ...prevMeals,
      [activeMeal]: [...prevMeals[activeMeal], food],
    }));
    setSearchTerm(""); // Clear search bar after adding
    setSearchResults([]);
  };

  const handleRemoveFood = (mealType, indexToRemove) => {
    setMeals((prevMeals) => ({
      ...prevMeals,
      [mealType]: prevMeals[mealType].filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Create a structured food input string for the AI
    const foodInputString = Object.entries(meals)
      .filter(([, foods]) => foods.length > 0)
      .map(([mealType, foods]) => {
        const foodItems = foods.map((f) => `${f.portion} ${f.name}`).join(", ");
        return `${
          mealType.charAt(0).toUpperCase() + mealType.slice(1)
        }: ${foodItems}.`;
      })
      .join(" ");

    // Save all collected data, including the new healthGoal, to localStorage
    localStorage.setItem(
      "userInput",
      JSON.stringify({
        ...personalDetails,
        foodInput: foodInputString,
        healthGoal,
      })
    );

    navigate("/result");
  };

  // Determine if the submit button should be disabled
  const isSubmitDisabled =
    !personalDetails.weight ||
    !personalDetails.height ||
    !personalDetails.age ||
    Object.values(meals).every((meal) => meal.length === 0);

  // --- Render ---

  return (
    <div className="container my-5">
      <div className="card shadow-lg p-4 p-md-5">
        <h1 className="mb-4 text-center text-primary">AI Nutrition Planner</h1>
        <p className="text-center text-muted mb-5">
          Log your details and meal to get a personalized health analysis.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Section 1: Personal Details */}
          <div className="card p-4 mb-4">
            <h4 className="card-title mb-3">Your Profile</h4>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  className="form-control"
                  value={personalDetails.weight}
                  onChange={handleDetailsChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  className="form-control"
                  value={personalDetails.height}
                  onChange={handleDetailsChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  name="age"
                  className="form-control"
                  value={personalDetails.age}
                  onChange={handleDetailsChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Gender</label>
                <select
                  name="gender"
                  className="form-select"
                  value={personalDetails.gender}
                  onChange={handleDetailsChange}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="col-12 mb-3">
                <label className="form-label">Weekly Activity Level</label>
                <select
                  name="activityLevel"
                  className="form-select"
                  value={personalDetails.activityLevel}
                  onChange={handleDetailsChange}
                >
                  <option value="sedentary">
                    Sedentary (little or no exercise)
                  </option>
                  <option value="light">
                    Lightly Active (light exercise/sports 1-3 days/week)
                  </option>
                  <option value="moderate">
                    Moderately Active (moderate exercise/sports 3-5 days/week)
                  </option>
                  <option value="active">
                    Very Active (hard exercise/sports 6-7 days a week)
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Professional Meal Logger */}
          <div className="card p-4 mb-4">
            <h4 className="card-title mb-3">Log Your Meals</h4>
            <ul className="nav nav-tabs nav-fill mb-3">
              {["breakfast", "lunch", "dinner", "snacks"].map((meal) => (
                <li className="nav-item" key={meal}>
                  <button
                    type="button"
                    className={`nav-link ${
                      activeMeal === meal ? "active" : ""
                    }`}
                    onClick={() => setActiveMeal(meal)}
                  >
                    {meal.charAt(0).toUpperCase() + meal.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mb-3 position-relative">
              <label className="form-label">Search for a food item...</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., 'Dal' or 'Ruti'"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchResults.length > 0 && (
                <div
                  className="list-group position-absolute w-100"
                  style={{ zIndex: 1000 }}
                >
                  {searchResults.map((food, index) => (
                    <button
                      type="button"
                      key={index}
                      className="list-group-item list-group-item-action"
                      onClick={() => handleAddFood(food)}
                    >
                      {food.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <h5 className="mt-4">
              {activeMeal.charAt(0).toUpperCase() + activeMeal.slice(1)} Log
            </h5>
            {meals[activeMeal].length > 0 ? (
              <ul className="list-group">
                {meals[activeMeal].map((food, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>
                      {food.portion} <strong>{food.name}</strong>
                    </span>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Remove"
                      onClick={() => handleRemoveFood(activeMeal, index)}
                    ></button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No food added to {activeMeal} yet.</p>
            )}
          </div>

          {/* Section 3: Health Goals/Concerns */}
          <div className="card p-4 mb-4">
            <h4 className="card-title mb-3">
              Your Main Health Goal or Concern
            </h4>
            <div className="mb-3">
              <label htmlFor="healthGoal" className="form-label">
                Describe what you want to achieve or what's bothering you.
                (Optional)
              </label>
              <textarea
                className="form-control"
                id="healthGoal"
                rows="3"
                placeholder="e.g., 'I am getting fatter day by day and feel tired all the time.' or 'I want to build muscle without gaining too much fat.'"
                value={healthGoal}
                onChange={(e) => setHealthGoal(e.target.value)}
              ></textarea>
            </div>
          </div>

          {/* Final Submit Button */}
          <button
            type="submit"
            className="btn btn-primary btn-lg w-100"
            disabled={isSubmitDisabled}
          >
            Analyze My Day
          </button>
        </form>
      </div>
    </div>
  );
}

export default HomePage;
