async function fetchWeather(location) {
  const apiKey = "MY9BABHVYFQ53RFAUW43VL65D";

  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${apiKey}`,
      { mode: "cors" }
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
  const time = getCurrentTime(timezone);
  const date = getCurrentDate(timezone);

  return {
    date: date,
    time: time,
    location: data.resolvedAddress,
    description: data.description,
    temperatureF: currentConditions.temp, // Fahrenheit from API
    temperatureC: toCelsius(currentConditions.temp), // Convert to Celsius
    feelsLikeF: currentConditions.feelslike, // Fahrenheit feels like
    feelsLikeC: toCelsius(currentConditions.feelslike), // Convert to Celsius
    condition: currentConditions.conditions,
    humidity: currentConditions.humidity,
    windSpeed: currentConditions.windspeed,
    sunrise: currentConditions.sunrise,
    sunset: currentConditions.sunset,
    currentTime: currentConditions.datetime,
  
  };
}

function getCurrentDate(timeZone) {
  const now = new Date();

  const options = {
    timeZone: timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  // Format the date
  const formatter = new Intl.DateTimeFormat("en-US", options);
  const formattedDate = formatter.format(now);

  return formattedDate;
}

function getCurrentTime(timeZone) {
  const now = new Date();

  const options = {
    timeZone: timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  // Format the time
  const formatter = new Intl.DateTimeFormat("en-US", options);
  const formattedTime = formatter.format(now);

  return formattedTime;
}

// Display Weather Information
function displayWeather(data, unit = "F") {
  const weatherInfo = document.getElementById("weather-info");

  // Choose temperature and feels-like values based on the unit
  const temperature =
    unit === "F" ? `${data.temperatureF}°F` : `${data.temperatureC}°C`;
  const feelsLike =
    unit === "F" ? `${data.feelsLikeF}°F` : `${data.feelsLikeC}°C`;

  weatherInfo.innerHTML = `
    <h2>${data.location}</h2>
    <span class="dateTime">${data.date}</span>
    <span class="dateTime">${data.time}</span>

    <p id="temp">${temperature}</p>
    <p id="condition">${data.condition}</p>
    <p>Feels Like: ${feelsLike}</p>
    <p>Humidity Level: ${data.humidity}%</p>
    <p>Wind Speed: ${data.windSpeed}k/m</p>
    <p>${data.description}</p>
  `;

  changeBg(data.condition);
}

function changeBg(condition) {
  switch (condition) {
    case "Clear":
      document.body.style.backgroundImage = 'url("./images/clear.webp")';
      break;
    case "Partially cloudy":
      document.body.style.backgroundImage = 'url("./images/cloudy.jpg")';
      break;
    case "Rain":
    case "Drizzle":
    case "Mist":
      document.body.style.backgroundImage = 'url("./images/rainy.avif")';
      break;
    case "Cloudy":
      document.body.style.backgroundImage = 'url("./images/cloudy.avif")';
      break;
    case "thunder-rain":
      document.body.style.backgroundImage = 'url("./images/thunder.avif")';
      break;
    case "Thunderstorm":
      document.body.style.backgroundImage = 'url("./images/thunderstorm.jpg")';
      break;
    case "Snow":
      document.body.style.backgroundImage = 'url("./images/snow.jpg")';
      break;
    default:
      document.body.style.backgroundImage = 'url("./images/default.avif")';
      break;
  }
}

const toggle = document.getElementById("toggle");
let currentWeatherData = null; // Global variable to store the latest weather data

// Event listener for the switch button
toggle.addEventListener("change", () => {
  if (currentWeatherData) {
    const unit = toggle.checked ? "F" : "C"; // "F" for checked, "C" for unchecked
    displayWeather(currentWeatherData, unit); // Re-display with selected unit
  }
});


function toFahrenheit(temp) {
  return Math.round((temp - 32) * (5 / 9));
}

function toCelsius(temp) {
  return Math.round((temp - 32) * (5 / 9));
}

// Form Submission Handler
document
  .getElementById("location-form")
  .addEventListener("submit", async (event) => {
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


async function init() {
  const defaultLocation = "Madaripur"; // Default location

  document.getElementById("loading").style.display = "block"; // Show loading indicator

  const weatherData = await fetchWeather(defaultLocation);

  if (weatherData) {
    const processedData = processWeatherData(weatherData);
    currentWeatherData = processedData; // Store the processed data in currentWeatherData
    displayWeather(processedData);
  }

  document.getElementById("loading").style.display = "none"; // Hide loading indicator
}

init();
