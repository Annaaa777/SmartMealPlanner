import requests
from sqlalchemy.orm import sessionmaker
from models.recipe_model import Recipe
from sqlalchemy import create_engine

API_KEY = "53890e0e7063436d96b4cee73d098e6e"  
BASE_URL = "https://api.spoonacular.com/recipes/random"

engine = create_engine('sqlite:///mealplanner.db')
Session = sessionmaker(bind=engine)

def fetch_and_store_recipes(count=10):
    url = f"{BASE_URL}?number={count}&apiKey={API_KEY}&addRecipeNutrition=true"
    response = requests.get(url)

    if response.status_code != 200:
        raise Exception(f"Spoonacular API error: {response.status_code} - {response.text}")

    data = response.json()
    if 'recipes' not in data:
        raise Exception(f"Unexpected API response: {data}")

    session = Session()
    added_count = 0

    for recipe in data['recipes']:
        name = recipe.get('title', 'Unknown Recipe')
        nutrition = recipe.get('nutrition', {}).get('nutrients', [])
        calories = 0
        protein = 0
        carbs = 0
        fat = 0

        # Extract nutrients
        for n in nutrition:
            if n['name'] == 'Calories':
                calories = int(n['amount'])
            elif n['name'] == 'Protein':
                protein = int(n['amount'])
            elif n['name'] == 'Carbohydrates':
                carbs = int(n['amount'])
            elif n['name'] == 'Fat':
                fat = int(n['amount'])

        price = round(recipe.get('pricePerServing', 0) / 100, 2)
        ingredients = ", ".join([ing['name'] for ing in recipe.get('extendedIngredients', [])])

        # Create Recipe object
        new_recipe = Recipe(
            name=name,
            price=price,
            calories=calories,
            protein=protein,
            carbs=carbs,
            fat=fat,
            ingredients=ingredients
        )
        session.add(new_recipe)
        added_count += 1

    session.commit()
    session.close()
    return added_count
