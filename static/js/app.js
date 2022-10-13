let searchString = "";
let searchBar = document.querySelector(".search>input");
let searchButton = document.querySelector(".search>button");
let form = document.querySelector(".search");
let geocoderURL = "http://api.openweathermap.org/geo/1.0/direct";
let forecastURL = "https://api.openweathermap.org/data/2.5/weather"
let weatherBody = document.querySelector("article");


async function searchCity(city) {
    let parameters = {
        method: "GET",
        body: {
            q: city,
            appid: "6019d87e9d80f3888ab222f96b6de708",
            limit: 5,
        },
    };
    let searchResponse = await fetch(`${geocoderURL}?q=${parameters.body.q}&appid=${parameters.body.appid}&limit=${parameters.body.limit}`);
    let searchData = await searchResponse.json();
    return searchData;
}


async function setResults(lat, lon, city) {
    let url = `${forecastURL}?lat=${lat}&lon=${lon}&appid=6019d87e9d80f3888ab222f96b6de708&units=metric`;
    let forecastResponse = await fetch(url);
    let forecastData = await forecastResponse.json();
    let image = weatherBody.querySelector("img");
    let cityName = document.querySelector(".city-name");
    image.src = `http://openweathermap.org/img/w/${forecastData.weather[0].icon}.png`;
    cityName.textContent = city;
    let temperature = document.querySelector(".temp");
    temperature.textContent = `${forecastData.main.temp}`;
    let description = document.querySelector(".description");
    description.textContent = forecastData.weather[0].description;
}

async function init() {
    let cityData = await searchCity("Chennai");
    let city = cityData[0];
    await setResults(city.lat, city.lon, city.name);
}



// given latitude and longitude, give weather results
function giveWeatherResults(lat, lon) {
    return async function(evt=null) {
        evt.stopPropagation();
        console.log(lat, lon);
        let url = `${forecastURL}?lat=${lat}&lon=${lon}&appid=6019d87e9d80f3888ab222f96b6de708&units=metric`;
        let forecastResponse = await fetch(url);
        let forecastData = await forecastResponse.json();
        console.log(forecastData.main.temp, forecastData.main.feels_like, forecastData.weather[0].main, forecastData.weather[0].description, forecastData.weather[0].icon);
        let image = weatherBody.querySelector("img");
        let cityName = document.querySelector(".city-name");
        image.src = `http://openweathermap.org/img/w/${forecastData.weather[0].icon}.png`;
        cityName.textContent = this.textContent;
        let temperature = document.querySelector(".temp");
        temperature.textContent = `${forecastData.main.temp}`;
        let description = document.querySelector(".description");
        description.textContent = forecastData.weather[0].description;
        this.parentElement.remove();
    }
}

// location function
function search(element=null) {
    return async function(evt=null) {
        evt.stopPropagation();
        let searchResults = document.querySelector(".search-results");
        if (!searchResults) {
            searchResults = document.createElement("div");
            searchResults.classList.add("search-results");
            form.appendChild(searchResults);
        }
        searchResults.innerHTML = "";
        let parameters = {
            method: "GET",
            body: {
                q: element.value,
                appid: "6019d87e9d80f3888ab222f96b6de708",
                limit: 5,
            },
        };
        try {
            let searchResponse = await fetch(`${geocoderURL}?q=${parameters.body.q}&appid=${parameters.body.appid}&limit=${parameters.body.limit}`);
            let searchData = await searchResponse.json();
            for (let city of searchData) {
                let button = document.createElement("button");
                button.type = "button";
                button.classList.add("search-data");
                button.textContent = `${city.name}`;
                searchResults.append(button);
                button.addEventListener('click', giveWeatherResults(city.lat, city.lon));
            }
            console.log(searchData);
        }
        catch(TypeError) {
            console.log(TypeError.message);
        }
    }
}
searchBar.addEventListener('input', search(searchBar));
searchBar.addEventListener('click', search(searchBar));
searchButton.addEventListener('click', search(searchBar));
document.addEventListener('click', () => {
    let searchResults = document.querySelector(".search-results");
    if (!searchResults) return;
    searchResults.remove();
});


// starter code
init();
