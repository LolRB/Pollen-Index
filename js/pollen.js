const apiKey = "161ecb95bf612fc1d56530060a842aef";
const pollenApiKey = "AIzaSyBPT5CD2o4JeOADd5o1m_7wkx9wgVopfh4";
const pollen = document.getElementById("pollen");
const searchButton = document.getElementById("search-button1");
const cities = document.getElementById("cities1");

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
