from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
import os

# ---------------------------------------
# Load Environment Variables
# ---------------------------------------

load_dotenv()

API_KEY = os.environ.get("GROQ_API_KEY")

print("GROQ KEY STATUS:", "FOUND" if API_KEY else "MISSING")

if not API_KEY:
    raise ValueError("GROQ_API_KEY environment variable missing")

client = OpenAI(
    api_key=API_KEY,
    base_url="https://api.groq.com/openai/v1"
)

# ---------------------------------------
# FastAPI App
# ---------------------------------------

app = FastAPI()

# ---------------------------------------
# Enable CORS
# ---------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------
# Input Model
# ---------------------------------------

class NutritionRequest(BaseModel):
    name: str
    age: int
    gender: str
    height: float
    weight: float
    disease: str
    activity: str
    foodPreference: str
    goal: str
    allergies: str

# ---------------------------------------
# Home Route
# ---------------------------------------

@app.get("/")
def home():
    return {
        "message": "NutriAI Backend Running Successfully!"
    }

# ---------------------------------------
# Generate Nutrition Plan
# ---------------------------------------

@app.post("/generate-plan")
def generate_plan(user: NutritionRequest):

    prompt = f"""
You are an expert Clinical Dietitian and Nutritionist.

Create a personalized nutrition plan for the following patient.

Patient Details:

Name: {user.name}
Age: {user.age}
Gender: {user.gender}
Height: {user.height} cm
Weight: {user.weight} kg
Medical Condition: {user.disease}
Activity Level: {user.activity}
Food Preference: {user.foodPreference}
Goal: {user.goal}
Food Allergies: {user.allergies}

Generate ONLY HTML.

Include the following sections:

<h2>Personalized Nutrition Plan</h2>

<h3>Breakfast</h3>
<ul>
<li>...</li>
</ul>

<h3>Morning Snack</h3>
<ul>
<li>...</li>
</ul>

<h3>Lunch</h3>
<ul>
<li>...</li>
</ul>

<h3>Evening Snack</h3>
<ul>
<li>...</li>
</ul>

<h3>Dinner</h3>
<ul>
<li>...</li>
</ul>

<h3>Daily Calories</h3>

<h3>Protein Requirement</h3>

<h3>Carbohydrates</h3>

<h3>Healthy Fats</h3>

<h3>Water Intake</h3>

<h3>Foods To Avoid</h3>

<h3>Lifestyle Tips</h3>

<h3>Medical Disclaimer</h3>

Rules:
- Recommend Indian foods whenever possible.
- Use bullet points.
- Do NOT use Markdown.
- Return ONLY HTML.
"""

    try:

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional clinical dietitian and nutrition expert."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=1500
        )

        html = response.choices[0].message.content

        return {
            "plan": html
        }

    except Exception as e:

        return {
            "plan": f"<h2>Error</h2><p>{str(e)}</p>"
        }