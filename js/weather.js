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
      displayWeatherDay(
        todaysWeather[todaysWeather.length - 1],
        "Next 3 Hours",
        weather
      );
    } else {
      weather.innerHTML +=
        "<p>No weather data available for the next 3 hours.</p>";
    }
  } else {
    weather.innerHTML = "<p>No weather data available.</p>";
  }
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
