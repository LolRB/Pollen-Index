const apiKey = "161ecb95bf612fc1d56530060a842aef";
const pollenApiKey = "AIzaSyBPT5CD2o4JeOADd5o1m_7wkx9wgVopfh4";
const pollen = document.getElementById("pollen");
const searchButton = document.getElementById("search-button1");
const cities = document.getElementById("cities1");
const modal = document.getElementById("modal1");
const modalBg = document.getElementById("modalBg1");
const input = document.getElementById("city-input1");

function cityApi() {
  const city = document.getElementById("city-input1").value;
  const cityRequestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

  fetch(cityRequestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      if (data && data.length > 0) {
        const latitude = data[0].lat;
        const longitude = data[0].lon;
        const cityName = data[0].name;

        saveCityData(cityName, { latitude, longitude }); // Save city data in local storage
        createCityButton(cityName); // Create button for the city
        displayCityData(cityName); // Display city data
      } else {
        console.error("No data found for the specified city.");
      }
    })
    .catch(function (error) {
      console.error("Error fetching city data:", error);
    });
}

function getApi(lat, lon, cityName) {
  const requestUrl = `https://pollen.googleapis.com/v1/forecast:lookup?key=${pollenApiKey}&location.longitude=${lon}&location.latitude=${lat}&days=1`;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      if (data && data.dailyInfo && data.dailyInfo.length > 0) {
        const pollenInfo = data.dailyInfo[0];

        // Extract date
        const date = new Date(
          pollenInfo.date.year,
          pollenInfo.date.month - 1,
          pollenInfo.date.day
        );

        // Create elements to display pollen information
        const pollenItem = document.createElement("div");
        pollenItem.className = "pollen-item box";

        const dateElement = document.createElement("p");
        dateElement.textContent = `Date: ${date.toLocaleDateString()}`;
        pollenItem.appendChild(dateElement);

        // Loop through plantInfo to display specific plant information that are in season
        const inSeasonPlants = pollenInfo.plantInfo.filter(
          (plant) => plant.inSeason
        );

        inSeasonPlants.forEach((plant, pollenType) => {
          const plantElement = document.createElement("div");
          plantElement.className = "plant-item box";

          const displayName = plant.displayName;
          const plantType = plant.plantDescription
            ? plant.plantDescription.type
            : "Unknown type";
          const indexDescription = plant.indexInfo
            ? plant.indexInfo.indexDescription
            : "No description available";
          const category = plant.indexInfo
            ? plant.indexInfo.category
            : "No category available";

          const healthRecommendations = pollenType.healthRecommendations;

          const displayNameElement = document.createElement("p");
          displayNameElement.textContent = `Plant Name: ${displayName}`;
          plantElement.appendChild(displayNameElement);

          const plantTypeElement = document.createElement("p");
          plantTypeElement.textContent = `Type: ${plantType}`;
          plantElement.appendChild(plantTypeElement);

          const categoryElement = document.createElement("p");
          categoryElement.textContent = `Category: ${category}`;
          plantElement.appendChild(categoryElement);

          const indexDescriptionElement = document.createElement("p");
          indexDescriptionElement.textContent = `Description: ${indexDescription}`;
          plantElement.appendChild(indexDescriptionElement);

          // Add health recommendations for the specific plant type if available
          if (
            pollenType.healthRecommendations &&
            pollenType.healthRecommendations.length > 0
          ) {
            const recommendationsHeader = document.createElement("p");
            recommendationsHeader.textContent = "Health Recommendations:";
            pollenTypeElement.appendChild(recommendationsHeader);

            pollenType.healthRecommendations.forEach((recommendation) => {
              const recommendationElement = document.createElement("p");
              recommendationElement.textContent = recommendation;
              pollenTypeElement.appendChild(recommendationElement);
            });
          }

          pollenItem.appendChild(plantElement);
        });

        // Clear previous pollen information
        pollen.innerHTML = "";
        // Append the pollen information to the pollen div
        pollen.appendChild(pollenItem);

        // If no plants are in season, show a message
        if (inSeasonPlants.length === 0) {
          pollen.innerHTML = "<p>No plants are in season.</p>";
        }
      } else {
        pollen.innerHTML = "<p>No pollen data available.</p>";
      }
    })
    .catch(function (error) {
      console.error("Error fetching pollen data:", error);
    });
}

// Save city data in local storage
function saveCityData(cityName, cityData) {
  localStorage.setItem(cityName, JSON.stringify(cityData));
}

// Retrieve city data from local storage
function getCityData(cityName) {
  return JSON.parse(localStorage.getItem(cityName));
}

function displayCityData(cityName) {
  const cityData = getCityData(cityName);
  if (cityData) {
    getApi(cityData.latitude, cityData.longitude, cityName);
  }
}

function createCityButton(cityName) {
  const button = document.createElement("button");
  button.textContent = cityName;
  button.classList.add("button", "mt-1", "is-link", "is-small");
  button.addEventListener("click", () => displayCityData(cityName));
  cities.appendChild(button);
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
