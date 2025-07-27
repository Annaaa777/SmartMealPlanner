import React, { useState } from 'react';
import MealPlanForm from '../components/MealPlanForm';
import MealPlanResult from '../components/MealPlanResult';

function MealPlanPage() {
  const [mealPlan, setMealPlan] = useState(null);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-green-700">Meal Planner</h2>
      <div className="bg-white shadow rounded-lg p-6">
        <MealPlanForm setMealPlan={setMealPlan} />
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <MealPlanResult mealPlan={mealPlan} />
      </div>
    </div>
  );
}

export default MealPlanPage;
