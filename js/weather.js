const apiKey = "161ecb95bf612fc1d56530060a842aef";
const weatherHeader = document.getElementById("weatherHeader");
const weather = document.getElementById("weather");
const headerForecast = document.getElementById("forecastHeader");
const nextDaysForecast = document.getElementById("next5Days");
const searchButton = document.getElementById("search-button");
const cities = document.getElementById("cities");
const modal = document.getElementById("modal");
const modalBg = document.getElementById("modalBg");
const input = document.getElementById("city-input");

function cityApi() {
  const city = document.getElementById("city-input").value;
  const cityRequestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

  fetch(cityRequestUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      if (data && data.length > 0) {
        const latitude = data[0].lat;
        const longitude = data[0].lon;
        const cityName = data[0].name;

        getApi(latitude, longitude, cityName);
      } else {
        console.error("No data found for the specified city.");
      }
    })
    .catch((error) => {
      console.error("Error fetching city data:", error);
    });
}

function getApi(lat, lon, cityName) {
  const requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  fetch(requestUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      displayTodaysWeather(data, cityName);
      displayNextFiveDaysWeather(data, cityName);
      saveToLocalStorage(cityName, data); // Save weather data to local storage
      createCityButton(cityName, data); // Create button for city name
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}

function displayTodaysWeather(data, cityName) {
  // Clear previous weather data
  weatherHeader.innerHTML = "";
  weather.innerHTML = "";

  // Display the city name
  const cityHeader = document.createElement("h2");
  cityHeader.textContent = `Weather in ${cityName} (Today)`;
  weatherHeader.appendChild(cityHeader);

  if (data && data.list && data.list.length > 0) {
    const now = new Date().getTime() / 1000; // Current time in seconds since epoch
    const threeHoursLater = now + 3 * 3600; // 3 hours later in seconds since epoch

    const todaysWeather = data.list.filter((item) => {
      return item.dt <= threeHoursLater;
    });

    if (todaysWeather.length > 0) {
      displayWeatherDay(todaysWeather[todaysWeather.length - 1], "Next 3 Hours", weather);
    } else {
      weather.innerHTML += "<p>No weather data available for the next 3 hours.</p>";
    }
  } else {
    weather.innerHTML = "<p>No weather data available.</p>";
  }
}

function displayNextFiveDaysWeather(data, cityName) {
  // Clear previous forecast data
  headerForecast.innerHTML = "";
  nextDaysForecast.innerHTML = "";

  const forecastHeader = document.createElement("h2");
  forecastHeader.textContent = `5-Day Weather Forecast in ${cityName}`;
  headerForecast.appendChild(forecastHeader);

  if (data && data.list && data.list.length > 0) {
    const forecastDays = {};

    // Collect midday data points for the next five days
    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const day = date.toISOString().split("T")[0];
      const hour = date.getUTCHours();

      if (!forecastDays[day] && hour === 12) {
        forecastDays[day] = item;
      }
    });

    const days = Object.keys(forecastDays).sort();
    const nextFiveDays = days.slice(0, 5);

    nextFiveDays.forEach((day) => {
      displayWeatherDay(forecastDays[day], day, nextDaysForecast);
    });
  } else {
    nextDaysForecast.innerHTML +=
      "<p>No weather data available for the next 5 days.</p>";
  }
}

function saveToLocalStorage(cityName, data) {
  const weatherData = {};
  const forecastDays = Object.keys(data).slice(0, 6);

  forecastDays.forEach((day) => {
    weatherData[day] = data[day];
  });

  localStorage.setItem(cityName, JSON.stringify(weatherData));
}

function createCityButton(cityName, data) {
  const cityButton = document.createElement("button");
  cityButton.classList.add ("button", "mt-1", "is-link", "is-small");
  cityButton.textContent = cityName;

  cityButton.addEventListener("click", function () {
    const storedData = localStorage.getItem(cityName);
    if (storedData) {
      const weatherData = JSON.parse(storedData);
      displayTodaysWeather(weatherData, cityName);
      displayNextFiveDaysWeather(weatherData, cityName);
    } else {
      console.error("Weather data not found for the selected city.");
    }
  });

  cities.appendChild(cityButton);
}

function displayWeatherDay(dayData, dayLabel, container) {
  const weatherItem = document.createElement("div");
  weatherItem.className = "weather-item box";

  const date = new Date(dayData.dt * 1000).toLocaleDateString();
  const iconUrl = `https://openweathermap.org/img/wn/${dayData.weather[0].icon}@2x.png`;
  const temperature = (dayData.main.temp - 273.15).toFixed(2);
  const humidity = dayData.main.humidity;
  const windSpeed = dayData.wind.speed;

  weatherItem.innerHTML = `
    <p><strong>${dayLabel} (${date}):</strong></p>
    <img src="${iconUrl}" alt="${dayData.weather[0].description}">
    <p><strong>Temperature:</strong> ${temperature} °C</p>
    <p><strong>Humidity:</strong> ${humidity}%</p>
    <p><strong>Wind Speed:</strong> ${windSpeed} m/s</p>
  `;

  container.appendChild(weatherItem);
}

searchButton.addEventListener("click", () => {
  if (input.value === "") {
    modal.classList.add("is-active");
  } else {
    cityApi();
  }
});

modalBg.addEventListener("click", () => {
  modal.classList.remove("is-active");
});
