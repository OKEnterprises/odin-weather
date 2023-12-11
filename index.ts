interface APIData {
    location: WeatherLocation,
    current: CurrentWeather,
    forecast: Forecast
}

interface WeatherLocation {
    name: string,
    region: string,
    country: string,
    lat: number,
    long: number,
    tz_id: string,
    localtime_epoch: number,
    localtime: string
}

interface CurrentWeather {
    last_updated_epoch: number,
    last_updated: string,
    temp_c: number,
    temp_f: number,
    is_day: number,
    condition: WeatherCondition,
    wind_mph: number,
    wind_kph: number,
    wind_degree: number,
    wind_dir: string,
    pressure_mb: number,
    pressure_in: number,
    precip_mm: number,
    precip_in: number,
    humidity: number,
    cloud: number,
    feelslike_c: number,
    feelslike_f: number,
    vis_km: number,
    vis_miles: number,
    uv: number,
    gust_mph: number,
    gust_kph: number
}

interface WeatherCondition {
    text: string,
    icon: string,
    code: number
}

interface Forecast {
    forecastday: ForecastDay[]
}

interface ForecastDay {
    astro: Astro,
    date: string,
    date_epoch: number,
    day: WeatherDay,
    hour: WeatherHour[]
}

interface Astro {
    is_moon_up: number,
    is_sun_up: number,
    moon_illumination: number,
    moon_phase: string,
    moonrise: string,
    moonset: string,
    sunrise: string,
    sunset: string,
}

interface WeatherDay {
    maxtemp_c: number,
    maxtemp_f: number,
    mintemp_c: number,
    mintemp_f: number,
    avgtemp_c: number,
    avgtemp_f: number,
    maxwind_mph: number,
    maxwind_kph: number,
    totalprecip_mm: number,
    totalprecip_in: number,
    totalsnow_cm: number,
    avgvis_km: number,
    avgvis_miles: number,
    avghumidity: number,
    daily_will_it_rain: number,
    daily_chance_of_rain: number,
    daily_will_it_snow: number,
    daily_chance_of_snow: number,
    condition: WeatherCondition,
    uv: number
}

interface WeatherHour {
    time_epoch: number,
    time: string,
    temp_c: number,
    temp_f: number,
    is_day: number,
    condition: WeatherCondition,
    wind_mph: number,
    wind_kph: number,
    wind_degree: number,
    wind_dir: string,
    pressure_mb: number,
    pressure_in: number,
    precip_mm: number,
    precip_in: number,
    humidity: number,
    cloud: number,
    feelslike_c: number,
    feelslike_f: number,
    windchill_c: number,
    windchill_f: number,
    heatindex_c: number,
    heatindex_f: number,
    dewpoint_c: number,
    dewpoint_f: number,
    will_it_rain: number,
    chance_of_rain: number,
    will_it_snow: number,
    chance_of_snow: number,
    vis_km: number,
    vis_miles: number,
    gust_mph: number,
    gust_kph: number,
    uv: number
}

type CurrentWeatherComponent = HTMLDivElement;
type LocationInputComponent = HTMLFormElement;

const API_KEY = "4196d93d11fa4ba084241415230909";

async function getThreeDayForecast(location: string): Promise<APIData> {
    const data = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=2&aqi=no&alerts=no`, { mode: "cors" });
    
    if (!data.ok) {
        throw new Error(`Failed to fetch data: ${data.status} ${data.statusText}`);
    }

    return data.json();
}


const page = (() => {
    let celsius = false;
    let locale = "Boston";

    function toggleCelsius() {
        celsius = !celsius;
    }

    function locationInput(): LocationInputComponent {
        const form: LocationInputComponent = document.createElement('form');

        const locationInputLabel = document.createElement('label');
        locationInputLabel.htmlFor = "location-input";     
        locationInputLabel.textContent = "Location";

        const locationInput = document.createElement('input');
        locationInput.classList.add('location-input')
        locationInput.type = "text";
        locationInput.id = "location-input";
        locationInput.name = "location-input";

        function updateLocation(e: Event): void {
            e.preventDefault();
            locale = locationInput.value;
            render();
        }

        locationInput.addEventListener('submit', (e) => updateLocation(e));

        const button = document.createElement('button');
        button.classList.add('btn', 'btn-submit');

        button.addEventListener('click', (e) => updateLocation(e));

        form.append(locationInput, button);
        return form;
    }

    function currentWeatherDisplay(curr: CurrentWeather): CurrentWeatherComponent {
        const display: CurrentWeatherComponent = document.createElement('div');
        display.classList.add('curr-weather-container');

        const last_updated = document.createElement('p');
        last_updated.classList.add('last-updated')
        last_updated.innerText = curr.last_updated;

        const temperatureContainer = document.createElement('div');
        temperatureContainer.classList.add('temperature-container');

        const temperature = document.createElement('p');
        temperature.classList.add("temperature");
        temperature.innerText = celsius ? `${curr.temp_c}°C` : `${curr.temp_f}°F`;

        const feelsLike = document.createElement('p');
        feelsLike.classList.add('feels-like');
        feelsLike.innerText = celsius ? `Feels like ${curr.feelslike_c}°C` : `Feels like ${curr.feelslike_f}°F`;

        temperatureContainer.append(temperature, feelsLike);

        const { text, icon, code } = curr.condition;

        const conditionContainer = document.createElement('div');
        conditionContainer.classList.add("condition-container");

        const conditionText = document.createElement('p');
        conditionText.classList.add('condition-text');
        conditionText.innerText = text;

        const conditionIcon = document.createElement('img');
        conditionIcon.classList.add('condition-icon');
        conditionIcon.src = "https:" + icon;

        conditionContainer.append(conditionText, conditionIcon);

        const windSpeedAndDir = document.createElement('p');
        windSpeedAndDir.classList.add("wind-speed-dir");
        windSpeedAndDir.innerText = celsius ? `${curr.wind_kph} kph ${curr.wind_dir}` : `${curr.wind_mph} mph ${curr.wind_dir}`;

        const humidity = document.createElement('p');
        humidity.classList.add('humidity')
        humidity.innerText = `${curr.humidity}%`;

        display.append(temperatureContainer, conditionContainer, windSpeedAndDir);

        return display;
    }

    async function render() {
        const currWeather = (await getThreeDayForecast(locale)).current;
        const body = document.querySelector('body')!;
        body.replaceChildren(currentWeatherDisplay(currWeather), locationInput());

        return body;
    }

    return {currentWeatherDisplay, render};
})();

page.render();