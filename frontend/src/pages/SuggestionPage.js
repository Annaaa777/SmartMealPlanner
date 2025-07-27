import React from 'react';
import IngredientSuggest from '../components/IngredientSuggest';

function SuggestionPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-green-700">What Can I Make?</h2>
      <div className="bg-white shadow rounded-lg p-6">
        <IngredientSuggest />
      </div>
    </div>
  );
}

export default SuggestionPage;

