from flask import Flask, request, jsonify, render_template
import requests
import os
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("WEATHER_API_KEY")

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city')
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    units = request.args.get('units', 'metric')  

    if not city and (not lat or not lon):
        return jsonify({"error": "City name or geolocation is required"}), 400

    if city:
        url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units={units}"
    elif lat and lon:
        url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units={units}"

    try:
        response = requests.get(url)
        data = response.json()

        if response.status_code == 404:
            return jsonify({"error": "City or geolocation not found"}), 404
        
        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch weather data"}), response.status_code

        weather_info = {
            "city": data.get("name", "Unknown location"),
            "temperature": data["main"]["temp"],
            "humidity": data["main"]["humidity"],
            "condition": data["weather"][0]["description"],
            "icon": f"http://openweathermap.org/img/wn/{data['weather'][0]['icon']}.png"
        }

        return jsonify(weather_info)

    except requests.exceptions.RequestException as e:
        return jsonify({"error": "API request failed", "details": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)


