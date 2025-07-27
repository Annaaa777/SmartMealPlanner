import { getRecipes } from "../services/api";
import { useEffect, useState } from "react";

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRecipes();
      console.log("Fetched Recipes:", data); // ✅ Debugging
      if (data.success && data.recipes) {
        setRecipes(data.recipes);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-4">
        All Recipes
      </h2>
      {recipes.length === 0 ? (
        <p className="text-gray-500">No recipes available.</p>
      ) : (
        <table className="w-full border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Calories</th>
              <th className="py-2 px-4">Price</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((r) => (
              <tr
                key={r.id}
                className="border-t hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <td className="py-2 px-4">{r.name}</td>
                <td className="py-2 px-4">{r.calories}</td>
                <td className="py-2 px-4">${r.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
