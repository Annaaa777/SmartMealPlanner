from flask import Flask
from flask_cors import CORS
from routes.meal_plan_routes import meal_plan_bp

print("Starting app...")

try:
    from routes.meal_plan_routes import meal_plan_bp
    print("Successfully imported meal_plan_bp")
except ImportError as e:
    print(f"Import error: {e}")

app = Flask(__name__)
CORS(app)

# Register Blueprint
app.register_blueprint(meal_plan_bp, url_prefix='/api')
print("Registered blueprint")

@app.route('/ping', methods=['GET'])
def ping():
    return {"message": "pong"}

# Print all registered routes
print("Registered routes:")
for rule in app.url_map.iter_rules():
    print(f"  {rule.rule} -> {rule.methods}")

if __name__ == '__main__':
    app.run(debug=True)