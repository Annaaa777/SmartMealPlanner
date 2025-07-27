from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Recipe(Base):
    __tablename__ = 'recipes'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    calories = Column(Integer, nullable=False)
    protein = Column(Integer, nullable=False)
    carbs = Column(Integer, nullable=False)
    fat = Column(Integer, nullable=False)
    meal_type = Column(String)
    ingredients = Column(String)