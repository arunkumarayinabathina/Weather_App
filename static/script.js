let isCelsius = true;  
function getWeather() {
    let city = document.getElementById("city").value;
    let weatherDiv = document.getElementById("weather");

    if (!city) {
        weatherDiv.innerHTML = "<p style='color:red;'>Please enter a city name</p>";
        return;
    }

    fetch(`/weather?city=${city}&units=${isCelsius ? 'metric' : 'imperial'}`)
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            weatherDiv.innerHTML = `<p style="color:red;">${data.error}</p>`;
        } else {
            displayWeather(data);
        }
    })
    .catch(error => {
        weatherDiv.innerHTML = "<p style='color:red;'>Error fetching data</p>";
    });
}

function getGeolocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetch(`/weather?lat=${lat}&lon=${lon}&units=${isCelsius ? 'metric' : 'imperial'}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    document.getElementById("weather").innerHTML = `<p style="color:red;">${data.error}</p>`;
                } else {
                    displayWeather(data);
                }
            });
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function toggleUnits() {
    isCelsius = !isCelsius;
    let city = document.getElementById("city").value;
    if (city) {
        getWeather();
    }
}

function displayWeather(data) {
    let weatherDiv = document.getElementById("weather");
    let temperature = isCelsius ? data.temperature : (data.temperature * 9/5) + 32; // Convert to Fahrenheit if needed
    let tempUnit = isCelsius ? '°C' : '°F';

    weatherDiv.innerHTML = `
        <h2>${data.city}</h2>
        <p>Temperature: ${temperature.toFixed(1)}${tempUnit}</p>
        <p>Humidity: ${data.humidity}%</p>
        <p>Condition: ${data.condition}</p>
        <img src="${data.icon}" alt="Weather Icon">
    `;
}
