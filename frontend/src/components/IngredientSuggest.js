import React, { useState } from "react";
import { suggestRecipes } from "../services/api";

export default function IngredientSuggest() {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setRecipes([]); // Reset previous results

    try {
      const response = await suggestRecipes(ingredients);
      console.log("Full API Response:", response);
      console.log("Suggestions:", response.suggestions);
      if (response.suggestions?.[0]) {
        console.log("First recipe structure:", response.suggestions[0]);
      }

      if (response.success && response.suggestions && response.suggestions.length > 0) {
        setRecipes(response.suggestions);
      } else {
        setError("No recipes found for these ingredients.");
      }
    } catch (err) {
      console.error("Error suggesting recipes:", err);
      setError("Something went wrong. Try again.");
    }
  };

  // Helper function to safely handle ingredients
  const getIngredientsText = (ingredients) => {
    if (Array.isArray(ingredients)) {
      return ingredients.join(", ");
    } else if (typeof ingredients === 'string') {
      return ingredients;
    } else {
      return "Ingredients not available";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 mt-6">
      <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-4">What Can I Make?</h2>
      <form onSubmit={handleSubmit} className="flex gap-4">
        <input
          type="text"
          placeholder="Enter ingredients (comma separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          type="submit"
          className="bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-400 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-300"
        >
          Find Recipes
        </button>
      </form>
      {error && <p className="text-red-500 mt-3">{error}</p>}

      {/* ✅ Only render if recipes exist */}
      {recipes && recipes.length > 0 && (
        <div className="mt-6">
          <ul className="space-y-3">
            {recipes.map((r, idx) => (
              <li key={idx} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{r.name}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {r.calories} cal | Ingredients: {getIngredientsText(r.ingredients)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}