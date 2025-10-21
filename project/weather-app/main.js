// app.js
// Simple Weather App using OpenWeatherMap API (Current Weather).
// Replace `API_KEY` with your OpenWeatherMap API key.

const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY_HERE"; // <-- replace this

// DOM elements
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const weatherCard = document.getElementById("weatherCard");
const cityNameEl = document.getElementById("cityName");
const localTimeEl = document.getElementById("localTime");
const tempValueEl = document.getElementById("tempValue");
const weatherIconEl = document.getElementById("weatherIcon");
const descriptionEl = document.getElementById("description");
const feelsLikeEl = document.getElementById("feelsLike");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const pressureEl = document.getElementById("pressure");
const updatedAtEl = document.getElementById("updatedAt");
const errorEl = document.getElementById("error");

function showError(msg){
  errorEl.textContent = msg;
  errorEl.classList.remove("hidden");
  weatherCard.classList.add("hidden");
  setTimeout(()=> errorEl.classList.add("hidden"), 6000);
}

function displayWeather(data){
  // city & country
  const { name } = data;
  const country = data.sys?.country || "";
  cityNameEl.textContent = `${name}, ${country}`;

  // temp
  const tempC = Math.round(data.main.temp);
  tempValueEl.textContent = tempC;

  // description & icon
  const desc = data.weather[0].description;
  const iconCode = data.weather[0].icon; // e.g., "04d"
  descriptionEl.textContent = desc.charAt(0).toUpperCase() + desc.slice(1);
  weatherIconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  weatherIconEl.alt = desc;

  // other details
  feelsLikeEl.textContent = `${Math.round(data.main.feels_like)} °C`;
  humidityEl.textContent = `${data.main.humidity} %`;
  windEl.textContent = `${(data.wind.speed).toFixed(1)} m/s`;
  pressureEl.textContent = `${data.main.pressure} hPa`;

  // local time (calculate using timezone offset in seconds)
  const timezoneOffset = data.timezone || 0; // seconds
  const localDate = new Date((Date.now()) + timezoneOffset * 1000 - (new Date().getTimezoneOffset() * 60000));
  localTimeEl.textContent = localDate.toLocaleString([], {hour: '2-digit', minute: '2-digit', weekday: 'short', day: 'numeric', month: 'short'});

  // updated at
  updatedAtEl.textContent = new Date().toLocaleString();

  // show card
  weatherCard.classList.remove("hidden");
  errorEl.classList.add("hidden");
}

// fetch by city name
async function fetchWeatherByCity(city){
  if(!city) return showError("Please enter a city name.");
  try{
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
    const res = await fetch(url);
    if(!res.ok){
      if(res.status === 404) throw new Error("City not found. Try another name.");
      throw new Error("Failed to fetch weather data.");
    }
    const data = await res.json();
    displayWeather(data);
  }catch(err){
    showError(err.message);
    console.error(err);
  }
}

// fetch by lat & lon
async function fetchWeatherByCoords(lat, lon){
  try{
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const res = await fetch(url);
    if(!res.ok) throw new Error("Failed to fetch weather data for coordinates.");
    const data = await res.json();
    displayWeather(data);
  }catch(err){
    showError(err.message);
  }
}

// event listeners
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  fetchWeatherByCity(city);
});
cityInput.addEventListener("keyup", (e) => {
  if(e.key === "Enter") searchBtn.click();
});

// geolocation
locationBtn.addEventListener("click", () => {
  if(!navigator.geolocation){
    return showError("Geolocation is not supported in this browser.");
  }
  navigator.geolocation.getCurrentPosition((pos) => {
    const { latitude, longitude } = pos.coords;
    fetchWeatherByCoords(latitude, longitude);
  }, (err) => {
    showError("Unable to retrieve your location. Allow location access and try again.");
  });
});

// optional: show a default city on load
document.addEventListener("DOMContentLoaded", () => {
  // remove this if you don't want auto-load
  fetchWeatherByCity("New Delhi");
});
