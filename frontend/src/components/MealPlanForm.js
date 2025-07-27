import React, { useState } from "react";
import { generateMealPlan } from "../services/api";

export default function MealPlanForm({ setMealPlan }) {
  const [budget, setBudget] = useState("");
  const [calorieGoal, setCalorieGoal] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await generateMealPlan({
        budget: parseFloat(budget),
        calorie_goal: parseFloat(calorieGoal),
      });

      console.log("Meal Plan API Response:", response);

      if (response.success && response.meal_plan) {
        setMealPlan(response.meal_plan);
      } else {
        setError("No meal plan could be generated. Try increasing your budget or lowering calories.");
      }
    } catch (err) {
      console.error("Error generating meal plan:", err);
      setError("Failed to generate meal plan. Please try again.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 mb-8">
      <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4">Generate Meal Plan</h2>
      <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-4">
        <input
          type="number"
          placeholder="Budget ($)"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          placeholder="Calorie Goal"
          value={calorieGoal}
          onChange={(e) => setCalorieGoal(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-300"
        >
          Generate
        </button>
      </form>
      {error && <p className="text-red-500 mt-3">{error}</p>}
    </div>
  );
}
