import React, { useState } from 'react';
import { updateRecipe } from '../services/api';

const UpdateRecipeForm = ({ recipe, onClose, refresh }) => {
  const [formData, setFormData] = useState({ ...recipe });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateRecipe(recipe.id, formData);
      refresh(); // Refresh recipe list
      onClose(); // Close modal
    } catch (error) {
      console.error('Error updating recipe:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          Edit Recipe
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input w-full"
            placeholder="Recipe Name"
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="input w-full"
            placeholder="Price"
          />
          <input
            type="number"
            name="calories"
            value={formData.calories}
            onChange={handleChange}
            className="input w-full"
            placeholder="Calories"
          />
          <input
            type="number"
            name="protein"
            value={formData.protein}
            onChange={handleChange}
            className="input w-full"
            placeholder="Protein"
          />
          <input
            type="number"
            name="carbs"
            value={formData.carbs}
            onChange={handleChange}
            className="input w-full"
            placeholder="Carbs"
          />
          <input
            type="number"
            name="fat"
            value={formData.fat}
            onChange={handleChange}
            className="input w-full"
            placeholder="Fat"
          />
          <textarea
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            className="input w-full"
            placeholder="Ingredients"
          />
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRecipeForm;
