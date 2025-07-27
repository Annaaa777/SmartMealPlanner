import React from 'react';
import RecipeForm from '../components/RecipeForm';
import RecipeList from '../components/RecipeList';

function RecipePage() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-green-700">Manage Recipes</h2>
      <div className="bg-white shadow rounded-lg p-6">
        <RecipeForm />
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <RecipeList />
      </div>
    </div>
  );
}

export default RecipePage;
