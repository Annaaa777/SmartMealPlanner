import pulp
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.recipe_model import Recipe

# Database setup
engine = create_engine('sqlite:///mealplanner.db')
Session = sessionmaker(bind=engine)

def generate_meal_plan(budget, calorie_goal):
    session = Session()
    recipes = session.query(Recipe).all()

    if not recipes:
        session.close()
        return {"selected_meals": [], "total_price": 0, "total_calories": 0, "total_protein": 0, "total_carbs": 0, "total_fat": 0}

    # Objective weights
    w_calories = 0.4
    w_protein = 0.4
    w_cost = -0.2  # Negative because we want to minimize cost

    # Create optimization problem
    prob = pulp.LpProblem("MealPlanOptimization", pulp.LpMaximize)

    # Binary decision variables: choose recipe or not
    choices = pulp.LpVariable.dicts("ChooseRecipe", range(len(recipes)), 0, 1, cat='Binary')

    # Objective function: Maximize weighted sum of nutrition and cost
    prob += pulp.lpSum([
        (w_calories * recipes[i].calories +
         w_protein * recipes[i].protein +
         w_cost * recipes[i].price) * choices[i]
        for i in range(len(recipes))
    ])

    # Constraints
    # 1. Total cost ≤ budget
    prob += pulp.lpSum([recipes[i].price * choices[i] for i in range(len(recipes))]) <= budget

    # 2. Calories between 80% and 110% of goal
    prob += pulp.lpSum([recipes[i].calories * choices[i] for i in range(len(recipes))]) >= calorie_goal * 0.8
    prob += pulp.lpSum([recipes[i].calories * choices[i] for i in range(len(recipes))]) <= calorie_goal * 1.1

    # 3. Number of meals between 3 and 5
    prob += pulp.lpSum([choices[i] for i in range(len(recipes))]) >= 3
    prob += pulp.lpSum([choices[i] for i in range(len(recipes))]) <= 5

    # Solve the optimization problem
    prob.solve()

    # Collect selected meals
    selected_meals = []
    totals = {"price": 0, "calories": 0, "protein": 0, "carbs": 0, "fat": 0}

    for i in range(len(recipes)):
        if choices[i].value() == 1:
            meal = {
                "name": recipes[i].name,
                "price": recipes[i].price,
                "calories": recipes[i].calories,
                "protein": recipes[i].protein,
                "carbs": recipes[i].carbs,
                "fat": recipes[i].fat
            }
            selected_meals.append(meal)
            totals["price"] += recipes[i].price
            totals["calories"] += recipes[i].calories
            totals["protein"] += recipes[i].protein
            totals["carbs"] += recipes[i].carbs
            totals["fat"] += recipes[i].fat

    session.close()

    return {
        "selected_meals": selected_meals,
        "total_price": round(totals["price"], 2),
        "total_calories": totals["calories"],
        "total_protein": totals["protein"],
        "total_carbs": totals["carbs"],
        "total_fat": totals["fat"]
    }
