from flask import Blueprint, request, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.recipe_model import Recipe
from services.optimizer import generate_meal_plan
from services.fetch_recipes import fetch_and_store_recipes  # ✅ Import new function

meal_plan_bp = Blueprint('meal_plan', __name__)

# Database setup
engine = create_engine('sqlite:///mealplanner.db')
Session = sessionmaker(bind=engine)

@meal_plan_bp.route('/mealplan', methods=['POST'])
def create_meal_plan():
    try:
        data = request.get_json()
        print("\n🔥 DEBUG: Received data:", data)

        budget = float(data.get('budget', 0))
        calorie_goal = float(data.get('calorie_goal', 0))
        print(f"🔥 Budget: {budget}, Calorie Goal: {calorie_goal}")

        if budget <= 0 or calorie_goal <= 0:
            return jsonify({"success": False, "message": "Budget and Calorie Goal must be > 0"}), 400

        from services.optimizer import generate_meal_plan
        meal_plan = generate_meal_plan(budget, calorie_goal)

        print("🔥 Meal Plan generated:", meal_plan)
        return jsonify({"success": True, "meal_plan": meal_plan}), 200

    except Exception as e:
        import traceback
        print("\n🔥 ERROR in /mealplan:", e)
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500


# Add Recipe
@meal_plan_bp.route('/add_recipe', methods=['POST'])
def add_recipe():
    session = Session()
    try:
        data = request.get_json()
        recipe = Recipe(
            name=data['name'],
            price=data['price'],
            calories=data['calories'],
            protein=data['protein'],
            carbs=data['carbs'],
            fat=data['fat'],
            meal_type=data.get('meal_type', 'Other'),
            ingredients=data.get('ingredients', '')
        )
        session.add(recipe)
        session.commit()
        return jsonify({"success": True, "message": "Recipe added successfully"}), 200
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "error": str(e)}), 400
    finally:
        session.close()

# Get All Recipes
@meal_plan_bp.route('/get_recipes', methods=['GET'])
def get_recipes():
    session = Session()
    try:
        recipes = session.query(Recipe).all()
        recipe_list = [
            {
                "id": r.id,
                "name": r.name,
                "price": r.price,
                "calories": r.calories,
                "protein": r.protein,
                "carbs": r.carbs,
                "fat": r.fat,
                "meal_type": r.meal_type,
                "ingredients": r.ingredients
            }
            for r in recipes
        ]
        return jsonify({"success": True, "recipes": recipe_list}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400
    finally:
        session.close()

# Update Recipe
@meal_plan_bp.route('/update_recipe/<int:recipe_id>', methods=['PUT'])
def update_recipe(recipe_id):
    session = Session()
    try:
        data = request.get_json()
        recipe = session.query(Recipe).filter(Recipe.id == recipe_id).first()
        if not recipe:
            return jsonify({"success": False, "message": "Recipe not found"}), 404

        recipe.name = data.get('name', recipe.name)
        recipe.price = data.get('price', recipe.price)
        recipe.calories = data.get('calories', recipe.calories)
        recipe.protein = data.get('protein', recipe.protein)
        recipe.carbs = data.get('carbs', recipe.carbs)
        recipe.fat = data.get('fat', recipe.fat)
        recipe.meal_type = data.get('meal_type', recipe.meal_type)
        recipe.ingredients = data.get('ingredients', recipe.ingredients)

        session.commit()
        return jsonify({"success": True, "message": "Recipe updated successfully"}), 200
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "error": str(e)}), 400
    finally:
        session.close()

# Delete Recipe
@meal_plan_bp.route('/delete_recipe/<int:recipe_id>', methods=['DELETE'])
def delete_recipe(recipe_id):
    session = Session()
    try:
        recipe = session.query(Recipe).filter(Recipe.id == recipe_id).first()
        if not recipe:
            return jsonify({"success": False, "message": "Recipe not found"}), 404

        session.delete(recipe)
        session.commit()
        return jsonify({"success": True, "message": "Recipe deleted successfully"}), 200
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "error": str(e)}), 400
    finally:
        session.close()

# Fetch Recipes from Spoonacular and Insert into DB
@meal_plan_bp.route('/fetch_more_recipes', methods=['POST'])
def fetch_more_recipes_route():
    try:
        count = 10  # Default number of recipes to fetch
        added = fetch_and_store_recipes(count)
        return jsonify({"success": True, "message": f"Fetched {added} recipes"})
    except Exception as e:
        print(f"❌ Error fetching recipes: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

# Ingredient Suggestion Endpoint
@meal_plan_bp.route('/suggest', methods=['POST'])
def suggest_recipes():
    try:
        data = request.get_json()
        ingredients_input = data.get('ingredients', '')

        if not ingredients_input.strip():
            return jsonify({"success": False, "message": "No ingredients provided"}), 400

        # Convert input into list of lowercase keywords
        keywords = [kw.strip().lower() for kw in ingredients_input.split(",")]

        session = Session()
        recipes = session.query(Recipe).all()

        # ✅ Filter recipes that contain any of the keywords in their ingredient list
        suggestions = []
        for recipe in recipes:
            recipe_ingredients = (recipe.ingredients or "").lower()
            if any(kw in recipe_ingredients for kw in keywords):
                suggestions.append({
                    "name": recipe.name,
                    "calories": recipe.calories,
                    "ingredients": recipe.ingredients
                })

        session.close()

        return jsonify({"success": True, "suggestions": suggestions}), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500