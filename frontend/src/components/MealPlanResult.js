import React from "react";

export default function MealPlanResult({ mealPlan }) {
  if (!mealPlan || !mealPlan.selected_meals || mealPlan.selected_meals.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 text-gray-600 dark:text-gray-400 text-center">
        No meal plan generated yet. Enter your budget and calorie goal to get started!
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 mt-6">
      <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-4">Your Optimized Meal Plan</h2>
      <ul className="space-y-3">
        {mealPlan.selected_meals.map((meal, index) => (
          <li
            key={index}
            className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{meal.name}</p>
            <p className="text-gray-600 dark:text-gray-400">
              ${meal.price.toFixed(2)} | {meal.calories} cal | Protein: {meal.protein}g | Carbs: {meal.carbs}g | Fat: {meal.fat}g
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-6 border-t border-gray-300 dark:border-gray-700 pt-4">
        <p className="text-gray-800 dark:text-gray-200"><strong>Total Price:</strong> ${mealPlan.total_price.toFixed(2)}</p>
        <p className="text-gray-800 dark:text-gray-200"><strong>Total Calories:</strong> {mealPlan.total_calories} kcal</p>
        <p className="text-gray-800 dark:text-gray-200"><strong>Total Protein:</strong> {mealPlan.total_protein}g</p>
      </div>
    </div>
  );
}
