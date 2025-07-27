import React, { useState } from 'react';
import { addRecipe } from '../services/api';

const RecipeForm = ({ refresh }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    ingredients: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addRecipe(formData);
      setFormData({
        name: '',
        price: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        ingredients: ''
      });
      refresh(); // Refresh recipe list
    } catch (error) {
      console.error('Error adding recipe:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Add New Recipe</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Recipe Name"
          className="input"
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className="input"
        />
        <input
          type="number"
          name="calories"
          value={formData.calories}
          onChange={handleChange}
          placeholder="Calories"
          className="input"
        />
        <input
          type="number"
          name="protein"
          value={formData.protein}
          onChange={handleChange}
          placeholder="Protein"
          className="input"
        />
        <input
          type="number"
          name="carbs"
          value={formData.carbs}
          onChange={handleChange}
          placeholder="Carbs"
          className="input"
        />
        <input
          type="number"
          name="fat"
          value={formData.fat}
          onChange={handleChange}
          placeholder="Fat"
          className="input"
        />
        <textarea
          name="ingredients"
          value={formData.ingredients}
          onChange={handleChange}
          placeholder="Ingredients"
          className="input col-span-2"
        />
        <button
          type="submit"
          className="col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Add Recipe
        </button>
      </form>
    </div>
  );
};

export default RecipeForm;
