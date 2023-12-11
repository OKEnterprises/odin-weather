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
type UnitToggleComponent = HTMLButtonElement;
type LocationDisplayComponent = HTMLHeadingElement;

const API_KEY = "4196d93d11fa4ba084241415230909";

async function getThreeDayForecast(location: string): Promise<APIData> {
    const data = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=2&aqi=no&alerts=no`, { mode: "cors" });
    
    if (!data.ok) {
        throw new Error(`Failed to fetch data: ${data.status} ${data.statusText}`);
    }

    return data.json();
}

function celsiusToKelvin(temp_c: number): number {
    return temp_c + 273.15;
}

function kelvinToHexColor(temperatureKelvin: number, date: Date): string {
    const hour = date.getHours();
  
    // Define temperature range for color gradient
    const minTemperature = 184; // Cool colors
    const maxTemperature = 327; // Warm colors
  
    // Ensure the input temperature is within the defined range
    const temperature = Math.max(minTemperature, Math.min(temperatureKelvin, maxTemperature));
  
    // Calculate the color ratio within the range
    const ratio = (temperature - minTemperature) / (maxTemperature - minTemperature);
  
    // Define RGB values for cool and warm colors
    const coolColor = [0, 128, 255]; // Cool blue
    const warmColor = [255, 0, 0];   // Warm red
  
    // Interpolate between cool and warm colors based on the temperature ratio
    const interpolatedColor = coolColor.map((coolValue, index) => {
      const warmValue = warmColor[index];
      const interpolatedValue = Math.round(coolValue + ratio * (warmValue - coolValue));
      return Math.min(255, Math.max(0, interpolatedValue)); // Ensure the value is within the valid RGB range
    });
  
    // Adjust brightness based on the time of day (daytime vs nighttime)
    const isDaytime = hour >= 6 && hour < 18; // Assuming daytime is between 6 AM and 6 PM
    const brightnessFactor = isDaytime ? 0.8 : 0.6;
  
    // Apply brightness adjustment to each RGB component
    const adjustedColor = interpolatedColor.map(value => Math.round(value * brightnessFactor));
  
    // Convert RGB values to hex color
    const hexColor = adjustedColor.map(value => value.toString(16)
                                                .padStart(2, '0'))
                                  .join('');
  
    return `#${hexColor}`;
  }

function getContrastText(hexColor: string): string {
    // Convert hex color to RGB
    const hexToRgb = (hex: string): number[] => hex.match(/[A-Za-z0-9]{2}/g)!.map(v => parseInt(v, 16));
    const [r, g, b] = hexToRgb(hexColor);
  
    // Calculate relative luminance (perceived brightness) using the formula for sRGB
    const luminance = 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);
  
    // Determine the appropriate text color based on luminance
    const textColor = luminance > 0.5 ? '#000000' : '#ffffff';
  
    return textColor;
}  

const page = (() => {
    let celsius = false;
    let locale = "Boston";

    function toggleCelsius() {
        celsius = !celsius;
    }

    function locationDisplay(): LocationDisplayComponent {
        const display: LocationDisplayComponent = document.createElement('h1');
        display.classList.add("location-display");
        display.textContent = locale;
        return display;
    }

    function locationInput(): LocationInputComponent {
        const form: LocationInputComponent = document.createElement('form');
        form.classList.add("location-input-form");

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
        button.classList.add('btn', 'btn-submit', 'invisible-btn');
        button.textContent = '🔍';
        button.dataset.text = '🔍';

        button.addEventListener('click', (e) => updateLocation(e));

        form.append(locationInput, button);
        return form;
    }

    function currentWeatherDisplay(curr: CurrentWeather): CurrentWeatherComponent {
        const display: CurrentWeatherComponent = document.createElement('div');
        display.classList.add('curr-weather-container');

        const temperatureContainer = document.createElement('div');
        temperatureContainer.classList.add('temperature-container', 'sub-container');

        const temperature = document.createElement('p');
        temperature.classList.add("temperature");
        temperature.textContent = celsius ? `${curr.temp_c}` : `${curr.temp_f}`;
        
        const sup_c = () => {
            const c = document.createElement('sup');
            c.textContent = '°C';
            return c;
        }
        
        const sup_f = () => {
            const f = document.createElement('sup');
            f.textContent = '°F';
            return f
        }

        if (celsius) temperature.appendChild(sup_c());
        else temperature.appendChild(sup_f());

        const feelsLike = document.createElement('p');
        feelsLike.classList.add('feels-like');
        feelsLike.textContent = celsius ? `Feels like ${curr.feelslike_c}` : `Feels like ${curr.feelslike_f}`;
        
        if (celsius) feelsLike.appendChild(sup_c());
        else feelsLike.appendChild(sup_f());

        temperatureContainer.append(temperature, feelsLike);

        const conditionContainer = document.createElement('div');
        conditionContainer.classList.add('condition-container', 'sub-container');

        const conditionText = document.createElement('p');
        conditionText.classList.add('condition-text');
        conditionText.textContent = curr.condition.text;

        const conditionIcon = document.createElement('img');
        conditionIcon.classList.add('condition-icon');
        conditionIcon.src = "https:" + curr.condition.icon;

        conditionContainer.append(conditionText, conditionIcon);

        const detailsContainer = document.createElement('div');
        detailsContainer.classList.add('details-container', 'sub-container');

        const windSpeedAndDir = document.createElement('p');
        windSpeedAndDir.classList.add('wind-speed-dir');
        windSpeedAndDir.innerText = celsius ? `${curr.wind_kph} kph ${curr.wind_dir}` : `${curr.wind_mph} mph ${curr.wind_dir}`;

        const humidity = document.createElement('p');
        humidity.classList.add('humidity')
        humidity.innerText = `${curr.humidity}% humidity`;

        detailsContainer.append(windSpeedAndDir, humidity);

        const last_updated = document.createElement('p');
        const last_date = new Date(curr.last_updated);
        last_updated.classList.add('last-updated')
        last_updated.textContent = `Last updated ${last_date.toLocaleString()}`;

        const containersContainer = document.createElement('div');
        containersContainer.classList.add('containers-container');
        containersContainer.append(temperatureContainer, conditionContainer, detailsContainer);

        display.append(
            containersContainer,
            last_updated
        );

        const temp_k = celsiusToKelvin(curr.temp_c)
        const color = kelvinToHexColor(temp_k, last_date);
        const textColor = getContrastText(color);

        display.style.backgroundColor = color;
        display.style.color = textColor;
        document.body.style.backgroundColor = textColor;

        return display;
    }

    function unitToggle(): UnitToggleComponent {
        const toggle: UnitToggleComponent = document.createElement('button');
        const setting = celsius ? 'btn-us' : 'btn-eu';
        toggle.classList.add('btn', 'btn-units', 'round-btn', setting);
        toggle.textContent = celsius ? 'F' : 'C';

        function changeToggle(e: Event): void {
            e.preventDefault()
            toggleCelsius();
            render();
        }

        toggle.addEventListener('click', (e) => changeToggle(e));
        return toggle;
    }

    async function render() {
        const res = await getThreeDayForecast(locale);
        const currWeather = res.current;
        locale = res.location.name;

        const body = document.querySelector('body')!;
        body.replaceChildren(
            locationDisplay(),
            currentWeatherDisplay(currWeather), 
            locationInput(), 
            unitToggle()
        );

        return body;
    }

    return {render};
})();

page.render();