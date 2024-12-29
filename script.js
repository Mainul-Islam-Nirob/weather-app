async function fetchWeather(location) {
  const apiKey = 'MY9BABHVYFQ53RFAUW43VL65D';

  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${apiKey}`,
      { mode: 'cors' }
    );
    const data = await response.json();
    console.log("raw data", data)
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
    description: data.description,
    temperature: currentConditions.temp,
    condition: currentConditions.conditions,
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
    <h2>${data.location}</h2>

    <p>Temperature: ${data.temperature}°F</p>
    <p>Condition: ${data.condition}</p>
    <span>Feels Like: ${data.feelsLike}°F</span>
    <span>Humidity Level: ${data.humidity}%</span>
    <p>Wind Speed: ${data.windSpeed}k/m</p>
    <p>${data.description}</p>

  `;
  changeBg(data.condition)
 
}

function changeBg(condition) {
  switch (condition) {
    case 'Clear':
      document.body.style.backgroundImage = 'url("./images/clear.webp")';
      break;
    case 'Partially cloudy':
      document.body.style.backgroundImage = 'url("./images/cloudy.jpg")';
      break;
    case 'Rain':
      document.body.style.backgroundImage = 'url("./images/rainy.avif")';
      break;
    case 'Cloudy':
      document.body.style.backgroundImage = 'url("./images/cloudy.avif")';
      break;
    case 'thunder-rain':
      document.body.style.backgroundImage = 'url("./images/thunder.avif")';
      break;
    case 'Thunderstorm':
      document.body.style.backgroundImage = 'url("./images/thunderstorm.jpg")';
      break;
    case 'Snow':
      document.body.style.backgroundImage = 'url("./images/snow.jpg")';
      break;
    default:
      document.body.style.backgroundImage = 'url("./images/default.avif")';
      break;
  }
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
