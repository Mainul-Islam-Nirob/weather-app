async function fetchWeather(location) {
  const apiKey = 'MY9BABHVYFQ53RFAUW43VL65D';

  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${apiKey}`,
      { mode: 'cors' }
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

function processWeatherData(data) {
  const currentConditions = data.currentConditions;
  const timezone = data.timezone;

  return {
    location: data.resolvedAddress,
    temperature: currentConditions.temp,
    condition: currentConditions.conditions,
    description: currentConditions.description,
    humidity: currentConditions.humidity,
    windSpeed: currentConditions.windspeed,
    sunrise: currentConditions.sunrise,
    sunset: currentConditions.sunset,
    currentTime: currentConditions.datetime,
    feelsLike: currentConditions.feelslike,
  };
}


// Display Weather Information
function displayWeather(data) {
  const weatherInfo = document.getElementById("weather-info");
  weatherInfo.innerHTML = `
    <h2>Weather in ${data.location}</h2>
    <p>Temperature: ${data.temperature}°C</p>
    <p>Description: ${data.description}</p>
    <p>Humidity: ${data.humidity}%</p>
    <p>Wind Speed: ${data.windSpeed} m/s</p>
  `;
}

// Form Submission Handler
document.getElementById("location-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const location = document.getElementById("location-input").value.trim();
  if (!location) {
    alert("Please enter a location.");
    return;
  }

  document.getElementById("loading").style.display = "block";
  document.getElementById("weather-info").innerHTML = "";

  const weatherData = await fetchWeather(location);
  if (weatherData) {
    const processedData = processWeatherData(weatherData);
    displayWeather(processedData);
  }

  document.getElementById("loading").style.display = "none";
});
