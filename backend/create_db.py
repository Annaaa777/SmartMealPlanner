from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.recipe_model import Base, Recipe

# Create SQLite DB
engine = create_engine('sqlite:///mealplanner.db')
Base.metadata.create_all(engine)

# Create a session
Session = sessionmaker(bind=engine)
session = Session()

recipes = [
    {"name": "Oatmeal", "price": 2, "calories": 300, "protein": 10, "carbs": 50, "fat": 5, "meal_type": "Breakfast", "ingredients": "Oats, Milk, Honey"},
    {"name": "Grilled Chicken", "price": 5, "calories": 400, "protein": 35, "carbs": 0, "fat": 10, "meal_type": "Lunch", "ingredients": "Chicken Breast, Olive Oil, Spices"},
    {"name": "Salad", "price": 3, "calories": 150, "protein": 5, "carbs": 10, "fat": 7, "meal_type": "Lunch", "ingredients": "Lettuce, Tomato, Dressing"},
    {"name": "Smoothie", "price": 4, "calories": 250, "protein": 8, "carbs": 40, "fat": 5, "meal_type": "Snack", "ingredients": "Banana, Milk, Berries"},
    {"name": "Pasta", "price": 6, "calories": 600, "protein": 15, "carbs": 100, "fat": 10, "meal_type": "Dinner", "ingredients": "Pasta, Tomato Sauce, Cheese"}
]

# Add to DB
for r in recipes:
    session.add(Recipe(**r))

session.commit()
print("✅ Database created and recipes inserted with meal_type!")
